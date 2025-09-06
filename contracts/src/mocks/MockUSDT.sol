// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MockUSDT is ERC20, Ownable, Pausable {
    using SafeMath for uint256;
    
    uint256 public constant FAUCET_AMOUNT = 50 * 10**6;
    uint256 public constant FAUCET_COOLDOWN = 24 hours;
    uint256 public constant MAX_FAUCET_SUPPLY = 1000000 * 10**6;
    
    mapping(address => uint256) public lastFaucetClaim;
    mapping(address => uint256) public totalFaucetClaimed;
    uint256 public totalFaucetDistributed;
    bool public faucetEnabled = true;
    
    mapping(address => UserStats) public userStats;
    
    struct UserStats {
        uint256 totalReceived;
        uint256 claimCount;
        uint256 firstClaimTime;
        uint256 lastActivity;
    }
    
    mapping(address => bool) public isBlacklisted;
    mapping(address => uint256) public dailyTransferCount;
    mapping(address => uint256) public lastTransferDay;
    uint256 public constant MAX_DAILY_TRANSFERS = 100;
    
    event FaucetClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetStatusChanged(bool enabled);
    event UserBlacklisted(address indexed user, bool blacklisted);
    event AdminMint(address indexed to, uint256 amount);
    event EmergencyWithdrawal(address indexed admin, uint256 amount);
    
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
        _mint(msg.sender, 100000 * 10**6);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
    
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
        
        lastFaucetClaim[msg.sender] = block.timestamp;
        
        UserStats storage stats = userStats[msg.sender];
        stats.totalReceived = stats.totalReceived.add(FAUCET_AMOUNT);
        stats.claimCount++;
        stats.lastActivity = block.timestamp;
        
        if (stats.firstClaimTime == 0) {
            stats.firstClaimTime = block.timestamp;
        }
        
        totalFaucetClaimed[msg.sender] = totalFaucetClaimed[msg.sender].add(FAUCET_AMOUNT);
        totalFaucetDistributed = totalFaucetDistributed.add(FAUCET_AMOUNT);
        
        _mint(msg.sender, FAUCET_AMOUNT);
        
        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }
    
    function timeUntilNextClaim(address _user) external view returns (uint256) {
        uint256 timeSinceLastClaim = block.timestamp.sub(lastFaucetClaim[_user]);
        
        if (timeSinceLastClaim >= FAUCET_COOLDOWN) {
            return 0;
        }
        
        return FAUCET_COOLDOWN.sub(timeSinceLastClaim);
    }
    
    function canClaimFaucet(address _user) external view returns (bool) {
        if (!faucetEnabled || isBlacklisted[_user]) {
            return false;
        }
        
        if (totalFaucetDistributed.add(FAUCET_AMOUNT) > MAX_FAUCET_SUPPLY) {
            return false;
        }
        
        return block.timestamp >= lastFaucetClaim[_user].add(FAUCET_COOLDOWN);
    }
    
    function getUserStats(address _user) external view returns (UserStats memory stats) {
        return userStats[_user];
    }
    
    function getFaucetStats() 
        external 
        view 
        returns (uint256 totalDistributed, uint256 remainingSupply, uint256 uniqueUsers) 
    {
        totalDistributed = totalFaucetDistributed;
        remainingSupply = MAX_FAUCET_SUPPLY > totalFaucetDistributed 
            ? MAX_FAUCET_SUPPLY.sub(totalFaucetDistributed) 
            : 0;
        
        uniqueUsers = totalDistributed > 0 ? totalDistributed.div(FAUCET_AMOUNT) : 0;
    }
    
    function transfer(address to, uint256 amount) 
        public 
        override 
        whenNotPaused 
        notBlacklisted(msg.sender) 
        notBlacklisted(to) 
        antiBot(msg.sender)
        returns (bool) 
    {
        userStats[msg.sender].lastActivity = block.timestamp;
        userStats[to].lastActivity = block.timestamp;
        
        return super.transfer(to, amount);
    }
    
    function transferFrom(address from, address to, uint256 amount) 
        public 
        override 
        whenNotPaused 
        notBlacklisted(from) 
        notBlacklisted(to) 
        antiBot(from)
        returns (bool) 
    {
        userStats[from].lastActivity = block.timestamp;
        userStats[to].lastActivity = block.timestamp;
        
        return super.transferFrom(from, to, amount);
    }
    
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
            
            UserStats storage stats = userStats[_recipients[i]];
            stats.totalReceived = stats.totalReceived.add(_amounts[i]);
            stats.lastActivity = block.timestamp;
            
            if (stats.firstClaimTime == 0) {
                stats.firstClaimTime = block.timestamp;
            }
        }
    }
    
    function adminMint(address _to, uint256 _amount) external onlyOwner {
        require(_to != address(0), "Invalid recipient");
        require(_amount <= 10000 * 10**6, "Amount too large");
        
        _mint(_to, _amount);
        emit AdminMint(_to, _amount);
    }
    
    function adminBurn(address _from, uint256 _amount) external onlyOwner {
        require(_from != address(0), "Invalid address");
        require(balanceOf(_from) >= _amount, "Insufficient balance");
        
        _burn(_from, _amount);
    }
    
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
    }
    
    function resetFaucetCooldown(address _user) external onlyOwner {
        lastFaucetClaim[_user] = 0;
    }
    
    function resetUserStats(address _user) external onlyOwner {
        delete userStats[_user];
        delete totalFaucetClaimed[_user];
        delete lastFaucetClaim[_user];
    }
}
