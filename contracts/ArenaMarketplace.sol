// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ArenaMarketplace is Ownable {
    IERC20 public arenaCoin;
    IERC721 public fighterNFT;

    uint256 public constant MARKETPLACE_FEE_BPS = 200; // 2%
    uint256 public constant BASIS_POINTS = 10000;

    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256[] public activeListingIds;

    event NFTListed(address indexed seller, uint256 indexed tokenId, uint256 price);
    event NFTSold(address indexed buyer, address indexed seller, uint256 indexed tokenId, uint256 price);
    event ListingCancelled(address indexed seller, uint256 indexed tokenId);

    constructor(
        address initialOwner,
        address _arenaCoin,
        address _fighterNFT
    ) Ownable(initialOwner) {
        arenaCoin = IERC20(_arenaCoin);
        fighterNFT = IERC721(_fighterNFT);
    }

    function listNFT(uint256 tokenId, uint256 price) external {
        require(fighterNFT.ownerOf(tokenId) == msg.sender, "Not your fighter");
        require(fighterNFT.isApprovedForAll(msg.sender, address(this)) || fighterNFT.getApproved(tokenId) == address(this), "Marketplace not approved");
        require(price > 0, "Price must be > 0");
        require(!listings[tokenId].active, "Already listed");

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });

        activeListingIds.push(tokenId);
        emit NFTListed(msg.sender, tokenId, price);
    }

    function buyNFT(uint256 tokenId) external {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Not listed");
        require(listing.seller != msg.sender, "Cannot buy your own listing");
        require(arenaCoin.balanceOf(msg.sender) >= listing.price, "Insufficient ARENA");

        uint256 fee = (listing.price * MARKETPLACE_FEE_BPS) / BASIS_POINTS;
        uint256 sellerAmount = listing.price - fee;

        arenaCoin.transferFrom(msg.sender, listing.seller, sellerAmount);
        arenaCoin.transferFrom(msg.sender, owner(), fee);

        fighterNFT.transferFrom(listing.seller, msg.sender, tokenId);

        listing.active = false;
        _removeFromActiveListings(tokenId);

        emit NFTSold(msg.sender, listing.seller, tokenId, listing.price);
    }

    function cancelListing(uint256 tokenId) external {
        require(listings[tokenId].seller == msg.sender, "Not your listing");
        require(listings[tokenId].active, "Not listed");

        listings[tokenId].active = false;
        _removeFromActiveListings(tokenId);

        emit ListingCancelled(msg.sender, tokenId);
    }

    function getActiveListings() external view returns (uint256[] memory) {
        return activeListingIds;
    }

    function _removeFromActiveListings(uint256 tokenId) internal {
        for (uint256 i = 0; i < activeListingIds.length; i++) {
            if (activeListingIds[i] == tokenId) {
                activeListingIds[i] = activeListingIds[activeListingIds.length - 1];
                activeListingIds.pop();
                break;
            }
        }
    }
}
