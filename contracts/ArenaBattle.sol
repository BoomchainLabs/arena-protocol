// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ArenaFighterNFT.sol";
import "./ArenaRewardVault.sol";

contract ArenaBattle is Ownable {
    IERC20 public arenaCoin;
    ArenaFighterNFT public fighterNFT;
    ArenaRewardVault public rewardVault;

    uint256 public constant ENTRY_FEE = 10 * 10 ** 18;
    uint256 public constant WINNER_REWARD = 18 * 10 ** 18;
    uint256 public constant BURN_AMOUNT = 2 * 10 ** 18;

    enum BattleMode { PvE, PvP }

    event FightResult(address indexed player, bool win, uint256 indexed fighterId, BattleMode mode, uint256 reward);

    constructor(
        address initialOwner,
        address _arenaCoin,
        address _fighterNFT,
        address _rewardVault
    ) Ownable(initialOwner) {
        arenaCoin = IERC20(_arenaCoin);
        fighterNFT = ArenaFighterNFT(_fighterNFT);
        rewardVault = ArenaRewardVault(_rewardVault);
    }

    function fight(uint256 fighterId, BattleMode mode) external {
        require(fighterNFT.ownerOf(fighterId) == msg.sender, "Not your fighter");
        require(arenaCoin.allowance(msg.sender, address(this)) >= ENTRY_FEE, "Approve ARENA tokens first");
        require(arenaCoin.balanceOf(msg.sender) >= ENTRY_FEE, "Insufficient ARENA balance");

        arenaCoin.transferFrom(msg.sender, address(this), ENTRY_FEE);

        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, fighterId)));
        bool win = seed % 2 == 0;

        if (win) {
            arenaCoin.transfer(address(0x000000000000000000000000000000000000dEaD), BURN_AMOUNT);
            rewardVault.withdrawRewards(msg.sender, WINNER_REWARD);
            emit FightResult(msg.sender, true, fighterId, mode, WINNER_REWARD);
        } else {
            emit FightResult(msg.sender, false, fighterId, mode, 0);
        }
    }

    function setRewardVault(address _rewardVault) external onlyOwner {
        rewardVault = ArenaRewardVault(_rewardVault);
    }
}
