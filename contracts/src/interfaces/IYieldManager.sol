// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IYieldManager
 * @dev Interface for the YieldManager contract
 */
interface IYieldManager {
    // Structs
    struct UserYieldData {
        uint256 totalDeposited;
        uint256 totalEarned;
        uint256 totalWithdrawn;
        uint256 transactionCount;
        uint256 lastActivity;
        uint256 preferredPlan;
    }
    
    struct YieldOptimization {
        uint256 suggestedAPY;
        uint256 riskScore;
        uint256 confidence;
        uint256 timestamp;
        string strategy;
    }
    
    struct YieldPosition {
        uint256 principal;
        uint256 accruedInterest;
        uint256 startTime;
        uint256 endTime;
        uint256 apyBasisPoints;
        uint256 lastUpdateTime;
        bool isActive;
    }
    
    // Events
    event APYUpdated(uint256 indexed planDays, uint256 oldAPY, uint256 newAPY);
    event RewardDistributed(address indexed user, uint256 amount, string reason);
    event AIOptimizationReceived(uint256 indexed planDays, uint256 suggestedAPY, uint256 riskScore);
    event RewardPoolUpdated(uint256 oldPool, uint256 newPool);
    event PerformanceMetricsUpdated(uint256 totalDeposits, uint256 averageAPY);
    event YieldAccrued(address indexed user, uint256 indexed positionId, uint256 interest, uint256 timestamp);
    event BonusDistributed(address indexed user, uint256 amount, string bonusType);
    event PositionCreated(address indexed user, uint256 indexed positionId, uint256 principal, uint256 duration);
    
    // Core functions
    function calculateEffectiveAPY(uint256 _planDays, uint256 _baseAPY) external view returns (uint256);
    
    function createYieldPosition(
        address _user,
        uint256 _principal,
        uint256 _planDays,
        uint256 _baseAPY
    ) external returns (uint256 positionId);
    
    function calculateAccruedInterest(address _user, uint256 _positionId) external view returns (uint256);
    
    function updateAccruedInterest(address _user, uint256 _positionId) external;
    
    function updateAllUserPositions(address _user) external;
    
    function calculateAndDistributeBonus(
        address _user,
        uint256 _positionId,
        string calldata _bonusType
    ) external returns (uint256 bonusAmount);
    
    function finalizePosition(address _user, uint256 _positionId) 
        external 
        returns (uint256 principal, uint256 totalInterest);
    
    function recordWithdrawal(
        address _user,
        uint256 _positionId,
        uint256 _principal,
        uint256 _interest,
        uint256 _bonus
    ) external;
    
    function recordDeposit(
        address _user, 
        uint256 _amount, 
        uint256 _planDays,
        uint256 _baseAPY
    ) external returns (uint256 positionId);
    
    // AI and optimization functions
    function getOptimizationSuggestions(address _user) external view returns (YieldOptimization memory);
    
    function receiveAIOptimization(
        uint256 _planDays,
        uint256 _suggestedAPY,
        uint256 _riskScore,
        uint256 _confidence,
        string calldata _strategy
    ) external;
    
    // Analytics functions
    function calculatePlatformHealth() 
        external 
        view 
        returns (uint256 healthScore, uint256 utilizationRate, uint256 avgAPY);
    
    function getUserYieldData(address _user) external view returns (UserYieldData memory);
    
    function getUserYieldRanking(address _user) external view returns (uint256 ranking);
    
    function getUserYieldSummary(address _user) 
        external 
        view 
        returns (uint256 totalPrincipal, uint256 totalAccrued, uint256 activePositions);
    
    // Admin functions
    function updatePlanMultiplier(uint256 _planDays, uint256 _multiplier) external;
    
    function updateGlobalMultiplier(uint256 _multiplier) external;
    
    function distributeSpecialRewards(
        address[] calldata _users,
        uint256[] calldata _amounts,
        string calldata _reason
    ) external;
    
    function addToRewardPool(uint256 _amount) external payable;
}
