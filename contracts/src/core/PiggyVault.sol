// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../interfaces/IPiggyVault.sol";
import "../interfaces/IYieldManager.sol";
import "../interfaces/INFTRewards.sol";
import "../libraries/InterestCalculator.sol";

/**
 * @title PiggyVault
 * @dev Main savings contract with timelock mechanism and yield generation
 * @notice Users can deposit tokens for fixed periods and earn yield
 * 
 * Features:
 * - Multiple savings plans (7, 14, 30, 90 days)
 * - Real-time interest accrual
 * - Emergency withdrawal with penalties
 * - Integration with NFT rewards system
 * - Yield optimization through YieldManager
 */
contract PiggyVault is IPiggyVault, ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    using InterestCalculator for uint256;

    // State variables
    IERC20 public immutable depositToken; // MockUSDT token
    IYieldManager public yieldManager;
    INFTRewards public nftRewards;
    
    uint256 public totalDeposits;
    uint256 public totalRewards;
    uint256 public nextDepositId;
    
    // Savings plans configuration
    mapping(uint256 => SavingsPlan) public savingsPlans;
    uint256[] public availablePlans = [7, 14, 30, 90]; // days
    
    // User deposits tracking
    mapping(address => uint256[]) public userDepositIds;
    mapping(uint256 => Deposit) public deposits;
    
    // Emergency settings
    uint256 public constant EMERGENCY_PENALTY = 500; // 5% penalty
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MATURITY_BONUS = 1000; // 10% bonus
    
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
    
    event YieldManagerUpdated(address indexed oldManager, address indexed newManager);
    event NFTRewardsUpdated(address indexed oldRewards, address indexed newRewards);
    
    // Modifiers
    modifier validDepositId(uint256 _depositId) {
        require(_depositId < nextDepositId, "Invalid deposit ID");
        _;
    }
    
    modifier onlyDepositOwner(uint256 _depositId) {
        require(deposits[_depositId].user == msg.sender, "Not deposit owner");
        _;
    }
    
    constructor(
        address _depositToken,
        address _yieldManager,
        address _nftRewards
    ) {
        require(_depositToken != address(0), "Invalid token address");
        require(_yieldManager != address(0), "Invalid yield manager");
        require(_nftRewards != address(0), "Invalid NFT rewards");
        
        depositToken = IERC20(_depositToken);
        yieldManager = IYieldManager(_yieldManager);
        nftRewards = INFTRewards(_nftRewards);
        
        // Initialize savings plans with APY rates
        _initializeSavingsPlans();
    }
    
    /**
     * @dev Initialize savings plans with different APY rates
     */
    function _initializeSavingsPlans() private {
        savingsPlans[7] = SavingsPlan({
            duration: 7 days,
            apyBasisPoints: 500, // 5% APY
            minAmount: 10 * 10**18, // 10 USDT minimum
            maxAmount: 100000 * 10**18, // 100k USDT maximum
            isActive: true
        });
        
        savingsPlans[14] = SavingsPlan({
            duration: 14 days,
            apyBasisPoints: 800, // 8% APY
            minAmount: 10 * 10**18,
            maxAmount: 100000 * 10**18,
            isActive: true
        });
        
        savingsPlans[30] = SavingsPlan({
            duration: 30 days,
            apyBasisPoints: 1200, // 12% APY
            minAmount: 10 * 10**18,
            maxAmount: 100000 * 10**18,
            isActive: true
        });
        
        savingsPlans[90] = SavingsPlan({
            duration: 90 days,
            apyBasisPoints: 1800, // 18% APY
            minAmount: 10 * 10**18,
            maxAmount: 100000 * 10**18,
            isActive: true
        });
    }
    
    /**
     * @dev Create a new savings deposit
     * @param _amount Amount to deposit
     * @param _planDays Duration in days (7, 14, 30, or 90)
     */
    function createDeposit(uint256 _amount, uint256 _planDays) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        SavingsPlan storage plan = savingsPlans[_planDays];
        require(plan.isActive, "Savings plan not active");
        require(_amount >= plan.minAmount, "Amount below minimum");
        require(_amount <= plan.maxAmount, "Amount above maximum");
        
        // Transfer tokens from user
        depositToken.safeTransferFrom(msg.sender, address(this), _amount);
        
        // Create deposit record
        uint256 depositId = nextDepositId++;
        uint256 maturityTime = block.timestamp + plan.duration;
        
        deposits[depositId] = Deposit({
            user: msg.sender,
            amount: _amount,
            planDays: _planDays,
            createdAt: block.timestamp,
            maturityTime: maturityTime,
            isWithdrawn: false,
            accruedInterest: 0
        });
        
        userDepositIds[msg.sender].push(depositId);
        totalDeposits = totalDeposits.add(_amount);
        
        // Mint NFT reward for first deposit
        if (userDepositIds[msg.sender].length == 1) {
            nftRewards.mintReward(msg.sender, "FIRST_DEPOSIT");
        }
        
        // Check for amount-based NFT rewards
        _checkAmountMilestones(msg.sender, _amount);
        
        emit DepositCreated(msg.sender, depositId, _amount, _planDays, maturityTime);
    }
    
    /**
     * @dev Withdraw a matured deposit with interest and bonus
     * @param _depositId ID of the deposit to withdraw
     */
    function withdrawDeposit(uint256 _depositId) 
        external 
        nonReentrant 
        validDepositId(_depositId) 
        onlyDepositOwner(_depositId) 
    {
        Deposit storage deposit = deposits[_depositId];
        require(!deposit.isWithdrawn, "Already withdrawn");
        require(block.timestamp >= deposit.maturityTime, "Not matured yet");
        
        // Calculate final rewards
        uint256 interest = calculateCurrentInterest(_depositId);
        uint256 bonus = 0;
        
        // Add maturity bonus (10%)
        if (block.timestamp >= deposit.maturityTime) {
            bonus = deposit.amount.mul(MATURITY_BONUS).div(BASIS_POINTS);
        }
        
        uint256 totalWithdrawal = deposit.amount.add(interest).add(bonus);
        
        // Update state
        deposit.isWithdrawn = true;
        deposit.accruedInterest = interest;
        totalRewards = totalRewards.add(interest).add(bonus);
        
        // Transfer tokens to user
        depositToken.safeTransfer(msg.sender, totalWithdrawal);
        
        // Update yield manager
        yieldManager.recordWithdrawal(msg.sender, deposit.amount, interest, bonus);
        
        emit DepositWithdrawn(
            msg.sender, 
            _depositId, 
            deposit.amount, 
            interest, 
            bonus, 
            true
        );
    }
    
    /**
     * @dev Emergency withdrawal with penalty (before maturity)
     * @param _depositId ID of the deposit to withdraw
     */
    function emergencyWithdraw(uint256 _depositId) 
        external 
        nonReentrant 
        validDepositId(_depositId) 
        onlyDepositOwner(_depositId) 
    {
        Deposit storage deposit = deposits[_depositId];
        require(!deposit.isWithdrawn, "Already withdrawn");
        require(block.timestamp < deposit.maturityTime, "Use regular withdrawal");
        
        uint256 penalty = deposit.amount.mul(EMERGENCY_PENALTY).div(BASIS_POINTS);
        uint256 withdrawAmount = deposit.amount.sub(penalty);
        
        // Update state
        deposit.isWithdrawn = true;
        
        // Transfer reduced amount to user
        depositToken.safeTransfer(msg.sender, withdrawAmount);
        
        emit EmergencyWithdrawal(msg.sender, _depositId, withdrawAmount, penalty);
    }
    
    /**
     * @dev Calculate current accrued interest for a deposit
     * @param _depositId ID of the deposit
     * @return Current interest amount
     */
    function calculateCurrentInterest(uint256 _depositId) 
        public 
        view 
        validDepositId(_depositId) 
        returns (uint256) 
    {
        Deposit storage deposit = deposits[_depositId];
        if (deposit.isWithdrawn) return deposit.accruedInterest;
        
        SavingsPlan storage plan = savingsPlans[deposit.planDays];
        uint256 timeElapsed = block.timestamp > deposit.maturityTime 
            ? plan.duration 
            : block.timestamp - deposit.createdAt;
            
        return InterestCalculator.calculateCompoundInterest(
            deposit.amount,
            plan.apyBasisPoints,
            timeElapsed,
            plan.duration
        );
    }
    
    /**
     * @dev Get user's all deposit IDs
     * @param _user User address
     * @return Array of deposit IDs
     */
    function getUserDepositIds(address _user) external view returns (uint256[] memory) {
        return userDepositIds[_user];
    }
    
    /**
     * @dev Get user's deposit summary
     * @param _user User address
     * @return totalSaved Total amount saved
     * @return activeDeposits Number of active deposits
     * @return totalEarned Total interest earned
     */
    function getUserSummary(address _user) 
        external 
        view 
        returns (uint256 totalSaved, uint256 activeDeposits, uint256 totalEarned) 
    {
        uint256[] memory depositIds = userDepositIds[_user];
        
        for (uint i = 0; i < depositIds.length; i++) {
            Deposit storage deposit = deposits[depositIds[i]];
            totalSaved = totalSaved.add(deposit.amount);
            
            if (!deposit.isWithdrawn) {
                activeDeposits++;
                totalEarned = totalEarned.add(calculateCurrentInterest(depositIds[i]));
            } else {
                totalEarned = totalEarned.add(deposit.accruedInterest);
            }
        }
    }
    
    /**
     * @dev Check and mint NFT rewards based on amount milestones
     * @param _user User address
     * @param _amount Deposit amount
     */
    function _checkAmountMilestones(address _user, uint256 _amount) private {
        if (_amount >= 100 * 10**18) { // 100+ USDT
            nftRewards.mintReward(_user, "PIGGY_SAVER");
        }
        if (_amount >= 1000 * 10**18) { // 1000+ USDT
            nftRewards.mintReward(_user, "PIGGY_MASTER");
        }
        if (_amount >= 10000 * 10**18) { // 10000+ USDT
            nftRewards.mintReward(_user, "PIGGY_LEGEND");
        }
    }
    
    // Admin functions
    function updateYieldManager(address _newManager) external onlyOwner {
        require(_newManager != address(0), "Invalid address");
        address oldManager = address(yieldManager);
        yieldManager = IYieldManager(_newManager);
        emit YieldManagerUpdated(oldManager, _newManager);
    }
    
    function updateNFTRewards(address _newRewards) external onlyOwner {
        require(_newRewards != address(0), "Invalid address");
        address oldRewards = address(nftRewards);
        nftRewards = INFTRewards(_newRewards);
        emit NFTRewardsUpdated(oldRewards, _newRewards);
    }
    
    function updateSavingsPlan(
        uint256 _planDays,
        uint256 _apyBasisPoints,
        uint256 _minAmount,
        uint256 _maxAmount,
        bool _isActive
    ) external onlyOwner {
        savingsPlans[_planDays] = SavingsPlan({
            duration: _planDays * 1 days,
            apyBasisPoints: _apyBasisPoints,
            minAmount: _minAmount,
            maxAmount: _maxAmount,
            isActive: _isActive
        });
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdrawFunds() external onlyOwner {
        uint256 balance = depositToken.balanceOf(address(this));
        depositToken.safeTransfer(owner(), balance);
    }
}
