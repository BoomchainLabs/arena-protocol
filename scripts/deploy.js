const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Arena Protocol contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // 1. Deploy ArenaCoin
  console.log("\n[1/7] Deploying ArenaCoin...");
  const ArenaCoin = await ethers.getContractFactory("ArenaCoin");
  const arenaCoin = await ArenaCoin.deploy(deployer.address);
  await arenaCoin.waitForDeployment();
  const arenaCoinAddress = await arenaCoin.getAddress();
  console.log("  ArenaCoin deployed to:", arenaCoinAddress);

  // 2. Deploy ArenaFighterNFT
  console.log("\n[2/7] Deploying ArenaFighterNFT...");
  const ArenaFighterNFT = await ethers.getContractFactory("ArenaFighterNFT");
  const arenaFighterNFT = await ArenaFighterNFT.deploy(deployer.address);
  await arenaFighterNFT.waitForDeployment();
  const arenaFighterNFTAddress = await arenaFighterNFT.getAddress();
  console.log("  ArenaFighterNFT deployed to:", arenaFighterNFTAddress);

  // 3. Deploy ArenaRewardVault
  console.log("\n[3/7] Deploying ArenaRewardVault...");
  const ArenaRewardVault = await ethers.getContractFactory("ArenaRewardVault");
  const arenaRewardVault = await ArenaRewardVault.deploy(deployer.address, arenaCoinAddress);
  await arenaRewardVault.waitForDeployment();
  const arenaRewardVaultAddress = await arenaRewardVault.getAddress();
  console.log("  ArenaRewardVault deployed to:", arenaRewardVaultAddress);

  // 4. Deploy ArenaBattle
  console.log("\n[4/7] Deploying ArenaBattle...");
  const ArenaBattle = await ethers.getContractFactory("ArenaBattle");
  const arenaBattle = await ArenaBattle.deploy(
    deployer.address,
    arenaCoinAddress,
    arenaFighterNFTAddress,
    arenaRewardVaultAddress
  );
  await arenaBattle.waitForDeployment();
  const arenaBattleAddress = await arenaBattle.getAddress();
  console.log("  ArenaBattle deployed to:", arenaBattleAddress);

  // 5. Deploy ArenaStaking
  console.log("\n[5/7] Deploying ArenaStaking...");
  const ArenaStaking = await ethers.getContractFactory("ArenaStaking");
  const arenaStaking = await ArenaStaking.deploy(deployer.address, arenaCoinAddress);
  await arenaStaking.waitForDeployment();
  const arenaStakingAddress = await arenaStaking.getAddress();
  console.log("  ArenaStaking deployed to:", arenaStakingAddress);

  // 6. Deploy ArenaMarketplace
  console.log("\n[6/7] Deploying ArenaMarketplace...");
  const ArenaMarketplace = await ethers.getContractFactory("ArenaMarketplace");
  const arenaMarketplace = await ArenaMarketplace.deploy(
    deployer.address,
    arenaCoinAddress,
    arenaFighterNFTAddress
  );
  await arenaMarketplace.waitForDeployment();
  const arenaMarketplaceAddress = await arenaMarketplace.getAddress();
  console.log("  ArenaMarketplace deployed to:", arenaMarketplaceAddress);

  // 7. Deploy ArenaLeaderboard
  console.log("\n[7/7] Deploying ArenaLeaderboard...");
  const ArenaLeaderboard = await ethers.getContractFactory("ArenaLeaderboard");
  const arenaLeaderboard = await ArenaLeaderboard.deploy(deployer.address);
  await arenaLeaderboard.waitForDeployment();
  const arenaLeaderboardAddress = await arenaLeaderboard.getAddress();
  console.log("  ArenaLeaderboard deployed to:", arenaLeaderboardAddress);

  // Post-deployment setup
  console.log("\n[Setup] Configuring contracts...");
  const tx = await arenaLeaderboard.setBattleContract(arenaBattleAddress);
  await tx.wait();
  console.log("  ArenaLeaderboard: BattleContract set to", arenaBattleAddress);

  console.log("\n========================================");
  console.log("  ARENA PROTOCOL DEPLOYMENT COMPLETE");
  console.log("========================================");
  console.log("ArenaCoin:        ", arenaCoinAddress);
  console.log("ArenaFighterNFT:  ", arenaFighterNFTAddress);
  console.log("ArenaRewardVault: ", arenaRewardVaultAddress);
  console.log("ArenaBattle:      ", arenaBattleAddress);
  console.log("ArenaStaking:     ", arenaStakingAddress);
  console.log("ArenaMarketplace: ", arenaMarketplaceAddress);
  console.log("ArenaLeaderboard: ", arenaLeaderboardAddress);
  console.log("========================================");
  console.log("\nSave these addresses in your .env file as:");
  console.log(`VITE_ARENA_COIN_ADDRESS=${arenaCoinAddress}`);
  console.log(`VITE_ARENA_FIGHTER_NFT_ADDRESS=${arenaFighterNFTAddress}`);
  console.log(`VITE_ARENA_REWARD_VAULT_ADDRESS=${arenaRewardVaultAddress}`);
  console.log(`VITE_ARENA_BATTLE_ADDRESS=${arenaBattleAddress}`);
  console.log(`VITE_ARENA_STAKING_ADDRESS=${arenaStakingAddress}`);
  console.log(`VITE_ARENA_MARKETPLACE_ADDRESS=${arenaMarketplaceAddress}`);
  console.log(`VITE_ARENA_LEADERBOARD_ADDRESS=${arenaLeaderboardAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
