// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ArenaLeaderboard is Ownable {
    struct PlayerStats {
        uint256 totalWins;
        uint256 totalBattles;
        uint256 totalRewards;
    }

    mapping(address => PlayerStats) public playerStats;
    address[] public registeredPlayers;
    mapping(address => bool) public isRegistered;

    address public battleContract;

    event StatsUpdated(address indexed player, uint256 wins, uint256 battles, uint256 rewards);

    modifier onlyBattle() {
        require(msg.sender == battleContract || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setBattleContract(address _battleContract) external onlyOwner {
        battleContract = _battleContract;
    }

    function recordFight(address player, bool win, uint256 reward) external onlyBattle {
        if (!isRegistered[player]) {
            registeredPlayers.push(player);
            isRegistered[player] = true;
        }

        playerStats[player].totalBattles++;
        if (win) {
            playerStats[player].totalWins++;
            playerStats[player].totalRewards += reward;
        }

        emit StatsUpdated(
            player,
            playerStats[player].totalWins,
            playerStats[player].totalBattles,
            playerStats[player].totalRewards
        );
    }

    function getTopPlayers(uint256 count) external view returns (address[] memory, PlayerStats[] memory) {
        uint256 total = registeredPlayers.length;
        uint256 resultCount = count < total ? count : total;

        address[] memory sorted = new address[](total);
        for (uint256 i = 0; i < total; i++) {
            sorted[i] = registeredPlayers[i];
        }

        for (uint256 i = 0; i < total - 1; i++) {
            for (uint256 j = 0; j < total - i - 1; j++) {
                if (playerStats[sorted[j]].totalWins < playerStats[sorted[j + 1]].totalWins) {
                    (sorted[j], sorted[j + 1]) = (sorted[j + 1], sorted[j]);
                }
            }
        }

        address[] memory topAddresses = new address[](resultCount);
        PlayerStats[] memory topStats = new PlayerStats[](resultCount);

        for (uint256 i = 0; i < resultCount; i++) {
            topAddresses[i] = sorted[i];
            topStats[i] = playerStats[sorted[i]];
        }

        return (topAddresses, topStats);
    }

    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }

    function totalPlayers() external view returns (uint256) {
        return registeredPlayers.length;
    }
}
