// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title MockUSDT
 * @dev ERC20 token for testing with built-in faucet functionality
 * @notice Test token that mimics USDT behavior with daily faucet rewards
 * 
 * Features:
 * - 50 token daily faucet with 24-hour cooldown
 * - 6 decimal places (like real USDT)
 * - Mintable for testing purposes
 * - Emergency controls for admin
 * - Anti-bot protection with rate limiting
 * - User balance tracking and statistics
 */
contract MockUSDT is ERC20, Ownable, Pausable {
    using SafeMath for uint256;
    
    // Faucet configuration
    uint256 public constant FAUCET_AMOUNT = 50 * 10**6; // 50 USDT (6 decimals)
    uint256 public constant FAUCET_COOLDOWN = 24 hours;
    uint256 public constant MAX_FAUCET_SUPPLY = 1000000 * 10**6; // 1M USDT max from faucet
    
    // Faucet state
    mapping(address => uint256) public lastFaucetClaim;
    mapping(address => uint256) public totalFaucetClaimed;
    uint256 public totalFaucetDistributed;
    bool public faucetEnabled = true;
    
    // User statistics
    mapping(address => UserStats) public userStats;
    
    struct UserStats {
        uint256 totalReceived;      // Total tokens received from faucet
        uint256 claimCount;         // Number of faucet claims
        uint256 firstClaimTime;     // Timestamp of first claim
        uint256 lastActivity;       // Last transaction timestamp
    }
    
    // Anti-bot protection
    mapping(address => bool) public isBlacklisted;
    mapping(address => uint256) public dailyTransferCount;
    mapping(address => uint256) public lastTransferDay;
    uint256 public constant MAX_DAILY_TRANSFERS = 100;
    
    // Events
    event FaucetClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetStatusChanged(bool enabled);
    event UserBlacklisted(address indexed user, bool blacklisted);
    event AdminMint(address indexed to, uint256 amount);
    event EmergencyWithdrawal(address indexed admin, uint256 amount);
    
    // Modifiers
    modifier notBlacklisted(address _user) {
        require(!isBlacklisted[_user], "Address is blacklisted");
        _;
    }
    
    modifier antiBot(address _user) {
        uint256 currentDay = block.timestamp / 1 days;
        
        if (lastTransferDay[_user] != currentDay) {
            dailyTransferCount[_user] = 0;
            lastTransferDay[_user] = currentDay;
        }
        
        require(dailyTransferCount[_user] < MAX_DAILY_TRANSFERS, "Daily transfer limit exceeded");
        dailyTransferCount[_user]++;
        _;
    }
    
    constructor() ERC20("Mock USDT", "mUSDT") {
        // Mint initial supply for admin testing
        _mint(msg.sender, 100000 * 10**6); // 100k tokens
    }
    
    /**
     * @dev Returns 6 decimals like real USDT
     */
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
    
    /**
     * @dev Claim tokens from faucet (50 tokens per day)
     */
    function claimFromFaucet() external whenNotPaused notBlacklisted(msg.sender) {
        require(faucetEnabled, "Faucet is disabled");
        require(
            block.timestamp >= lastFaucetClaim[msg.sender].add(FAUCET_COOLDOWN),
            "Faucet cooldown not finished"
        );
        require(
            totalFaucetDistributed.add(FAUCET_AMOUNT) <= MAX_FAUCET_SUPPLY,
            "Faucet supply exhausted"
        );
        
        // Update claim timestamp
        lastFaucetClaim[msg.sender] = block.timestamp;
        
        // Update statistics
        UserStats storage stats = userStats[msg.sender];
        stats.totalReceived = stats.totalReceived.add(FAUCET_AMOUNT);
        stats.claimCount++;
        stats.lastActivity = block.timestamp;
        
        if (stats.firstClaimTime == 0) {
            stats.firstClaimTime = block.timestamp;
        }
        
        // Update global stats
        totalFaucetClaimed[msg.sender] = totalFaucetClaimed[msg.sender].add(FAUCET_AMOUNT);
        totalFaucetDistributed = totalFaucetDistributed.add(FAUCET_AMOUNT);
        
        // Mint tokens to user
        _mint(msg.sender, FAUCET_AMOUNT);
        
        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }
    
    /**
     * @dev Check how much time left for next faucet claim
     * @param _user User address
     * @return Time left in seconds (0 if can claim now)
     */
    function timeUntilNextClaim(address _user) external view returns (uint256) {
        uint256 timeSinceLastClaim = block.timestamp.sub(lastFaucetClaim[_user]);
        
        if (timeSinceLastClaim >= FAUCET_COOLDOWN) {
            return 0;
        }
        
        return FAUCET_COOLDOWN.sub(timeSinceLastClaim);
    }
    
    /**
     * @dev Check if user can claim from faucet
     * @param _user User address
     * @return Whether user can claim
     */
    function canClaimFaucet(address _user) external view returns (bool) {
        if (!faucetEnabled || isBlacklisted[_user]) {
            return false;
        }
        
        if (totalFaucetDistributed.add(FAUCET_AMOUNT) > MAX_FAUCET_SUPPLY) {
            return false;
        }
        
        return block.timestamp >= lastFaucetClaim[_user].add(FAUCET_COOLDOWN);
    }
    
    /**
     * @dev Get user's faucet statistics
     * @param _user User address
     * @return stats User statistics struct
     */
    function getUserStats(address _user) external view returns (UserStats memory stats) {
        return userStats[_user];
    }
    
    /**
     * @dev Get platform faucet statistics
     * @return totalDistributed Total tokens distributed
     * @return remainingSupply Remaining faucet supply
     * @return uniqueUsers Number of unique users who claimed
     */
    function getFaucetStats() 
        external 
        view 
        returns (uint256 totalDistributed, uint256 remainingSupply, uint256 uniqueUsers) 
    {
        totalDistributed = totalFaucetDistributed;
        remainingSupply = MAX_FAUCET_SUPPLY > totalFaucetDistributed 
            ? MAX_FAUCET_SUPPLY.sub(totalFaucetDistributed) 
            : 0;
        
        // Note: uniqueUsers would require additional tracking in production
        // For MVP, we'll implement a simple estimation
        uniqueUsers = totalDistributed > 0 ? totalDistributed.div(FAUCET_AMOUNT) : 0;
    }
    
    /**
     * @dev Override transfer to include anti-bot protection
     */
    function transfer(address to, uint256 amount) 
        public 
        override 
        whenNotPaused 
        notBlacklisted(msg.sender) 
        notBlacklisted(to) 
        antiBot(msg.sender)
        returns (bool) 
    {
        // Update user activity
        userStats[msg.sender].lastActivity = block.timestamp;
        userStats[to].lastActivity = block.timestamp;
        
        return super.transfer(to, amount);
    }
    
    /**
     * @dev Override transferFrom to include anti-bot protection
     */
    function transferFrom(address from, address to, uint256 amount) 
        public 
        override 
        whenNotPaused 
        notBlacklisted(from) 
        notBlacklisted(to) 
        antiBot(from)
        returns (bool) 
    {
        // Update user activity
        userStats[from].lastActivity = block.timestamp;
        userStats[to].lastActivity = block.timestamp;
        
        return super.transferFrom(from, to, amount);
    }
    
    /**
     * @dev Airdrop tokens to multiple users (admin only)
     * @param _recipients Array of recipient addresses
     * @param _amounts Array of amounts to send
     */
    function airdrop(address[] calldata _recipients, uint256[] calldata _amounts) 
        external 
        onlyOwner 
    {
        require(_recipients.length == _amounts.length, "Arrays length mismatch");
        require(_recipients.length <= 100, "Too many recipients");
        
        for (uint i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0), "Invalid recipient");
            require(!isBlacklisted[_recipients[i]], "Recipient is blacklisted");
            
            _mint(_recipients[i], _amounts[i]);
            
            // Update stats
            UserStats storage stats = userStats[_recipients[i]];
            stats.totalReceived = stats.totalReceived.add(_amounts[i]);
            stats.lastActivity = block.timestamp;
            
            if (stats.firstClaimTime == 0) {
                stats.firstClaimTime = block.timestamp;
            }
        }
    }
    
    /**
     * @dev Mint tokens for testing purposes (admin only)
     * @param _to Recipient address
     * @param _amount Amount to mint
     */
    function adminMint(address _to, uint256 _amount) external onlyOwner {
        require(_to != address(0), "Invalid recipient");
        require(_amount <= 10000 * 10**6, "Amount too large"); // Max 10k per mint
        
        _mint(_to, _amount);
        emit AdminMint(_to, _amount);
    }
    
    /**
     * @dev Burn tokens from a specific address (admin only)
     * @param _from Address to burn from
     * @param _amount Amount to burn
     */
    function adminBurn(address _from, uint256 _amount) external onlyOwner {
        require(_from != address(0), "Invalid address");
        require(balanceOf(_from) >= _amount, "Insufficient balance");
        
        _burn(_from, _amount);
    }
    
    // Admin functions
    function setFaucetEnabled(bool _enabled) external onlyOwner {
        faucetEnabled = _enabled;
        emit FaucetStatusChanged(_enabled);
    }
    
    function setBlacklisted(address _user, bool _blacklisted) external onlyOwner {
        require(_user != address(0), "Invalid address");
        isBlacklisted[_user] = _blacklisted;
        emit UserBlacklisted(_user, _blacklisted);
    }
    
    function batchSetBlacklisted(address[] calldata _users, bool _blacklisted) external onlyOwner {
        require(_users.length <= 50, "Too many users");
        
        for (uint i = 0; i < _users.length; i++) {
            if (_users[i] != address(0)) {
                isBlacklisted[_users[i]] = _blacklisted;
                emit UserBlacklisted(_users[i], _blacklisted);
            }
        }
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            payable(owner()).transfer(balance);
            emit EmergencyWithdrawal(owner(), balance);
        }
    }
    
    function updateDailyTransferLimit(uint256 _newLimit) external onlyOwner {
        require(_newLimit >= 10 && _newLimit <= 1000, "Invalid limit");
        // Note: This would require updating the constant in production
        // For MVP, this is a placeholder for future upgrades
    }
    
    // Utility functions for testing
    function resetFaucetCooldown(address _user) external onlyOwner {
        lastFaucetClaim[_user] = 0;
    }
    
    function resetUserStats(address _user) external onlyOwner {
        delete userStats[_user];
        delete totalFaucetClaimed[_user];
        delete lastFaucetClaim[_user];
    }
}
