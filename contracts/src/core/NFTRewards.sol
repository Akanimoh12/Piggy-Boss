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
    
    mapping(address => bool) public authorizedMinters;
    mapping(string => NFTMetadata) private _nftCategories;
    mapping(address => mapping(string => bool)) public userHasNFT;
    mapping(address => uint256) public userAchievementPoints;
    mapping(uint256 => string) public tokenCategory;
    mapping(uint256 => bool) public isSoulbound;
    
    string private _baseTokenURI;
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized minter");
        _;
    }
    
    modifier onlyTransferableToken(uint256 tokenId) {
        require(!isSoulbound[tokenId], "Token is soulbound");
        _;
    }
    
    constructor() ERC721("PiggyBoss NFT Rewards", "PNFT") {
        _initializeCategories();
    }
    
    function nftCategories(string calldata _category) external view returns (NFTMetadata memory) {
        return _nftCategories[_category];
    }
    
    function _initializeCategories() private {
        _nftCategories["first_deposit"] = NFTMetadata({
            name: "First Deposit Achievement",
            description: "First time saver reward",
            imageURI: "",
            rarity: 1,
            isSoulbound: true,
            achievementPoints: 100
        });
        
        _nftCategories["week_saver"] = NFTMetadata({
            name: "Week Saver",
            description: "Completed 7-day plan",
            imageURI: "",
            rarity: 2,
            isSoulbound: false,
            achievementPoints: 50
        });
        
        _nftCategories["month_saver"] = NFTMetadata({
            name: "Month Saver",
            description: "Completed 30-day plan",
            imageURI: "",
            rarity: 3,
            isSoulbound: false,
            achievementPoints: 200
        });
        
        _nftCategories["quarter_saver"] = NFTMetadata({
            name: "Quarter Saver",
            description: "Completed 90-day plan",
            imageURI: "",
            rarity: 4,
            isSoulbound: false,
            achievementPoints: 500
        });
    }
    
    function mint(address _to, uint256 _amount, uint256 _planDays) 
        external 
        onlyAuthorizedMinter 
        whenNotPaused 
        returns (uint256) 
    {
        require(_to != address(0), "Cannot mint to zero address");
        
        string memory category = _determineCategoryFromPlan(_amount, _planDays);
        
        if (userHasNFT[_to][category]) {
            return 0;
        }
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(_to, tokenId);
        
        NFTMetadata memory metadata = _nftCategories[category];
        string memory uri = _generateTokenURI(tokenId, metadata);
        _setTokenURI(tokenId, uri);
        
        tokenCategory[tokenId] = category;
        userHasNFT[_to][category] = true;
        isSoulbound[tokenId] = metadata.isSoulbound;
        
        uint256 oldPoints = userAchievementPoints[_to];
        userAchievementPoints[_to] += metadata.achievementPoints;
        
        emit NFTMinted(_to, tokenId, category, metadata.rarity, metadata.achievementPoints);
        emit AchievementPointsUpdated(_to, oldPoints, userAchievementPoints[_to]);
        
        return tokenId;
    }
    
    function mintReward(address _recipient, string calldata _category) external onlyAuthorizedMinter {
        require(_recipient != address(0), "Cannot mint to zero address");
        require(bytes(_nftCategories[_category].name).length > 0, "Category does not exist");
        
        if (userHasNFT[_recipient][_category]) {
            return;
        }
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(_recipient, tokenId);
        
        NFTMetadata memory metadata = _nftCategories[_category];
        string memory uri = _generateTokenURI(tokenId, metadata);
        _setTokenURI(tokenId, uri);
        
        tokenCategory[tokenId] = _category;
        userHasNFT[_recipient][_category] = true;
        isSoulbound[tokenId] = metadata.isSoulbound;
        
        uint256 oldPoints = userAchievementPoints[_recipient];
        userAchievementPoints[_recipient] += metadata.achievementPoints;
        
        emit NFTMinted(_recipient, tokenId, _category, metadata.rarity, metadata.achievementPoints);
        emit AchievementPointsUpdated(_recipient, oldPoints, userAchievementPoints[_recipient]);
    }
    
    function mintTimeBasedReward(address _recipient, uint256 _daysCompleted) external onlyAuthorizedMinter {
        string memory category = "";
        if (_daysCompleted >= 7) category = "week_saver";
        if (_daysCompleted >= 30) category = "month_saver";
        if (_daysCompleted >= 90) category = "quarter_saver";
        
        if (bytes(category).length > 0) {
            this.mintReward(_recipient, category);
        }
    }
    
    function mintAmountBasedReward(address _recipient, uint256 _totalSaved) external onlyAuthorizedMinter {
        string memory category = "";
        if (_totalSaved >= 100 * 10**18) category = "first_deposit";
        
        if (bytes(category).length > 0) {
            this.mintReward(_recipient, category);
        }
    }
    
    function batchMintRewards(address _recipient, string[] calldata _categories) external onlyAuthorizedMinter {
        for (uint256 i = 0; i < _categories.length; i++) {
            this.mintReward(_recipient, _categories[i]);
        }
    }
    
    function hasNFT(address _user, string calldata _category) external view returns (bool) {
        return userHasNFT[_user][_category];
    }
    
    function getUserNFTSummary(address _user) 
        external 
        view 
        returns (uint256 nftCount, uint256 achievementPoints, uint256 rareNFTs) 
    {
        nftCount = balanceOf(_user);
        achievementPoints = userAchievementPoints[_user];
        
        // Count rare NFTs (assuming tier 3+ are rare)
        rareNFTs = 0;
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (_exists(i) && ownerOf(i) == _user) {
                string memory category = tokenCategory[i];
                NFTMetadata memory metadata = _nftCategories[category];
                if (metadata.rarity >= 3) {
                    rareNFTs++;
                }
            }
        }
    }
    
    function getUserTier(address _user) 
        external 
        view 
        returns (uint256 tier, string memory tierName) 
    {
        uint256 points = userAchievementPoints[_user];
        
        if (points >= 1000) {
            return (4, "Diamond");
        } else if (points >= 500) {
            return (3, "Gold");
        } else if (points >= 250) {
            return (2, "Silver");
        } else if (points >= 100) {
            return (1, "Bronze");
        } else {
            return (0, "Starter");
        }
    }
    
    function addNFTCategory(
        string calldata _category,
        string calldata _name,
        string calldata _description,
        string calldata _imageURI,
        uint256 _rarity,
        bool _isSoulbound,
        uint256 _achievementPoints
    ) external onlyOwner {
        _nftCategories[_category] = NFTMetadata({
            name: _name,
            description: _description,
            imageURI: _imageURI,
            rarity: _rarity,
            isSoulbound: _isSoulbound,
            achievementPoints: _achievementPoints
        });
        
        emit CategoryAdded(_category, _name, _rarity, _isSoulbound, _achievementPoints);
    }
    
    function _determineCategoryFromPlan(uint256 _amount, uint256 _planDays) 
        private 
        pure 
        returns (string memory) 
    {
        if (_planDays == 7) return "week_saver";
        if (_planDays == 14) return "month_saver";
        if (_planDays == 30) return "month_saver";
        if (_planDays == 90) return "quarter_saver";
        return "first_deposit";
    }
    
    function _generateTokenURI(uint256 _tokenId, NFTMetadata memory _metadata) 
        private 
        pure 
        returns (string memory) 
    {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "', _metadata.name, ' #', _tokenId.toString(), '",',
                        '"description": "', _metadata.description, '",',
                        '"image": "', _metadata.imageURI, '",',
                        '"attributes": [',
                        '{"trait_type": "Rarity", "value": ', _metadata.rarity.toString(), '},',
                        '{"trait_type": "Achievement Points", "value": ', _metadata.achievementPoints.toString(), '}',
                        ']}'
                    )
                )
            )
        );
        
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
    
    function addCategory(
        string calldata _category,
        string calldata _name,
        uint256 _rarity,
        bool _isSoulbound,
        uint256 _achievementPoints,
        string calldata _imageURI,
        string calldata _attributes
    ) external onlyOwner {
        _nftCategories[_category] = NFTMetadata({
            name: _name,
            description: _attributes,
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
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function setBaseURI(string calldata _baseURI) external onlyOwner {
        _baseTokenURI = _baseURI;
    }
    
    function transferFrom(address from, address to, uint256 tokenId) 
        public 
        override(ERC721, IERC721) 
        onlyTransferableToken(tokenId) 
    {
        super.transferFrom(from, to, tokenId);
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId) 
        public 
        override(ERC721, IERC721) 
        onlyTransferableToken(tokenId) 
    {
        super.safeTransferFrom(from, to, tokenId);
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) 
        public 
        override(ERC721, IERC721) 
        onlyTransferableToken(tokenId) 
    {
        super.safeTransferFrom(from, to, tokenId, data);
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        delete tokenCategory[tokenId];
        delete isSoulbound[tokenId];
    }
    
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721, ERC721URIStorage, IERC165) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
    
    function getUserAchievements(address _user) 
        external 
        view 
        returns (uint256[] memory tokenIds, string[] memory categories) 
    {
        uint256 balance = balanceOf(_user);
        tokenIds = new uint256[](balance);
        categories = new string[](balance);
        
        uint256 index = 0;
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (_exists(i) && ownerOf(i) == _user) {
                tokenIds[index] = i;
                categories[index] = tokenCategory[i];
                index++;
            }
        }
    }
    
    function getTotalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
