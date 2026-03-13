// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ArenaRewardVault is Ownable {
    IERC20 public arenaCoin;

    event RewardsDeposited(address indexed from, uint256 amount);
    event RewardsWithdrawn(address indexed to, uint256 amount);

    constructor(address initialOwner, address _arenaCoin) Ownable(initialOwner) {
        arenaCoin = IERC20(_arenaCoin);
    }

    function depositRewards(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        arenaCoin.transferFrom(msg.sender, address(this), amount);
        emit RewardsDeposited(msg.sender, amount);
    }

    function withdrawRewards(address to, uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be > 0");
        require(arenaCoin.balanceOf(address(this)) >= amount, "Insufficient vault balance");
        arenaCoin.transfer(to, amount);
        emit RewardsWithdrawn(to, amount);
    }

    function vaultBalance() external view returns (uint256) {
        return arenaCoin.balanceOf(address(this));
    }
}
