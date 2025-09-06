// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../interfaces/IYieldManager.sol";
import "../interfaces/IPiggyVault.sol";
import "../libraries/InterestCalculator.sol";

contract YieldManager is IYieldManager, Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    
    IPiggyVault public piggyVault;
    address public aiOracle;
    address public nftRewards;
    
    uint256 public totalRewardPool;
    uint256 public distributedRewards;
    uint256 public reserveRatio = 2000;
    
    uint256 public compoundingFrequency = 1;
    mapping(address => uint256) public lastAccrualTime;
    mapping(address => uint256) public userCompoundedBalance;
    
    mapping(address => mapping(uint256 => YieldPosition)) public userPositions;
    mapping(address => uint256) public userPositionCount;
    mapping(address => uint256) public totalUserYield;
    
    mapping(uint256 => uint256) public planMultipliers;
    uint256 public globalApyMultiplier = 10000;
    
    struct PerformanceMetrics {
        uint256 totalDeposits;
        uint256 totalWithdrawals;
        uint256 totalInterestPaid;
        uint256 averageAPY;
        uint256 lastUpdated;
    }
    
    PerformanceMetrics public metrics;
    
    mapping(uint256 => YieldOptimization) public optimizations;
    mapping(address => UserYieldData) public userYieldData;
    
    modifier onlyVault() {
        require(msg.sender == address(piggyVault), "Only vault can call");
        _;
    }
    
    modifier onlyAIOracle() {
        require(msg.sender == aiOracle, "Only AI oracle can call");
        _;
    }
    
    constructor() {
        planMultipliers[7] = 10000;
        planMultipliers[14] = 10000;
        planMultipliers[30] = 10000;
        planMultipliers[90] = 10000;
    }
    
    function setPiggyVault(address _piggyVault) external onlyOwner {
        require(_piggyVault != address(0), "Invalid vault address");
        piggyVault = IPiggyVault(_piggyVault);
    }
    
    function calculateEffectiveAPY(uint256 _planDays, uint256 _baseAPY) public view returns (uint256) {
        uint256 planMultiplier = planMultipliers[_planDays];
        uint256 effectiveAPY = _baseAPY.mul(planMultiplier).mul(globalApyMultiplier).div(10000).div(10000);
        return effectiveAPY;
    }
    
    function createYieldPosition(address _user, uint256 _amount, uint256 _planDays, uint256 _baseAPY) 
        external 
        onlyVault 
        returns (uint256) 
    {
        uint256 positionId = userPositionCount[_user]++;
        uint256 effectiveAPY = calculateEffectiveAPY(_planDays, _baseAPY);
        
        userPositions[_user][positionId] = YieldPosition({
            principal: _amount,
            accruedInterest: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + (_planDays * 1 days),
            apyBasisPoints: effectiveAPY,
            lastUpdateTime: block.timestamp,
            isActive: true
        });
        
        emit PositionCreated(_user, positionId, _amount, _planDays);
        return positionId;
    }
    
    function calculateAccruedInterest(address _user, uint256 _positionId) 
        external 
        view 
        returns (uint256) 
    {
        YieldPosition memory position = userPositions[_user][_positionId];
        
        if (!position.isActive || block.timestamp <= position.lastUpdateTime) {
            return 0;
        }
        
        uint256 currentTime = block.timestamp > position.endTime ? position.endTime : block.timestamp;
        uint256 timeElapsed = currentTime - position.lastUpdateTime;
        
        uint256 accruedInterest = InterestCalculator.calculateCompoundInterest(
            position.principal + position.accruedInterest,
            position.apyBasisPoints,
            timeElapsed,
            365 days
        );
        
        return accruedInterest;
    }
    
    function updateAccruedInterest(address _user, uint256 _positionId) external onlyVault {
        YieldPosition storage position = userPositions[_user][_positionId];
        require(position.isActive, "Position not active");
        
        uint256 newInterest = this.calculateAccruedInterest(_user, _positionId);
        
        if (newInterest > 0) {
            position.accruedInterest += newInterest;
            position.lastUpdateTime = block.timestamp > position.endTime ? position.endTime : block.timestamp;
            totalUserYield[_user] += newInterest;
            
            emit YieldAccrued(_user, _positionId, newInterest, block.timestamp);
        }
    }
    
    function updateAllUserPositions(address _user) external onlyVault {
        uint256 positionCount = userPositionCount[_user];
        
        for (uint256 i = 0; i < positionCount; i++) {
            if (userPositions[_user][i].isActive) {
                this.updateAccruedInterest(_user, i);
            }
        }
        
        lastAccrualTime[_user] = block.timestamp;
    }
    
    function calculateAndDistributeBonus(
        address _user,
        uint256 _positionId,
        string calldata _bonusType
    ) external onlyVault returns (uint256 bonusAmount) {
        YieldPosition storage position = userPositions[_user][_positionId];
        require(position.isActive, "Position not active");
        
        this.updateAccruedInterest(_user, _positionId);
        
        if (keccak256(abi.encodePacked(_bonusType)) == keccak256(abi.encodePacked("completion"))) {
            bonusAmount = (position.principal + position.accruedInterest) * 500 / 10000;
        } else if (keccak256(abi.encodePacked(_bonusType)) == keccak256(abi.encodePacked("loyalty"))) {
            uint256 userTier = _calculateUserTier(_user);
            bonusAmount = (position.principal + position.accruedInterest) * (userTier * 100) / 10000;
        } else if (keccak256(abi.encodePacked(_bonusType)) == keccak256(abi.encodePacked("early_adopter"))) {
            bonusAmount = (position.principal + position.accruedInterest) * 300 / 10000;
        }
        
        if (bonusAmount > 0 && bonusAmount <= totalRewardPool) {
            totalRewardPool -= bonusAmount;
            distributedRewards += bonusAmount;
            totalUserYield[_user] += bonusAmount;
            
            emit BonusDistributed(_user, bonusAmount, _bonusType);
        }
        
        return bonusAmount;
    }
    
    function finalizePosition(address _user, uint256 _positionId) 
        external 
        onlyVault 
        returns (uint256 principal, uint256 totalInterest) 
    {
        YieldPosition storage position = userPositions[_user][_positionId];
        require(position.isActive, "Position not active");
        
        this.updateAccruedInterest(_user, _positionId);
        
        principal = position.principal;
        totalInterest = position.accruedInterest;
        
        position.isActive = false;
        position.lastUpdateTime = block.timestamp;
        
        return (principal, totalInterest);
    }
    
    function recordDeposit(address _user, uint256 _amount, uint256 _planDays, uint256 _baseAPY) 
        external 
        onlyVault 
        returns (uint256) 
    {
        uint256 positionId = userPositionCount[_user];
        uint256 effectiveAPY = calculateEffectiveAPY(_planDays, _baseAPY);
        
        userPositions[_user][positionId] = YieldPosition({
            principal: _amount,
            accruedInterest: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + (_planDays * 1 days),
            apyBasisPoints: effectiveAPY,
            lastUpdateTime: block.timestamp,
            isActive: true
        });
        
        userPositionCount[_user]++;
        
        metrics.totalDeposits = metrics.totalDeposits.add(_amount);
        metrics.lastUpdated = block.timestamp;
        
        UserYieldData storage userData = userYieldData[_user];
        userData.totalDeposited = userData.totalDeposited.add(_amount);
        userData.transactionCount++;
        userData.lastActivity = block.timestamp;
        userData.preferredPlan = _planDays;
        
        emit PositionCreated(_user, positionId, _amount, _planDays);
        emit PerformanceMetricsUpdated(metrics.totalDeposits, metrics.averageAPY);
        
        return positionId;
    }
    
    function recordWithdrawal(
        address _user,
        uint256 _positionId,
        uint256 _principal,
        uint256 _interest,
        uint256 _bonus
    ) external onlyVault {
        (uint256 principal, uint256 totalInterest) = this.finalizePosition(_user, _positionId);
        
        metrics.totalWithdrawals = metrics.totalWithdrawals.add(_principal);
        metrics.totalInterestPaid = metrics.totalInterestPaid.add(_interest).add(_bonus);
        metrics.lastUpdated = block.timestamp;
        
        UserYieldData storage userData = userYieldData[_user];
        userData.totalEarned = userData.totalEarned.add(_interest).add(_bonus);
        userData.totalWithdrawn = userData.totalWithdrawn.add(_principal);
        userData.transactionCount++;
        userData.lastActivity = block.timestamp;
        
        distributedRewards = distributedRewards.add(_interest).add(_bonus);
        
        emit RewardDistributed(_user, _interest.add(_bonus), "WITHDRAWAL_REWARD");
        emit PerformanceMetricsUpdated(metrics.totalDeposits, metrics.averageAPY);
    }
    
    function getCurrentAPY(uint256 _planDays) external view returns (uint256) {
        return calculateEffectiveAPY(_planDays, getBasePlanAPY(_planDays));
    }
    
    function getBasePlanAPY(uint256 _planDays) public pure returns (uint256) {
        if (_planDays == 7) return 500;
        if (_planDays == 14) return 800;
        if (_planDays == 30) return 1200;
        if (_planDays == 90) return 1800;
        return 0;
    }
    
    function getUserYieldSummary(address _user) 
        external 
        view 
        returns (uint256 totalYield, uint256 activePositions, uint256 pendingRewards) 
    {
        totalYield = totalUserYield[_user];
        
        uint256 positionCount = userPositionCount[_user];
        for (uint256 i = 0; i < positionCount; i++) {
            YieldPosition memory position = userPositions[_user][i];
            if (position.isActive) {
                activePositions++;
                
                uint256 timeElapsed = block.timestamp > position.endTime 
                    ? position.endTime - position.startTime 
                    : block.timestamp - position.startTime;
                    
                uint256 interest = InterestCalculator.calculateCompoundInterest(
                    position.principal,
                    position.apyBasisPoints,
                    timeElapsed,
                    position.endTime - position.startTime
                );
                
                pendingRewards = pendingRewards.add(interest);
            }
        }
    }
    
    function getOptimizationSuggestions(address _user) 
        external 
        view 
        returns (YieldOptimization memory) 
    {
        UserYieldData memory userData = userYieldData[_user];
        uint256 preferredPlan = userData.preferredPlan > 0 ? userData.preferredPlan : 30;
        
        return optimizations[preferredPlan];
    }
    
    function receiveAIOptimization(
        uint256 _planDays,
        uint256 _suggestedAPY,
        uint256 _riskScore,
        uint256 _confidence,
        string calldata _strategy
    ) external onlyAIOracle {
        require(_riskScore <= 100, "Invalid risk score");
        require(_confidence <= 100, "Invalid confidence level");
        
        optimizations[_planDays] = YieldOptimization({
            suggestedAPY: _suggestedAPY,
            riskScore: _riskScore,
            confidence: _confidence,
            timestamp: block.timestamp,
            strategy: _strategy
        });
        
        emit AIOptimizationReceived(_planDays, _suggestedAPY, _riskScore);
    }
    
    function calculatePlatformHealth() 
        external 
        view 
        returns (uint256 healthScore, uint256 utilizationRate, uint256 avgAPY) 
    {
        if (totalRewardPool > 0) {
            utilizationRate = distributedRewards.mul(10000).div(totalRewardPool);
        }
        
        avgAPY = (500 + 800 + 1200 + 1800) / 4;
        
        healthScore = 100;
        
        if (utilizationRate > 8000) {
            healthScore = healthScore.sub((utilizationRate.sub(8000)).div(100));
        }
        
        if (healthScore < 50) {
            healthScore = 50;
        }
    }
    
    function getUserYieldData(address _user) external view returns (UserYieldData memory) {
        return userYieldData[_user];
    }
    
    function getUserYieldRanking(address _user) external view returns (uint256 ranking) {
        UserYieldData memory userData = userYieldData[_user];
        
        if (userData.totalEarned >= 1000 * 10**18) return 1;
        if (userData.totalEarned >= 500 * 10**18) return 2;
        if (userData.totalEarned >= 100 * 10**18) return 3;
        if (userData.totalEarned >= 10 * 10**18) return 4;
        return 5;
    }
    
    function distributeSpecialRewards(
        address[] calldata _users,
        uint256[] calldata _amounts,
        string calldata _reason
    ) external onlyOwner nonReentrant {
        require(_users.length == _amounts.length, "Arrays length mismatch");
        
        uint256 totalReward = 0;
        for (uint i = 0; i < _amounts.length; i++) {
            totalReward = totalReward.add(_amounts[i]);
        }
        
        require(totalReward <= totalRewardPool, "Insufficient reward pool");
        
        for (uint i = 0; i < _users.length; i++) {
            userYieldData[_users[i]].totalEarned = userYieldData[_users[i]].totalEarned.add(_amounts[i]);
            emit RewardDistributed(_users[i], _amounts[i], _reason);
        }
        
        totalRewardPool = totalRewardPool.sub(totalReward);
        distributedRewards = distributedRewards.add(totalReward);
    }
    
    function updatePlanMultiplier(uint256 _planDays, uint256 _multiplier) external onlyOwner {
        require(_multiplier >= 5000 && _multiplier <= 20000, "Invalid multiplier range");
        uint256 oldMultiplier = planMultipliers[_planDays];
        planMultipliers[_planDays] = _multiplier;
        emit APYUpdated(_planDays, oldMultiplier, _multiplier);
    }
    
    function updateGlobalMultiplier(uint256 _multiplier) external onlyOwner {
        require(_multiplier >= 5000 && _multiplier <= 20000, "Invalid multiplier range");
        globalApyMultiplier = _multiplier;
    }
    
    function addToRewardPool(uint256 _amount) external payable onlyOwner {
        uint256 oldPool = totalRewardPool;
        totalRewardPool = totalRewardPool.add(_amount);
        emit RewardPoolUpdated(oldPool, totalRewardPool);
    }
    
    function setAIOracle(address _aiOracle) external onlyOwner {
        require(_aiOracle != address(0), "Invalid oracle address");
        aiOracle = _aiOracle;
    }
    
    function getPerformanceMetrics() 
        external 
        view 
        returns (uint256 totalDeposits, uint256 totalWithdrawals, uint256 totalInterestPaid, uint256 averageAPY) 
    {
        return (metrics.totalDeposits, metrics.totalWithdrawals, metrics.totalInterestPaid, metrics.averageAPY);
    }
    
    function _calculateUserTier(address _user) private view returns (uint256 tier) {
        uint256 totalEarned = totalUserYield[_user];
        uint256 positionCount = userPositionCount[_user];
        
        if (totalEarned >= 1000 * 10**18 && positionCount >= 10) {
            return 5;
        } else if (totalEarned >= 500 * 10**18 && positionCount >= 5) {
            return 4;
        } else if (totalEarned >= 100 * 10**18 && positionCount >= 3) {
            return 3;
        } else if (totalEarned >= 50 * 10**18 && positionCount >= 2) {
            return 2;
        } else {
            return 1;
        }
    }
}
