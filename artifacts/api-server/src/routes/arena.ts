import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable, battlesTable, marketListingsTable } from "@workspace/db/schema";
import { eq, desc, gt, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/leaderboard", async (req, res) => {
  try {
    const limit = parseInt((req.query.limit as string) || "10");
    const players = await db
      .select()
      .from(playersTable)
      .orderBy(desc(playersTable.totalWins))
      .limit(limit);

    const entries = players.map((row, idx) => ({
      rank: idx + 1,
      address: row.address,
      totalWins: row.totalWins,
      totalBattles: row.totalBattles,
      totalRewards: row.totalRewards,
      winRate: row.totalBattles > 0 ? (row.totalWins / row.totalBattles) * 100 : 0,
    }));

    res.json(entries);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/players/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const players = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.address, address.toLowerCase()))
      .limit(1);

    if (players.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    const player = players[0];

    const rankResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(playersTable)
      .where(gt(playersTable.totalWins, player.totalWins));

    res.json({
      address: player.address,
      totalWins: player.totalWins,
      totalBattles: player.totalBattles,
      totalRewards: player.totalRewards,
      fighters: player.fighters,
      rank: (rankResult[0]?.count ?? 0) + 1,
    });
  } catch (err) {
    console.error("Player stats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/battles", async (req, res) => {
  try {
    const limit = parseInt((req.query.limit as string) || "20");
    const { address } = req.query as { address?: string };

    let query = db.select().from(battlesTable).orderBy(desc(battlesTable.timestamp)).limit(limit);

    if (address) {
      query = query.where(eq(battlesTable.player, address.toLowerCase())) as typeof query;
    }

    const battles = await query;

    res.json(
      battles.map((row) => ({
        id: row.id,
        player: row.player,
        fighterId: row.fighterId,
        win: row.win,
        reward: row.reward,
        mode: row.mode,
        txHash: row.txHash,
        timestamp: row.timestamp,
      }))
    );
  } catch (err) {
    console.error("Battle history error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/battles", async (req, res) => {
  try {
    const { player, fighterId, win, reward, mode, txHash } = req.body;

    const [battle] = await db
      .insert(battlesTable)
      .values({
        player: player.toLowerCase(),
        fighterId,
        win,
        reward: reward || "0",
        mode: mode || "PvE",
        txHash: txHash || null,
      })
      .returning();

    await db
      .insert(playersTable)
      .values({
        address: player.toLowerCase(),
        totalWins: win ? 1 : 0,
        totalBattles: 1,
        totalRewards: win ? (reward || "0") : "0",
        fighters: 0,
      })
      .onConflictDoUpdate({
        target: playersTable.address,
        set: {
          totalWins: sql`${playersTable.totalWins} + ${win ? 1 : 0}`,
          totalBattles: sql`${playersTable.totalBattles} + 1`,
          totalRewards: sql`(CAST(${playersTable.totalRewards} AS NUMERIC) + ${parseFloat(win ? reward || "0" : "0")})::TEXT`,
          updatedAt: new Date(),
        },
      });

    res.json({
      id: battle.id,
      player: battle.player,
      fighterId: battle.fighterId,
      win: battle.win,
      reward: battle.reward,
      mode: battle.mode,
      txHash: battle.txHash,
      timestamp: battle.timestamp,
    });
  } catch (err) {
    console.error("Record battle error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/market/listings", async (req, res) => {
  try {
    const limit = parseInt((req.query.limit as string) || "20");
    const listings = await db
      .select()
      .from(marketListingsTable)
      .where(eq(marketListingsTable.active, true))
      .orderBy(desc(marketListingsTable.listedAt))
      .limit(limit);

    res.json(
      listings.map((row) => ({
        tokenId: row.tokenId,
        seller: row.seller,
        price: row.price,
        rarity: row.rarity,
        strength: row.strength,
        speed: row.speed,
        intelligence: row.intelligence,
        wins: row.wins,
        losses: row.losses,
        active: row.active,
      }))
    );
  } catch (err) {
    console.error("Market listings error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
