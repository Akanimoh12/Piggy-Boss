// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title INFTRewards
 * @dev Interface for the NFTRewards contract
 */
interface INFTRewards is IERC721 {
    // Structs
    struct NFTMetadata {
        string name;
        string description;
        string imageURI;
        uint256 rarity; // 1-5 scale
        bool isSoulbound;
        uint256 achievementPoints;
    }
    
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
    
    // Core functions
    function mintReward(address _recipient, string calldata _category) external;
    
    function mintTimeBasedReward(address _recipient, uint256 _daysCompleted) external;
    
    function mintAmountBasedReward(address _recipient, uint256 _totalSaved) external;
    
    function batchMintRewards(address _recipient, string[] calldata _categories) external;
    
    // View functions
    function hasNFT(address _user, string calldata _category) external view returns (bool);
    
    function getUserNFTSummary(address _user) 
        external 
        view 
        returns (uint256 nftCount, uint256 achievementPoints, uint256 rareNFTs);
    
    function getUserTier(address _user) 
        external 
        view 
        returns (uint256 tier, string memory tierName);
    
    function userAchievementPoints(address _user) external view returns (uint256);
    
    function nftCategories(string calldata _category) external view returns (NFTMetadata memory);
    
    function tokenCategory(uint256 _tokenId) external view returns (string memory);
    
    function isSoulbound(uint256 _tokenId) external view returns (bool);
    
    // Admin functions
    function addNFTCategory(
        string calldata _category,
        string calldata _name,
        string calldata _description,
        string calldata _imageURI,
        uint256 _rarity,
        bool _isSoulbound,
        uint256 _achievementPoints
    ) external;
    
    function authorizeMinter(address _minter, bool _authorized) external;
    
    function setBaseURI(string calldata _baseURI) external;
}
