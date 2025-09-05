// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IPiggyVault
 * @dev Interface for the main PiggyVault contract
 */
interface IPiggyVault {
    // Structs
    struct Deposit {
        address user;
        uint256 amount;
        uint256 planDays;
        uint256 createdAt;
        uint256 maturityTime;
        bool isWithdrawn;
        uint256 accruedInterest;
    }
    
    struct SavingsPlan {
        uint256 duration;      // Duration in seconds
        uint256 apyBasisPoints; // APY in basis points (100 = 1%)
        uint256 minAmount;     // Minimum deposit amount
        uint256 maxAmount;     // Maximum deposit amount
        bool isActive;         // Whether plan is currently active
    }
    
    // Events
    event DepositCreated(
        address indexed user,
        uint256 indexed depositId,
        uint256 amount,
        uint256 planDays,
        uint256 maturityTime
    );
    
    event DepositWithdrawn(
        address indexed user,
        uint256 indexed depositId,
        uint256 principal,
        uint256 interest,
        uint256 bonus,
        bool isMatured
    );
    
    event EmergencyWithdrawal(
        address indexed user,
        uint256 indexed depositId,
        uint256 amount,
        uint256 penalty
    );
    
    // Core functions
    function createDeposit(uint256 _amount, uint256 _planDays) external;
    
    function withdrawDeposit(uint256 _depositId) external;
    
    function emergencyWithdraw(uint256 _depositId) external;
    
    function calculateCurrentInterest(uint256 _depositId) external view returns (uint256);
    
    // View functions
    function getUserDepositIds(address _user) external view returns (uint256[] memory);
    
    function getUserSummary(address _user) 
        external 
        view 
        returns (uint256 totalSaved, uint256 activeDeposits, uint256 totalEarned);
    
    function deposits(uint256 _depositId) external view returns (Deposit memory);
    
    function savingsPlans(uint256 _planDays) external view returns (SavingsPlan memory);
    
    function totalDeposits() external view returns (uint256);
    
    function totalRewards() external view returns (uint256);
}
