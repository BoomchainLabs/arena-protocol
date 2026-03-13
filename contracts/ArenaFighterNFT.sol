// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArenaFighterNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    enum Rarity { Common, Rare, Epic, Legendary }

    struct Fighter {
        uint256 strength;
        uint256 speed;
        uint256 intelligence;
        uint256 wins;
        uint256 losses;
        Rarity rarity;
    }

    mapping(uint256 => Fighter) public fighters;

    event FighterMinted(address indexed player, uint256 indexed tokenId, Rarity rarity);

    constructor(address initialOwner) ERC721("Arena Fighter", "AFIGHT") Ownable(initialOwner) {}

    function mintFighter(address player) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(player, tokenId);

        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, player, tokenId)));

        Rarity rarity;
        uint256 rarityRoll = seed % 100;
        if (rarityRoll < 50) {
            rarity = Rarity.Common;
        } else if (rarityRoll < 80) {
            rarity = Rarity.Rare;
        } else if (rarityRoll < 95) {
            rarity = Rarity.Epic;
        } else {
            rarity = Rarity.Legendary;
        }

        uint256 baseBonus = uint256(rarity) * 10;

        fighters[tokenId] = Fighter({
            strength: 10 + (seed % 40) + baseBonus,
            speed: 10 + ((seed >> 8) % 40) + baseBonus,
            intelligence: 10 + ((seed >> 16) % 40) + baseBonus,
            wins: 0,
            losses: 0,
            rarity: rarity
        });

        emit FighterMinted(player, tokenId, rarity);
        return tokenId;
    }

    function getFighter(uint256 tokenId) external view returns (Fighter memory) {
        require(_ownerOf(tokenId) != address(0), "Fighter does not exist");
        return fighters[tokenId];
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }
}
