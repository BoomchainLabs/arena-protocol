// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ArenaStaking is Ownable {
    IERC20 public arenaCoin;

    uint256 public constant DAILY_REWARD_RATE = 100; // 1% per day (100 basis points)
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_DAY = 86400;

    struct StakeInfo {
        uint256 amount;
        uint256 stakedAt;
        uint256 lastClaimAt;
    }

    mapping(address => StakeInfo) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 reward);

    constructor(address initialOwner, address _arenaCoin) Ownable(initialOwner) {
        arenaCoin = IERC20(_arenaCoin);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(stakes[msg.sender].amount == 0, "Already staking, unstake first");

        arenaCoin.transferFrom(msg.sender, address(this), amount);

        stakes[msg.sender] = StakeInfo({
            amount: amount,
            stakedAt: block.timestamp,
            lastClaimAt: block.timestamp
        });

        emit Staked(msg.sender, amount);
    }

    function unstake() external {
        StakeInfo storage info = stakes[msg.sender];
        require(info.amount > 0, "Nothing staked");

        uint256 pending = _pendingRewards(msg.sender);
        uint256 amount = info.amount;

        delete stakes[msg.sender];

        arenaCoin.transfer(msg.sender, amount);

        if (pending > 0 && arenaCoin.balanceOf(address(this)) >= pending) {
            arenaCoin.transfer(msg.sender, pending);
            emit RewardsClaimed(msg.sender, pending);
        }

        emit Unstaked(msg.sender, amount);
    }

    function claimRewards() external {
        uint256 pending = _pendingRewards(msg.sender);
        require(pending > 0, "No rewards available");
        require(arenaCoin.balanceOf(address(this)) >= pending, "Insufficient reward pool");

        stakes[msg.sender].lastClaimAt = block.timestamp;
        arenaCoin.transfer(msg.sender, pending);

        emit RewardsClaimed(msg.sender, pending);
    }

    function pendingRewards(address user) external view returns (uint256) {
        return _pendingRewards(user);
    }

    function _pendingRewards(address user) internal view returns (uint256) {
        StakeInfo storage info = stakes[user];
        if (info.amount == 0) return 0;

        uint256 daysElapsed = (block.timestamp - info.lastClaimAt) / SECONDS_PER_DAY;
        return (info.amount * DAILY_REWARD_RATE * daysElapsed) / BASIS_POINTS;
    }
}
