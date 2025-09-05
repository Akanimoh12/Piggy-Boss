// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../interfaces/IYieldManager.sol";
import "../interfaces/IPiggyVault.sol";
import "../libraries/InterestCalculator.sol";

/**
 * @title YieldManager
 * @dev Manages APY calculations, reward distribution, and yield optimization
 * @notice Handles all yield-related calculations and AI-powered optimizations
 * 
 * Features:
 * - Dynamic APY adjustments based on market conditions
 * - Reward pool management
 * - AI-powered yield optimization suggestions
 * - Historical performance tracking
 * - Risk assessment and management
 */
contract YieldManager is IYieldManager, Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    
    // State variables
    IPiggyVault public piggyVault;
    address public aiOracle;
    address public nftRewards; // NFTRewards contract address
    
    uint256 public totalRewardPool;
    uint256 public distributedRewards;
    uint256 public reserveRatio = 2000; // 20% reserve ratio
    
    // Compound interest settings
    uint256 public compoundingFrequency = 1; // Daily compounding (1 day)
    mapping(address => uint256) public lastAccrualTime; // Last time interest was accrued for user
    mapping(address => uint256) public userCompoundedBalance; // User's balance with accrued interest
    
    // Real-time yield tracking
    struct YieldPosition {
        uint256 principal;
        uint256 accruedInterest;
        uint256 startTime;
        uint256 endTime;
        uint256 apyBasisPoints;
        uint256 lastUpdateTime;
        bool isActive;
    }
    
    mapping(address => mapping(uint256 => YieldPosition)) public userPositions; // user => positionId => position
    mapping(address => uint256) public userPositionCount;
    mapping(address => uint256) public totalUserYield;
    
    // APY adjustments
    mapping(uint256 => uint256) public planMultipliers; // planDays => multiplier (basis points)
    uint256 public globalApyMultiplier = 10000; // 100% (no change)
    
    // Performance tracking
    struct PerformanceMetrics {
        uint256 totalDeposits;
        uint256 totalWithdrawals;
        uint256 totalInterestPaid;
        uint256 averageAPY;
        uint256 lastUpdated;
    }
    
    PerformanceMetrics public metrics;
    
    // AI optimization data
    struct YieldOptimization {
        uint256 suggestedAPY;
        uint256 riskScore; // 0-100 scale
        uint256 confidence; // 0-100 scale
        uint256 timestamp;
        string strategy;
    }
    
    mapping(uint256 => YieldOptimization) public optimizations; // planDays => optimization
    
    // User-specific data
    mapping(address => UserYieldData) public userYieldData;
    
    // Events
    event APYUpdated(uint256 indexed planDays, uint256 oldAPY, uint256 newAPY);
    event RewardDistributed(address indexed user, uint256 amount, string reason);
    event AIOptimizationReceived(uint256 indexed planDays, uint256 suggestedAPY, uint256 riskScore);
    event RewardPoolUpdated(uint256 oldPool, uint256 newPool);
    event PerformanceMetricsUpdated(uint256 totalDeposits, uint256 averageAPY);
    event YieldAccrued(address indexed user, uint256 indexed positionId, uint256 interest, uint256 timestamp);
    event BonusDistributed(address indexed user, uint256 amount, string bonusType);
    event PositionCreated(address indexed user, uint256 indexed positionId, uint256 principal, uint256 duration);
    
    // Modifiers
    modifier onlyVault() {
        require(msg.sender == address(piggyVault), "Only vault can call");
        _;
    }
    
    modifier onlyAIOracle() {
        require(msg.sender == aiOracle, "Only AI oracle can call");
        _;
    }
    
    constructor(address _aiOracle) {
        require(_aiOracle != address(0), "Invalid AI oracle address");
        aiOracle = _aiOracle;
        
        // Initialize plan multipliers (all at 100% initially)
        planMultipliers[7] = 10000;   // 100%
        planMultipliers[14] = 10000;  // 100%
        planMultipliers[30] = 10000;  // 100%
        planMultipliers[90] = 10000;  // 100%
    }
    
    /**
     * @dev Set the PiggyVault contract address
     * @param _piggyVault Address of the PiggyVault contract
     */
    function setPiggyVault(address _piggyVault) external onlyOwner {
        require(_piggyVault != address(0), "Invalid vault address");
        piggyVault = IPiggyVault(_piggyVault);
    }
    
    /**
     * @dev Set the NFTRewards contract address
     * @param _nftRewards Address of the NFTRewards contract
     */
    function setNFTRewards(address _nftRewards) external onlyOwner {
        require(_nftRewards != address(0), "Invalid NFT rewards address");
        nftRewards = _nftRewards;
    }
    
    /**
     * @dev Create a new yield position for a user
     * @param _user User address
     * @param _principal Principal amount
     * @param _planDays Duration of the savings plan
     * @param _baseAPY Base APY in basis points
     * @return positionId The ID of the created position
     */
    function createYieldPosition(
        address _user,
        uint256 _principal,
        uint256 _planDays,
        uint256 _baseAPY
    ) external onlyVault returns (uint256 positionId) {
        require(_user != address(0), "Invalid user address");
        require(_principal > 0, "Principal must be positive");
        
        positionId = userPositionCount[_user];
        uint256 effectiveAPY = calculateEffectiveAPY(_planDays, _baseAPY);
        
        userPositions[_user][positionId] = YieldPosition({
            principal: _principal,
            accruedInterest: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + (_planDays * 1 days),
            apyBasisPoints: effectiveAPY,
            lastUpdateTime: block.timestamp,
            isActive: true
        });
        
        userPositionCount[_user]++;
        lastAccrualTime[_user] = block.timestamp;
        
        emit PositionCreated(_user, positionId, _principal, _planDays);
        return positionId;
    }
    
    /**
     * @dev Calculate real-time accrued interest for a position
     * @param _user User address
     * @param _positionId Position ID
     * @return accruedInterest The amount of interest accrued since last update
     */
    function calculateAccruedInterest(address _user, uint256 _positionId) 
        public 
        view 
        returns (uint256 accruedInterest) 
    {
        YieldPosition storage position = userPositions[_user][_positionId];
        
        if (!position.isActive || block.timestamp <= position.lastUpdateTime) {
            return 0;
        }
        
        uint256 currentTime = block.timestamp > position.endTime ? position.endTime : block.timestamp;
        uint256 timeElapsed = currentTime - position.lastUpdateTime;
        
        // Calculate compound interest using the library
        accruedInterest = InterestCalculator.calculateCompoundInterest(
            position.principal + position.accruedInterest, // Compound on existing balance
            position.apyBasisPoints,
            timeElapsed,
            365 days // Annualized
        );
        
        return accruedInterest;
    }
    
    /**
     * @dev Update accrued interest for a user's position
     * @param _user User address
     * @param _positionId Position ID
     */
    function updateAccruedInterest(address _user, uint256 _positionId) 
        public 
        onlyVault 
    {
        YieldPosition storage position = userPositions[_user][_positionId];
        require(position.isActive, "Position not active");
        
        uint256 newInterest = calculateAccruedInterest(_user, _positionId);
        
        if (newInterest > 0) {
            position.accruedInterest += newInterest;
            position.lastUpdateTime = block.timestamp > position.endTime ? position.endTime : block.timestamp;
            totalUserYield[_user] += newInterest;
            
            emit YieldAccrued(_user, _positionId, newInterest, block.timestamp);
        }
    }
    
    /**
     * @dev Batch update all active positions for a user
     * @param _user User address
     */
    function updateAllUserPositions(address _user) external onlyVault {
        uint256 positionCount = userPositionCount[_user];
        
        for (uint256 i = 0; i < positionCount; i++) {
            if (userPositions[_user][i].isActive) {
                updateAccruedInterest(_user, i);
            }
        }
        
        lastAccrualTime[_user] = block.timestamp;
    }
    
    /**
     * @dev Calculate and distribute bonus rewards
     * @param _user User address
     * @param _positionId Position ID
     * @param _bonusType Type of bonus (loyalty, completion, etc.)
     * @return bonusAmount Amount of bonus distributed
     */
    function calculateAndDistributeBonus(
        address _user,
        uint256 _positionId,
        string calldata _bonusType
    ) external onlyVault returns (uint256 bonusAmount) {
        YieldPosition storage position = userPositions[_user][_positionId];
        require(position.isActive, "Position not active");
        
        // Update accrued interest first
        updateAccruedInterest(_user, _positionId);
        
        if (keccak256(abi.encodePacked(_bonusType)) == keccak256(abi.encodePacked("completion"))) {
            // 5% completion bonus
            bonusAmount = (position.principal + position.accruedInterest) * 500 / 10000;
        } else if (keccak256(abi.encodePacked(_bonusType)) == keccak256(abi.encodePacked("loyalty"))) {
            // Loyalty bonus based on user's history
            uint256 userTier = _calculateUserTier(_user);
            bonusAmount = (position.principal + position.accruedInterest) * (userTier * 100) / 10000; // 1-5% based on tier
        } else if (keccak256(abi.encodePacked(_bonusType)) == keccak256(abi.encodePacked("early_adopter"))) {
            // 3% early adopter bonus
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
    
    /**
     * @dev Finalize a position and return total earned
     * @param _user User address
     * @param _positionId Position ID
     * @return principal The original principal
     * @return totalInterest Total interest earned (including bonuses)
     */
    function finalizePosition(address _user, uint256 _positionId) 
        external 
        onlyVault 
        returns (uint256 principal, uint256 totalInterest) 
    {
        YieldPosition storage position = userPositions[_user][_positionId];
        require(position.isActive, "Position not active");
        
        // Final interest update
        updateAccruedInterest(_user, _positionId);
        
        principal = position.principal;
        totalInterest = position.accruedInterest;
        
        // Mark position as inactive
        position.isActive = false;
        
        return (principal, totalInterest);
    }
    
    /**
     * @dev Get user's current yield summary
     * @param _user User address
     * @return totalPrincipal Sum of all active principals
     * @return totalAccrued Sum of all accrued interest
     * @return activePositions Number of active positions
     */
    function getUserYieldSummary(address _user) 
        external 
        view 
        returns (uint256 totalPrincipal, uint256 totalAccrued, uint256 activePositions) 
    {
        uint256 positionCount = userPositionCount[_user];
        
        for (uint256 i = 0; i < positionCount; i++) {
            YieldPosition storage position = userPositions[_user][i];
            if (position.isActive) {
                totalPrincipal += position.principal;
                totalAccrued += position.accruedInterest + calculateAccruedInterest(_user, i);
                activePositions++;
            }
        }
    }
    
    /**
     * @dev Calculate user tier for bonus calculations
     * @param _user User address
     * @return tier User tier (1-5)
     */
    function _calculateUserTier(address _user) private view returns (uint256 tier) {
        uint256 totalEarned = totalUserYield[_user];
        uint256 positionCount = userPositionCount[_user];
        
        // Tier based on total earnings and activity
        if (totalEarned >= 1000 * 10**18 && positionCount >= 10) {
            return 5; // Diamond tier
        } else if (totalEarned >= 500 * 10**18 && positionCount >= 5) {
            return 4; // Gold tier
        } else if (totalEarned >= 100 * 10**18 && positionCount >= 3) {
            return 3; // Silver tier
        } else if (totalEarned >= 50 * 10**18 && positionCount >= 2) {
            return 2; // Bronze tier
        } else {
            return 1; // Starter tier
        }
    }
    
    /**
     * @dev Calculate effective APY for a savings plan
     * @param _planDays Duration of the savings plan
     * @param _baseAPY Base APY in basis points
     * @return Effective APY after multipliers
     */
    function calculateEffectiveAPY(uint256 _planDays, uint256 _baseAPY) 
        external 
        view 
        returns (uint256) 
    {
        uint256 planMultiplier = planMultipliers[_planDays];
        uint256 effectiveAPY = _baseAPY
            .mul(planMultiplier)
            .div(10000)
            .mul(globalApyMultiplier)
            .div(10000);
        
        return effectiveAPY;
    }
    
    /**
     * @dev Record a withdrawal transaction for metrics
     * @param _user User address
     * @param _positionId Position ID that was withdrawn
     * @param _principal Principal amount
     * @param _interest Interest earned
     * @param _bonus Bonus amount
     */
    function recordWithdrawal(
        address _user,
        uint256 _positionId,
        uint256 _principal,
        uint256 _interest,
        uint256 _bonus
    ) external onlyVault {
        // Finalize the position
        finalizePosition(_user, _positionId);
        
        // Update global metrics
        metrics.totalWithdrawals = metrics.totalWithdrawals.add(_principal);
        metrics.totalInterestPaid = metrics.totalInterestPaid.add(_interest).add(_bonus);
        metrics.lastUpdated = block.timestamp;
        
        // Update user-specific data
        UserYieldData storage userData = userYieldData[_user];
        userData.totalEarned = userData.totalEarned.add(_interest).add(_bonus);
        userData.totalWithdrawn = userData.totalWithdrawn.add(_principal);
        userData.transactionCount++;
        userData.lastActivity = block.timestamp;
        
        // Update distributed rewards
        distributedRewards = distributedRewards.add(_interest).add(_bonus);
        
        emit PerformanceMetricsUpdated(metrics.totalDeposits, metrics.averageAPY);
    }
    
    /**
     * @dev Record a deposit transaction for metrics
     * @param _user User address
     * @param _amount Deposit amount
     * @param _planDays Plan duration
     * @param _baseAPY Base APY for the plan
     * @return positionId Created position ID
     */
    function recordDeposit(
        address _user, 
        uint256 _amount, 
        uint256 _planDays,
        uint256 _baseAPY
    ) external onlyVault returns (uint256 positionId) {
        // Create yield position
        positionId = createYieldPosition(_user, _amount, _planDays, _baseAPY);
        
        // Update global metrics
        metrics.totalDeposits = metrics.totalDeposits.add(_amount);
        metrics.lastUpdated = block.timestamp;
        
        // Update user-specific data
        UserYieldData storage userData = userYieldData[_user];
        userData.totalDeposited = userData.totalDeposited.add(_amount);
        userData.transactionCount++;
        userData.lastActivity = block.timestamp;
        userData.preferredPlan = _planDays;
        
        return positionId;
    }
    
    /**
     * @dev Get yield optimization suggestions for a user
     * @param _user User address
     * @return Personalized yield optimization data
     */
    function getOptimizationSuggestions(address _user) 
        external 
        view 
        returns (YieldOptimization memory) 
    {
        UserYieldData storage userData = userYieldData[_user];
        uint256 preferredPlan = userData.preferredPlan > 0 ? userData.preferredPlan : 30; // Default to 30 days
        
        return optimizations[preferredPlan];
    }
    
    /**
     * @dev Update APY multiplier for a specific plan
     * @param _planDays Plan duration
     * @param _multiplier New multiplier in basis points
     */
    function updatePlanMultiplier(uint256 _planDays, uint256 _multiplier) 
        external 
        onlyOwner 
    {
        require(_multiplier >= 5000 && _multiplier <= 20000, "Invalid multiplier range"); // 50% to 200%
        
        uint256 oldMultiplier = planMultipliers[_planDays];
        planMultipliers[_planDays] = _multiplier;
        
        emit APYUpdated(_planDays, oldMultiplier, _multiplier);
    }
    
    /**
     * @dev Update global APY multiplier
     * @param _multiplier New global multiplier in basis points
     */
    function updateGlobalMultiplier(uint256 _multiplier) external onlyOwner {
        require(_multiplier >= 5000 && _multiplier <= 15000, "Invalid multiplier range"); // 50% to 150%
        globalApyMultiplier = _multiplier;
    }
    
    /**
     * @dev Receive AI-powered yield optimization data
     * @param _planDays Plan duration
     * @param _suggestedAPY Suggested APY in basis points
     * @param _riskScore Risk score (0-100)
     * @param _confidence Confidence level (0-100)
     * @param _strategy Optimization strategy description
     */
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
    
    /**
     * @dev Distribute special rewards to users
     * @param _users Array of user addresses
     * @param _amounts Array of reward amounts
     * @param _reason Reason for the reward
     */
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
    
    /**
     * @dev Add funds to the reward pool
     * @param _amount Amount to add
     */
    function addToRewardPool(uint256 _amount) external payable onlyOwner {
        uint256 oldPool = totalRewardPool;
        totalRewardPool = totalRewardPool.add(_amount);
        emit RewardPoolUpdated(oldPool, totalRewardPool);
    }
    
    /**
     * @dev Calculate platform health metrics
     * @return healthScore Overall platform health (0-100)
     * @return utilizationRate Pool utilization rate
     * @return avgAPY Average APY across all plans
     */
    function calculatePlatformHealth() 
        external 
        view 
        returns (uint256 healthScore, uint256 utilizationRate, uint256 avgAPY) 
    {
        // Calculate utilization rate
        if (totalRewardPool > 0) {
            utilizationRate = distributedRewards.mul(10000).div(totalRewardPool);
        }
        
        // Calculate average APY (weighted by deposits)
        // This is a simplified calculation - in production, would be more sophisticated
        avgAPY = (500 + 800 + 1200 + 1800) / 4; // Average of all plan APYs
        
        // Calculate health score based on multiple factors
        healthScore = 100;
        
        // Reduce score if utilization is too high (>80%)
        if (utilizationRate > 8000) {
            healthScore = healthScore.sub((utilizationRate.sub(8000)).div(100));
        }
        
        // Ensure minimum score
        if (healthScore < 50) {
            healthScore = 50;
        }
    }
    
    /**
     * @dev Get user's yield performance data
     * @param _user User address
     * @return User's yield data
     */
    function getUserYieldData(address _user) external view returns (UserYieldData memory) {
        return userYieldData[_user];
    }
    
    /**
     * @dev Calculate user's yield ranking among all users
     * @param _user User address
     * @return ranking User's ranking (1 = highest earner)
     */
    function getUserYieldRanking(address _user) external view returns (uint256 ranking) {
        // This would require implementing a more complex ranking system
        // For MVP, return a placeholder
        UserYieldData memory userData = userYieldData[_user];
        
        // Simple ranking based on total earned
        if (userData.totalEarned >= 1000 * 10**18) return 1; // Top tier
        if (userData.totalEarned >= 500 * 10**18) return 2;  // High tier
        if (userData.totalEarned >= 100 * 10**18) return 3;  // Medium tier
        if (userData.totalEarned >= 10 * 10**18) return 4;   // Low tier
        return 5; // Starter tier
    }
    
    // Admin functions
    function updateAIOracle(address _newOracle) external onlyOwner {
        require(_newOracle != address(0), "Invalid oracle address");
        aiOracle = _newOracle;
    }
    
    function updateReserveRatio(uint256 _newRatio) external onlyOwner {
        require(_newRatio >= 1000 && _newRatio <= 5000, "Invalid reserve ratio"); // 10% to 50%
        reserveRatio = _newRatio;
    }
    
    function emergencyPause() external onlyOwner {
        // Emergency function to pause yield calculations
        globalApyMultiplier = 0;
    }
    
    function emergencyResume() external onlyOwner {
        // Resume normal operations
        globalApyMultiplier = 10000;
    }
}
