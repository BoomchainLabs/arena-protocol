const { run } = require("hardhat");
require("dotenv").config();

async function main() {
  const {
    ARENA_COIN_ADDRESS,
    ARENA_FIGHTER_NFT_ADDRESS,
    ARENA_REWARD_VAULT_ADDRESS,
    ARENA_BATTLE_ADDRESS,
    ARENA_STAKING_ADDRESS,
    ARENA_MARKETPLACE_ADDRESS,
    ARENA_LEADERBOARD_ADDRESS,
    DEPLOYER_ADDRESS,
  } = process.env;

  if (!ARENA_COIN_ADDRESS) {
    console.error("Set contract addresses in .env before running verify.js");
    process.exit(1);
  }

  console.log("Verifying Arena Protocol contracts on Basescan...\n");

  try {
    console.log("[1/7] Verifying ArenaCoin...");
    await run("verify:verify", {
      address: ARENA_COIN_ADDRESS,
      constructorArguments: [DEPLOYER_ADDRESS],
    });
    console.log("  ArenaCoin verified!\n");
  } catch (e) { console.log("  ArenaCoin:", e.message); }

  try {
    console.log("[2/7] Verifying ArenaFighterNFT...");
    await run("verify:verify", {
      address: ARENA_FIGHTER_NFT_ADDRESS,
      constructorArguments: [DEPLOYER_ADDRESS],
    });
    console.log("  ArenaFighterNFT verified!\n");
  } catch (e) { console.log("  ArenaFighterNFT:", e.message); }

  try {
    console.log("[3/7] Verifying ArenaRewardVault...");
    await run("verify:verify", {
      address: ARENA_REWARD_VAULT_ADDRESS,
      constructorArguments: [DEPLOYER_ADDRESS, ARENA_COIN_ADDRESS],
    });
    console.log("  ArenaRewardVault verified!\n");
  } catch (e) { console.log("  ArenaRewardVault:", e.message); }

  try {
    console.log("[4/7] Verifying ArenaBattle...");
    await run("verify:verify", {
      address: ARENA_BATTLE_ADDRESS,
      constructorArguments: [
        DEPLOYER_ADDRESS,
        ARENA_COIN_ADDRESS,
        ARENA_FIGHTER_NFT_ADDRESS,
        ARENA_REWARD_VAULT_ADDRESS,
      ],
    });
    console.log("  ArenaBattle verified!\n");
  } catch (e) { console.log("  ArenaBattle:", e.message); }

  try {
    console.log("[5/7] Verifying ArenaStaking...");
    await run("verify:verify", {
      address: ARENA_STAKING_ADDRESS,
      constructorArguments: [DEPLOYER_ADDRESS, ARENA_COIN_ADDRESS],
    });
    console.log("  ArenaStaking verified!\n");
  } catch (e) { console.log("  ArenaStaking:", e.message); }

  try {
    console.log("[6/7] Verifying ArenaMarketplace...");
    await run("verify:verify", {
      address: ARENA_MARKETPLACE_ADDRESS,
      constructorArguments: [DEPLOYER_ADDRESS, ARENA_COIN_ADDRESS, ARENA_FIGHTER_NFT_ADDRESS],
    });
    console.log("  ArenaMarketplace verified!\n");
  } catch (e) { console.log("  ArenaMarketplace:", e.message); }

  try {
    console.log("[7/7] Verifying ArenaLeaderboard...");
    await run("verify:verify", {
      address: ARENA_LEADERBOARD_ADDRESS,
      constructorArguments: [DEPLOYER_ADDRESS],
    });
    console.log("  ArenaLeaderboard verified!\n");
  } catch (e) { console.log("  ArenaLeaderboard:", e.message); }

  console.log("Verification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
