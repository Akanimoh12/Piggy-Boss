// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "../interfaces/INFTRewards.sol";


contract NFTRewards is INFTRewards, ERC721, ERC721URIStorage, ERC721Burnable, Ownable, Pausable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    Counters.Counter private _tokenIdCounter;
    
    // Authorized minters (PiggyVault, YieldManager, etc.)
    mapping(address => bool) public authorizedMinters;
    
    // NFT Categories and Metadata
    struct NFTMetadata {
        string name;
        string description;
        string imageURI;
        uint256 rarity; // 1-5 scale (1 = common, 5 = legendary)
        bool isSoulbound; // Cannot be transferred
        uint256 achievementPoints;
    }
    
    mapping(string => NFTMetadata) public nftCategories;
    
    // User NFT tracking
    mapping(address => mapping(string => bool)) public userHasNFT;
    mapping(address => uint256) public userAchievementPoints;
    mapping(uint256 => string) public tokenCategory;
    mapping(uint256 => bool) public isSoulbound;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Events
    event NFTMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        string category,
        uint256 rarity,
        uint256 achievementPoints
    );
    
    event CategoryAdded(
        string category,
        string name,
        uint256 rarity,
        bool isSoulbound,
        uint256 achievementPoints
    );
    
    event MinterAuthorized(address indexed minter, bool authorized);
    event AchievementPointsUpdated(address indexed user, uint256 oldPoints, uint256 newPoints);
    
    // Modifiers
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized minter");
        _;
    }
    
    modifier onlyTransferableToken(uint256 tokenId) {
        require(!isSoulbound[tokenId], "Token is soulbound");
        _;
    }
    
    constructor(string memory _baseURI) ERC721("Piggy Boss NFT Rewards", "PIGGY") {
        _baseTokenURI = _baseURI;
        
        // Initialize NFT categories
        _initializeNFTCategories();
    }
    
    /**
     * @dev Initialize default NFT categories with metadata
     */
    function _initializeNFTCategories() private {
        // Time-based Dynamic NFT Rewards
        nftCategories["BRONZE_PIGGY"] = NFTMetadata({
            name: "Bronze Piggy",
            description: "Completed 7-day savings goal - The journey begins!",
            imageURI: "bronze",
            rarity: 2,
            isSoulbound: true,
            achievementPoints: 25
        });
        
        nftCategories["SILVER_PIGGY"] = NFTMetadata({
            name: "Silver Piggy",
            description: "Completed 30-day savings goal - Building momentum!",
            imageURI: "silver",
            rarity: 3,
            isSoulbound: true,
            achievementPoints: 50
        });
        
        nftCategories["GOLD_PIGGY"] = NFTMetadata({
            name: "Gold Piggy",
            description: "Completed 90-day savings goal - Showing dedication!",
            imageURI: "gold",
            rarity: 4,
            isSoulbound: true,
            achievementPoints: 100
        });
        
        nftCategories["DIAMOND_PIGGY"] = NFTMetadata({
            name: "Diamond Piggy",
            description: "Saved 250+ USDT - Elite saver status achieved!",
            imageURI: "diamond",
            rarity: 5,
            isSoulbound: true,
            achievementPoints: 200
        });
        
        // Legacy Savings Milestone NFTs
        nftCategories["FIRST_DEPOSIT"] = NFTMetadata({
            name: "Piggy Starter",
            description: "Your first step into the DeFi savings world!",
            imageURI: "starter",
            rarity: 1,
            isSoulbound: true,
            achievementPoints: 10
        });
        
        nftCategories["PIGGY_SAVER"] = NFTMetadata({
            name: "Piggy Saver",
            description: "Saved 100+ USDT - Building wealth one coin at a time!",
            imageURI: "saver",
            rarity: 2,
            isSoulbound: true,
            achievementPoints: 25
        });
        
        nftCategories["PIGGY_MASTER"] = NFTMetadata({
            name: "Piggy Master",
            description: "Saved 1,000+ USDT - You're mastering the art of savings!",
            imageURI: "master",
            rarity: 3,
            isSoulbound: true,
            achievementPoints: 50
        });
        
        nftCategories["PIGGY_LEGEND"] = NFTMetadata({
            name: "Piggy Legend",
            description: "Saved 10,000+ USDT - A true DeFi savings legend!",
            imageURI: "legend",
            rarity: 4,
            isSoulbound: true,
            achievementPoints: 100
        });
        
        // Activity-based NFTs
        nftCategories["EARLY_ADOPTER"] = NFTMetadata({
            name: "Early Adopter",
            description: "Among the first 1000 users of Piggy Boss!",
            imageURI: "QmEarlyAdopterHash",
            rarity: 3,
            isSoulbound: true,
            achievementPoints: 75
        });
        
        nftCategories["LOYAL_SAVER"] = NFTMetadata({
            name: "Loyal Saver",
            description: "Completed 10+ savings cycles - Your dedication pays off!",
            imageURI: "QmLoyalSaverHash",
            rarity: 3,
            isSoulbound: true,
            achievementPoints: 60
        });
        
        nftCategories["YIELD_HUNTER"] = NFTMetadata({
            name: "Yield Hunter",
            description: "Earned 100+ USDT in yield - You know how to make money work!",
            imageURI: "QmYieldHunterHash",
            rarity: 4,
            isSoulbound: true,
            achievementPoints: 80
        });
        
        // Special Event NFTs
        nftCategories["GENESIS_USER"] = NFTMetadata({
            name: "Genesis User",
            description: "Part of the original Piggy Boss launch - Forever remembered!",
            imageURI: "QmGenesisUserHash",
            rarity: 5,
            isSoulbound: true,
            achievementPoints: 200
        });
        
        nftCategories["HACKATHON_WINNER"] = NFTMetadata({
            name: "Hackathon Winner",
            description: "Won a prize in the Piggy Boss hackathon competition!",
            imageURI: "QmHackathonWinnerHash",
            rarity: 5,
            isSoulbound: false,
            achievementPoints: 150
        });
    }
    

    function mintReward(address _recipient, string calldata _category) 
        external 
        onlyAuthorizedMinter 
        whenNotPaused 
    {
        require(_recipient != address(0), "Invalid recipient");
        _mintRewardInternal(_recipient, _category);
    }
    
    /**
     * @dev Mint time-based achievement NFT
     * @param _recipient Address to receive the NFT
     * @param _daysCompleted Number of days completed
     */
    function mintTimeBasedReward(address _recipient, uint256 _daysCompleted) 
        external 
        onlyAuthorizedMinter 
        whenNotPaused 
    {
        require(_recipient != address(0), "Invalid recipient");
        
        string memory category;
        
        if (_daysCompleted >= 90) {
            category = "GOLD_PIGGY";
        } else if (_daysCompleted >= 30) {
            category = "SILVER_PIGGY";
        } else if (_daysCompleted >= 7) {
            category = "BRONZE_PIGGY";
        } else {
            revert("Insufficient days completed");
        }
        
        // Only mint if user doesn't already have this NFT
        if (!userHasNFT[_recipient][category]) {
            _mintRewardInternal(_recipient, category);
        }
    }
    
    /**
     * @dev Mint amount-based achievement NFT (Diamond Piggy for 250+ USDT)
     * @param _recipient Address to receive the NFT
     * @param _totalSaved Total amount saved in USDT (with decimals)
     */
    function mintAmountBasedReward(address _recipient, uint256 _totalSaved) 
        external 
        onlyAuthorizedMinter 
        whenNotPaused 
    {
        require(_recipient != address(0), "Invalid recipient");
        require(_totalSaved >= 250 * 10**18, "Insufficient amount saved"); // 250 USDT minimum
        
        string memory category = "DIAMOND_PIGGY";
        
        // Only mint if user doesn't already have this NFT
        if (!userHasNFT[_recipient][category]) {
            _mintRewardInternal(_recipient, category);
        }
    }
    
    /**
     * @dev Internal function to mint rewards
     * @param _recipient Address to receive the NFT
     * @param _category Category of NFT to mint
     */
    function _mintRewardInternal(address _recipient, string memory _category) 
        private 
    {
        require(bytes(nftCategories[_category].name).length > 0, "Invalid category");
        require(!userHasNFT[_recipient][_category], "User already has this NFT");
        
        NFTMetadata memory metadata = nftCategories[_category];
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Mint the NFT
        _safeMint(_recipient, tokenId);
        
        // Set metadata
        tokenCategory[tokenId] = _category;
        isSoulbound[tokenId] = metadata.isSoulbound;
        userHasNFT[_recipient][_category] = true;
        
        // Update achievement points
        uint256 oldPoints = userAchievementPoints[_recipient];
        userAchievementPoints[_recipient] += metadata.achievementPoints;
        
        // Set token URI with on-chain generated metadata
        _setTokenURI(tokenId, _generateTokenURI(_category, tokenId));
        
        emit NFTMinted(_recipient, tokenId, _category, metadata.rarity, metadata.achievementPoints);
        emit AchievementPointsUpdated(_recipient, oldPoints, userAchievementPoints[_recipient]);
    }
    
    /**
     * @dev Batch mint multiple NFTs to a user
     * @param _recipient Address to receive the NFTs
     * @param _categories Array of NFT categories to mint
     */
    function batchMintRewards(address _recipient, string[] calldata _categories) 
        external 
        onlyAuthorizedMinter 
        whenNotPaused 
    {
        require(_recipient != address(0), "Invalid recipient");
        require(_categories.length > 0 && _categories.length <= 10, "Invalid categories count");
        
        for (uint i = 0; i < _categories.length; i++) {
            if (!userHasNFT[_recipient][_categories[i]] && 
                bytes(nftCategories[_categories[i]].name).length > 0) {
                _mintRewardInternal(_recipient, _categories[i]);
            }
        }
    }
    
    /**
     * @dev Check if user has a specific NFT category
     * @param _user User address
     * @param _category NFT category
     * @return Whether user has the NFT
     */
    function hasNFT(address _user, string calldata _category) external view returns (bool) {
        return userHasNFT[_user][_category];
    }
    
    /**
     * @dev Get user's NFT collection summary
     * @param _user User address
     * @return nftCount Total NFTs owned
     * @return achievementPoints Total achievement points
     * @return rareNFTs Number of rare NFTs (rarity 4+)
     */
    function getUserNFTSummary(address _user) 
        external 
        view 
        returns (uint256 nftCount, uint256 achievementPoints, uint256 rareNFTs) 
    {
        nftCount = balanceOf(_user);
        achievementPoints = userAchievementPoints[_user];
        
        // Count rare NFTs
        for (uint i = 0; i < _tokenIdCounter.current(); i++) {
            if (ownerOf(i) == _user) {
                string memory category = tokenCategory[i];
                if (nftCategories[category].rarity >= 4) {
                    rareNFTs++;
                }
            }
        }
    }
    
    /**
     * @dev Get user's achievement tier based on points
     * @param _user User address
     * @return tier Achievement tier (1-5)
     * @return tierName Name of the tier
     */
    function getUserTier(address _user) 
        external 
        view 
        returns (uint256 tier, string memory tierName) 
    {
        uint256 points = userAchievementPoints[_user];
        
        if (points >= 500) {
            return (5, "Legendary Saver");
        } else if (points >= 250) {
            return (4, "Elite Saver");
        } else if (points >= 100) {
            return (3, "Advanced Saver");
        } else if (points >= 50) {
            return (2, "Intermediate Saver");
        } else if (points >= 10) {
            return (1, "Beginner Saver");
        } else {
            return (0, "New User");
        }
    }
    
    /**
     * @dev Generate token URI for metadata with on-chain SVG
     * @param _category NFT category
     * @param _tokenId Token ID
     * @return Generated URI with embedded metadata
     */
    function _generateTokenURI(string memory _category, uint256 _tokenId) 
        private 
        view 
        returns (string memory) 
    {
        NFTMetadata memory metadata = nftCategories[_category];
        string memory svg = _generateSVG(_category, _tokenId);
        
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "', metadata.name, '",',
                        '"description": "', metadata.description, '",',
                        '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",',
                        '"attributes": [',
                            '{"trait_type": "Rarity", "value": ', metadata.rarity.toString(), '},',
                            '{"trait_type": "Achievement Points", "value": ', metadata.achievementPoints.toString(), '},',
                            '{"trait_type": "Category", "value": "', _category, '"},',
                            '{"trait_type": "Soulbound", "value": ', metadata.isSoulbound ? 'true' : 'false', '},',
                            '{"trait_type": "Token ID", "value": ', _tokenId.toString(), '}',
                        ']}'
                    )
                )
            )
        );
        
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
    
    /**
     * @dev Generate SVG image for NFT based on category
     * @param _category NFT category
     * @param _tokenId Token ID for unique elements
     * @return SVG string
     */
    function _generateSVG(string memory _category, uint256 _tokenId) 
        private 
        pure 
        returns (string memory) 
    {
        string memory piggyColor = _getPiggyColor(_category);
        string memory bgGradient = _getBackgroundGradient(_category);
        string memory sparkles = _getSparkles(_category, _tokenId);
        
        return string(
            abi.encodePacked(
                '<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">',
                '<defs>',
                    '<radialGradient id="bg" cx="50%" cy="50%" r="50%">',
                        bgGradient,
                    '</radialGradient>',
                    '<linearGradient id="piggy" x1="0%" y1="0%" x2="100%" y2="100%">',
                        piggyColor,
                    '</linearGradient>',
                '</defs>',
                '<rect width="400" height="400" fill="url(#bg)"/>',
                sparkles,
                _generatePiggyBank(_category),
                _generateText(_category),
                '</svg>'
            )
        );
    }
    
    /**
     * @dev Get piggy bank color scheme based on category
     */
    function _getPiggyColor(string memory _category) private pure returns (string memory) {
        if (_compareStrings(_category, "BRONZE_PIGGY")) {
            return '<stop offset="0%" style="stop-color:#CD7F32"/><stop offset="100%" style="stop-color:#8B4513"/>';
        } else if (_compareStrings(_category, "SILVER_PIGGY")) {
            return '<stop offset="0%" style="stop-color:#C0C0C0"/><stop offset="100%" style="stop-color:#808080"/>';
        } else if (_compareStrings(_category, "GOLD_PIGGY")) {
            return '<stop offset="0%" style="stop-color:#FFD700"/><stop offset="100%" style="stop-color:#FFA500"/>';
        } else if (_compareStrings(_category, "DIAMOND_PIGGY")) {
            return '<stop offset="0%" style="stop-color:#B9F2FF"/><stop offset="100%" style="stop-color:#87CEEB"/>';
        } else {
            return '<stop offset="0%" style="stop-color:#FFB6C1"/><stop offset="100%" style="stop-color:#FF69B4"/>';
        }
    }
    
    /**
     * @dev Get background gradient based on category
     */
    function _getBackgroundGradient(string memory _category) private pure returns (string memory) {
        if (_compareStrings(_category, "BRONZE_PIGGY")) {
            return '<stop offset="0%" style="stop-color:#2C1810"/><stop offset="100%" style="stop-color:#1A0F08"/>';
        } else if (_compareStrings(_category, "SILVER_PIGGY")) {
            return '<stop offset="0%" style="stop-color:#2F2F2F"/><stop offset="100%" style="stop-color:#1C1C1C"/>';
        } else if (_compareStrings(_category, "GOLD_PIGGY")) {
            return '<stop offset="0%" style="stop-color:#4A3728"/><stop offset="100%" style="stop-color:#2E1F18"/>';
        } else if (_compareStrings(_category, "DIAMOND_PIGGY")) {
            return '<stop offset="0%" style="stop-color:#0F1419"/><stop offset="100%" style="stop-color:#000810"/>';
        } else {
            return '<stop offset="0%" style="stop-color:#2D1B69"/><stop offset="100%" style="stop-color:#1A0E3D"/>';
        }
    }
    
    /**
     * @dev Generate sparkle effects based on rarity
     */
    function _getSparkles(string memory _category, uint256 _tokenId) private pure returns (string memory) {
        if (_compareStrings(_category, "DIAMOND_PIGGY")) {
            uint256 seed = _tokenId % 1000;
            return string(
                abi.encodePacked(
                    '<circle cx="', (50 + seed % 100).toString(), '" cy="', (50 + (seed * 2) % 100).toString(), '" r="2" fill="white" opacity="0.8">',
                        '<animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>',
                    '</circle>',
                    '<circle cx="', (300 + seed % 50).toString(), '" cy="', (100 + (seed * 3) % 100).toString(), '" r="1.5" fill="white" opacity="0.6">',
                        '<animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/>',
                    '</circle>',
                    '<circle cx="', (100 + seed % 80).toString(), '" cy="', (300 + (seed * 4) % 80).toString(), '" r="1" fill="white" opacity="0.7">',
                        '<animate attributeName="opacity" values="0.7;0.1;0.7" dur="3s" repeatCount="indefinite"/>',
                    '</circle>'
                )
            );
        } else if (_compareStrings(_category, "GOLD_PIGGY")) {
            return '<circle cx="350" cy="50" r="1.5" fill="#FFD700" opacity="0.6"><animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/></circle>';
        }
        return "";
    }
    
    /**
     * @dev Generate the main piggy bank SVG
     */
    function _generatePiggyBank(string memory _category) private pure returns (string memory) {
        return string(
            abi.encodePacked(
                '<g transform="translate(200,200)">',
                    // Main body
                    '<ellipse cx="0" cy="0" rx="80" ry="60" fill="url(#piggy)" stroke="#000" stroke-width="2"/>',
                    // Snout
                    '<ellipse cx="0" cy="-35" rx="25" ry="15" fill="url(#piggy)" stroke="#000" stroke-width="2"/>',
                    // Nostrils
                    '<circle cx="-8" cy="-35" r="3" fill="#000"/>',
                    '<circle cx="8" cy="-35" r="3" fill="#000"/>',
                    // Eyes
                    '<circle cx="-20" cy="-15" r="8" fill="white"/>',
                    '<circle cx="20" cy="-15" r="8" fill="white"/>',
                    '<circle cx="-20" cy="-15" r="5" fill="#000"/>',
                    '<circle cx="20" cy="-15" r="5" fill="#000"/>',
                    // Ears
                    '<ellipse cx="-45" cy="-40" rx="15" ry="25" fill="url(#piggy)" stroke="#000" stroke-width="2"/>',
                    '<ellipse cx="45" cy="-40" rx="15" ry="25" fill="url(#piggy)" stroke="#000" stroke-width="2"/>',
                    // Coin slot
                    '<rect x="-20" y="-55" width="40" height="8" rx="4" fill="#000"/>',
                    // Legs
                    '<ellipse cx="-40" cy="40" rx="12" ry="20" fill="url(#piggy)" stroke="#000" stroke-width="2"/>',
                    '<ellipse cx="-15" cy="40" rx="12" ry="20" fill="url(#piggy)" stroke="#000" stroke-width="2"/>',
                    '<ellipse cx="15" cy="40" rx="12" ry="20" fill="url(#piggy)" stroke="#000" stroke-width="2"/>',
                    '<ellipse cx="40" cy="40" rx="12" ry="20" fill="url(#piggy)" stroke="#000" stroke-width="2"/>',
                    // Tail
                    '<path d="M 75 -10 Q 90 -20 85 -5 Q 95 0 80 5" fill="none" stroke="url(#piggy)" stroke-width="4" stroke-linecap="round"/>',
                '</g>'
            )
        );
    }
    
    /**
     * @dev Generate text elements for the NFT
     */
    function _generateText(string memory _category) private pure returns (string memory) {
        string memory title = _getCategoryTitle(_category);
        return string(
            abi.encodePacked(
                '<text x="200" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">',
                    title,
                '</text>',
                '<text x="200" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="white" opacity="0.8">',
                    'Piggy Boss Achievement',
                '</text>'
            )
        );
    }
    
    /**
     * @dev Get display title for category
     */
    function _getCategoryTitle(string memory _category) private pure returns (string memory) {
        if (_compareStrings(_category, "BRONZE_PIGGY")) return "Bronze Piggy";
        if (_compareStrings(_category, "SILVER_PIGGY")) return "Silver Piggy";
        if (_compareStrings(_category, "GOLD_PIGGY")) return "Gold Piggy";
        if (_compareStrings(_category, "DIAMOND_PIGGY")) return "Diamond Piggy";
        return "Piggy Achievement";
    }
    
    /**
     * @dev Compare two strings
     */
    function _compareStrings(string memory a, string memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
    
    /**
     * @dev Override transfer functions to respect soulbound tokens
     */
    function transferFrom(address from, address to, uint256 tokenId) 
        public 
        override 
        onlyTransferableToken(tokenId) 
    {
        super.transferFrom(from, to, tokenId);
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId) 
        public 
        override 
        onlyTransferableToken(tokenId) 
    {
        super.safeTransferFrom(from, to, tokenId);
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) 
        public 
        override 
        onlyTransferableToken(tokenId) 
    {
        super.safeTransferFrom(from, to, tokenId, data);
    }
    
    /**
     * @dev Required override for ERC721URIStorage
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        string memory category = tokenCategory[tokenId];
        address owner = ownerOf(tokenId);
        
        // Reduce achievement points
        userAchievementPoints[owner] -= nftCategories[category].achievementPoints;
        userHasNFT[owner][category] = false;
        
        super._burn(tokenId);
    }
    
    /**
     * @dev Required override for ERC721URIStorage
     */
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }
    
    // Admin functions
    function addNFTCategory(
        string calldata _category,
        string calldata _name,
        string calldata _description,
        string calldata _imageURI,
        uint256 _rarity,
        bool _isSoulbound,
        uint256 _achievementPoints
    ) external onlyOwner {
        require(bytes(_category).length > 0, "Invalid category");
        require(_rarity >= 1 && _rarity <= 5, "Invalid rarity");
        
        nftCategories[_category] = NFTMetadata({
            name: _name,
            description: _description,
            imageURI: _imageURI,
            rarity: _rarity,
            isSoulbound: _isSoulbound,
            achievementPoints: _achievementPoints
        });
        
        emit CategoryAdded(_category, _name, _rarity, _isSoulbound, _achievementPoints);
    }
    
    function authorizeMinter(address _minter, bool _authorized) external onlyOwner {
        authorizedMinters[_minter] = _authorized;
        emit MinterAuthorized(_minter, _authorized);
    }
    
    function setBaseURI(string calldata _baseURI) external onlyOwner {
        _baseTokenURI = _baseURI;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function getCurrentTokenId() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
