// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../interfaces/IPiggyVault.sol";
import "../interfaces/IYieldManager.sol";
import "../interfaces/INFTRewards.sol";

contract PiggyVault is IPiggyVault, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    IERC20 public depositToken;
    IYieldManager public yieldManager;
    INFTRewards public nftRewards;

    mapping(uint256 => Deposit) private _deposits;
    mapping(uint256 => SavingsPlan) private _savingsPlans;
    mapping(address => uint256[]) public userDeposits;
    mapping(uint256 => uint256) private _depositYieldPositions; // depositId => yieldPositionId
    mapping(uint256 => uint256) private _emergencyWithdrawalFees; // planDays => fee basis points

    uint256 public depositCounter;
    uint256 private _totalDeposits;
    uint256 private _totalRewards;
    bool public emergencyMode;

    modifier notInEmergency() {
        require(!emergencyMode, "Contract in emergency mode");
        _;
    }

    modifier validPlan(uint256 _planDays) {
        require(_savingsPlans[_planDays].isActive, "Invalid savings plan");
        _;
    }

    constructor(
        address _depositToken,
        address _yieldManager,
        address _nftRewards
    ) {
        require(_depositToken != address(0), "Invalid deposit token");
        require(_yieldManager != address(0), "Invalid yield manager");
        require(_nftRewards != address(0), "Invalid NFT rewards");

        depositToken = IERC20(_depositToken);
        yieldManager = IYieldManager(_yieldManager);
        nftRewards = INFTRewards(_nftRewards);
        emergencyMode = false;
        depositCounter = 1;
        
        // Initialize emergency withdrawal fees
        _emergencyWithdrawalFees[30] = 200;  // 2%
        _emergencyWithdrawalFees[90] = 300;  // 3%
        _emergencyWithdrawalFees[180] = 400; // 4%
        _emergencyWithdrawalFees[365] = 500; // 5%

        _initializeSavingsPlans();
    }

    function deposits(uint256 _depositId) external view returns (Deposit memory) {
        return _deposits[_depositId];
    }

    function savingsPlans(uint256 _planDays) external view returns (SavingsPlan memory) {
        return _savingsPlans[_planDays];
    }

    function _initializeSavingsPlans() private {
        _savingsPlans[30] = SavingsPlan({
            duration: 30 days,
            apyBasisPoints: 300,
            minAmount: 10 * 10**18,
            maxAmount: 1000 * 10**18,
            isActive: true
        });

        _savingsPlans[90] = SavingsPlan({
            duration: 90 days,
            apyBasisPoints: 500,
            minAmount: 10 * 10**18,
            maxAmount: 5000 * 10**18,
            isActive: true
        });

        _savingsPlans[180] = SavingsPlan({
            duration: 180 days,
            apyBasisPoints: 800,
            minAmount: 10 * 10**18,
            maxAmount: 10000 * 10**18,
            isActive: true
        });

        _savingsPlans[365] = SavingsPlan({
            duration: 365 days,
            apyBasisPoints: 1200,
            minAmount: 10 * 10**18,
            maxAmount: 50000 * 10**18,
            isActive: true
        });
    }

    function deposit(uint256 _amount, uint256 _planDays) 
        public 
        nonReentrant 
        notInEmergency 
        validPlan(_planDays) 
        returns (uint256) 
    {
        SavingsPlan memory plan = _savingsPlans[_planDays];
        require(_amount >= plan.minAmount && _amount <= plan.maxAmount, "Amount outside allowed range");
        
        depositToken.safeTransferFrom(msg.sender, address(this), _amount);
        
        uint256 depositId = depositCounter++;
        
        _deposits[depositId] = Deposit({
            user: msg.sender,
            amount: _amount,
            planDays: _planDays,
            createdAt: block.timestamp,
            maturityTime: block.timestamp + plan.duration,
            isWithdrawn: false,
            accruedInterest: 0
        });
        
        userDeposits[msg.sender].push(depositId);
        _totalDeposits = _totalDeposits.add(_amount);
        
        uint256 yieldPositionId = yieldManager.recordDeposit(
            msg.sender, 
            _amount, 
            _planDays, 
            plan.apyBasisPoints
        );
        
        _depositYieldPositions[depositId] = yieldPositionId;
        
        string memory category;
        if (_planDays <= 30) {
            category = "starter";
        } else if (_planDays <= 90) {
            category = "saver";
        } else if (_planDays <= 180) {
            category = "investor";
        } else {
            category = "champion";
        }
        
        nftRewards.mintReward(msg.sender, category);
        
        emit DepositCreated(
            msg.sender, 
            depositId, 
            _amount, 
            _planDays, 
            block.timestamp + plan.duration
        );
        
        return depositId;
    }

    function withdraw(uint256 _depositId) public nonReentrant returns (uint256) {
        Deposit storage depositData = _deposits[_depositId];
        require(depositData.user == msg.sender, "Not deposit owner");
        require(!depositData.isWithdrawn, "Already withdrawn");
        require(block.timestamp >= depositData.maturityTime, "Deposit not matured");
        
        uint256 yieldPositionId = _depositYieldPositions[_depositId];
        (uint256 principal, uint256 interest) = yieldManager.finalizePosition(
            msg.sender, 
            yieldPositionId
        );
        
        uint256 bonus = 0;
        if (block.timestamp >= depositData.maturityTime) {
            bonus = yieldManager.calculateAndDistributeBonus(
                msg.sender, 
                yieldPositionId, 
                "completion"
            );
        }
        
        uint256 totalWithdrawal = depositData.amount.add(interest).add(bonus);
        
        depositData.isWithdrawn = true;
        depositData.accruedInterest = interest;
        _totalRewards = _totalRewards.add(interest).add(bonus);
        
        depositToken.safeTransfer(msg.sender, totalWithdrawal);
        
        yieldManager.recordWithdrawal(msg.sender, _depositId, depositData.amount, interest, bonus);
        
        emit DepositWithdrawn(
            msg.sender, 
            _depositId, 
            depositData.amount, 
            interest, 
            bonus, 
            true
        );
        
        return totalWithdrawal;
    }

    function emergencyWithdraw(uint256 _depositId) external nonReentrant {
        Deposit storage depositData = _deposits[_depositId];
        require(depositData.user == msg.sender, "Not deposit owner");
        require(!depositData.isWithdrawn, "Already withdrawn");
        
        uint256 fee = depositData.amount.mul(_emergencyWithdrawalFees[depositData.planDays]).div(10000);
        uint256 withdrawalAmount = depositData.amount.sub(fee);
        
        depositData.isWithdrawn = true;
        
        depositToken.safeTransfer(msg.sender, withdrawalAmount);
        
        emit EmergencyWithdrawal(
            msg.sender, 
            _depositId, 
            withdrawalAmount, 
            fee
        );
    }

    function calculateCurrentInterest(uint256 _depositId) external view returns (uint256) {
        return _calculatePendingRewards(_depositId);
    }
    
    function getUserDepositIds(address _user) external view returns (uint256[] memory) {
        return userDeposits[_user];
    }
    
    function getUserSummary(address _user) 
        external 
        view 
        returns (uint256 totalSaved, uint256 activeDeposits, uint256 totalEarned) 
    {
        uint256[] memory userDepositIds = userDeposits[_user];
        
        for (uint256 i = 0; i < userDepositIds.length; i++) {
            Deposit memory depositData = _deposits[userDepositIds[i]];
            totalSaved = totalSaved.add(depositData.amount);
            
            if (!depositData.isWithdrawn) {
                activeDeposits++;
                totalEarned = totalEarned.add(_calculatePendingRewards(userDepositIds[i]));
            } else {
                totalEarned = totalEarned.add(depositData.accruedInterest);
            }
        }
    }

    function createDeposit(uint256 _amount, uint256 _planDays) external {
        deposit(_amount, _planDays);
    }
    
    function withdrawDeposit(uint256 _depositId) external {
        withdraw(_depositId);
    }

    function getUserDeposits(address _user) external view returns (uint256[] memory) {
        return userDeposits[_user];
    }
    
    function getDeposit(uint256 _depositId) external view returns (Deposit memory) {
        return _deposits[_depositId];
    }
    
    function getSavingsPlan(uint256 _planDays) external view returns (SavingsPlan memory) {
        return _savingsPlans[_planDays];
    }
    
    function getDepositDetails(uint256 _depositId) 
        external 
        view 
        returns (
            address user,
            uint256 amount,
            uint256 planDays,
            uint256 createdAt,
            uint256 maturityTime,
            bool isWithdrawn,
            uint256 accruedInterest
        ) 
    {
        Deposit memory depositData = _deposits[_depositId];
        return (
            depositData.user,
            depositData.amount,
            depositData.planDays,
            depositData.createdAt,
            depositData.maturityTime,
            depositData.isWithdrawn,
            depositData.accruedInterest
        );
    }
    
    function _calculatePendingRewards(uint256 _depositId) internal view returns (uint256) {
        Deposit memory depositData = _deposits[_depositId];
        if (depositData.isWithdrawn) return 0;
        
        uint256 timeElapsed = block.timestamp > depositData.maturityTime 
            ? depositData.maturityTime - depositData.createdAt 
            : block.timestamp - depositData.createdAt;
        
        SavingsPlan memory plan = _savingsPlans[depositData.planDays];
        uint256 interest = depositData.amount
            .mul(plan.apyBasisPoints)
            .mul(timeElapsed)
            .div(365 days)
            .div(10000);
        
        return interest;
    }
    
    function updateSavingsPlan(
        uint256 _planDays,
        uint256 _apyBasisPoints,
        uint256 _minAmount,
        uint256 _maxAmount,
        bool _isActive
    ) external onlyOwner {
        _savingsPlans[_planDays] = SavingsPlan({
            duration: _planDays * 1 days,
            apyBasisPoints: _apyBasisPoints,
            minAmount: _minAmount,
            maxAmount: _maxAmount,
            isActive: _isActive
        });
    }
    
    function setEmergencyMode(bool _emergencyMode) external onlyOwner {
        emergencyMode = _emergencyMode;
    }
    
    function updateYieldManager(address _yieldManager) external onlyOwner {
        require(_yieldManager != address(0), "Invalid yield manager address");
        yieldManager = IYieldManager(_yieldManager);
    }
    
    function updateNFTRewards(address _nftRewards) external onlyOwner {
        require(_nftRewards != address(0), "Invalid NFT rewards address");
        nftRewards = INFTRewards(_nftRewards);
    }
    
    function getContractStats() 
        external 
        view 
        returns (uint256 totalDep, uint256 totalRew, uint256 depCount) 
    {
        return (_totalDeposits, _totalRewards, depositCounter);
    }
    
    function totalDeposits() external view returns (uint256) {
        return _totalDeposits;
    }
    
    function totalRewards() external view returns (uint256) {
        return _totalRewards;
    }
}
