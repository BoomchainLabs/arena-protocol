require("dotenv").config();
const { ethers } = require("ethers");

const FIGHT_RESULT_ABI = [
  "event FightResult(address indexed player, bool win, uint256 indexed fighterId, uint8 mode, uint256 reward)",
  "event FighterMinted(address indexed player, uint256 indexed tokenId, uint8 rarity)",
  "event NFTListed(address indexed seller, uint256 indexed tokenId, uint256 price)",
  "event NFTSold(address indexed buyer, address indexed seller, uint256 indexed tokenId, uint256 price)",
  "event ListingCancelled(address indexed seller, uint256 indexed tokenId)",
];

let provider = null;
let arenaBattleContract = null;
let arenaFighterNFTContract = null;
let arenaMarketplaceContract = null;

function start(broadcast, pool) {
  const rpcUrl = process.env.BASE_RPC_URL || "https://mainnet.base.org";

  try {
    provider = new ethers.JsonRpcProvider(rpcUrl);

    const battleAddress = process.env.ARENA_BATTLE_ADDRESS;
    const fighterAddress = process.env.ARENA_FIGHTER_NFT_ADDRESS;
    const marketplaceAddress = process.env.ARENA_MARKETPLACE_ADDRESS;

    if (!battleAddress || !fighterAddress || !marketplaceAddress) {
      console.log("[Indexer] Contract addresses not configured - skipping on-chain event indexing");
      console.log("[Indexer] Set ARENA_BATTLE_ADDRESS, ARENA_FIGHTER_NFT_ADDRESS, ARENA_MARKETPLACE_ADDRESS in .env");
      return;
    }

    arenaBattleContract = new ethers.Contract(battleAddress, FIGHT_RESULT_ABI, provider);
    arenaFighterNFTContract = new ethers.Contract(fighterAddress, FIGHT_RESULT_ABI, provider);
    arenaMarketplaceContract = new ethers.Contract(marketplaceAddress, FIGHT_RESULT_ABI, provider);

    arenaBattleContract.on("FightResult", async (player, win, fighterId, mode, reward, event) => {
      console.log("[Indexer] FightResult:", { player, win, fighterId: fighterId.toString(), mode, reward: ethers.formatEther(reward) });

      const modeStr = mode === 0 ? "PvE" : "PvP";
      const rewardStr = ethers.formatEther(reward);

      try {
        await pool.query(
          `INSERT INTO battles (player, fighter_id, win, reward, mode, tx_hash)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [player.toLowerCase(), fighterId.toString(), win, rewardStr, modeStr, event.log.transactionHash]
        );

        await pool.query(
          `INSERT INTO players (address, total_wins, total_battles, total_rewards)
           VALUES ($1, $2, 1, $3)
           ON CONFLICT (address) DO UPDATE SET
             total_wins = players.total_wins + $2,
             total_battles = players.total_battles + 1,
             total_rewards = (CAST(players.total_rewards AS NUMERIC) + $4)::TEXT,
             updated_at = NOW()`,
          [player.toLowerCase(), win ? 1 : 0, win ? rewardStr : "0", win ? parseFloat(rewardStr) : 0]
        );

        broadcast({
          type: "fight",
          data: { player, win, fighterId: fighterId.toString(), mode: modeStr, reward: rewardStr },
        });
      } catch (err) {
        console.error("[Indexer] Error recording fight:", err);
      }
    });

    arenaFighterNFTContract.on("FighterMinted", async (player, tokenId, rarity, event) => {
      console.log("[Indexer] FighterMinted:", { player, tokenId: tokenId.toString(), rarity });

      try {
        await pool.query(
          `INSERT INTO players (address, total_wins, total_battles, total_rewards, fighters)
           VALUES ($1, 0, 0, '0', 1)
           ON CONFLICT (address) DO UPDATE SET
             fighters = players.fighters + 1,
             updated_at = NOW()`,
          [player.toLowerCase()]
        );

        broadcast({
          type: "mint",
          data: { player, tokenId: tokenId.toString(), rarity },
        });
      } catch (err) {
        console.error("[Indexer] Error recording mint:", err);
      }
    });

    arenaMarketplaceContract.on("NFTListed", async (seller, tokenId, price, event) => {
      console.log("[Indexer] NFTListed:", { seller, tokenId: tokenId.toString(), price: ethers.formatEther(price) });

      try {
        await pool.query(
          `INSERT INTO market_listings (token_id, seller, price, active)
           VALUES ($1, $2, $3, true)
           ON CONFLICT (token_id) DO UPDATE SET
             seller = EXCLUDED.seller,
             price = EXCLUDED.price,
             active = true,
             listed_at = NOW()`,
          [tokenId.toString(), seller.toLowerCase(), ethers.formatEther(price)]
        );

        broadcast({ type: "listing", data: { seller, tokenId: tokenId.toString(), price: ethers.formatEther(price) } });
      } catch (err) {
        console.error("[Indexer] Error recording listing:", err);
      }
    });

    arenaMarketplaceContract.on("NFTSold", async (buyer, seller, tokenId, price, event) => {
      console.log("[Indexer] NFTSold:", { buyer, seller, tokenId: tokenId.toString() });

      try {
        await pool.query(
          "UPDATE market_listings SET active = false WHERE token_id = $1",
          [tokenId.toString()]
        );

        broadcast({ type: "sold", data: { buyer, seller, tokenId: tokenId.toString() } });
      } catch (err) {
        console.error("[Indexer] Error recording sale:", err);
      }
    });

    arenaMarketplaceContract.on("ListingCancelled", async (seller, tokenId, event) => {
      console.log("[Indexer] ListingCancelled:", { seller, tokenId: tokenId.toString() });

      try {
        await pool.query(
          "UPDATE market_listings SET active = false WHERE token_id = $1",
          [tokenId.toString()]
        );

        broadcast({ type: "cancelled", data: { seller, tokenId: tokenId.toString() } });
      } catch (err) {
        console.error("[Indexer] Error recording cancel:", err);
      }
    });

    console.log("[Indexer] Listening for on-chain events on Base Mainnet...");
  } catch (err) {
    console.error("[Indexer] Failed to start:", err.message);
  }
}

module.exports = { start };
