import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const playersTable = pgTable("players", {
  address: text("address").primaryKey(),
  totalWins: integer("total_wins").notNull().default(0),
  totalBattles: integer("total_battles").notNull().default(0),
  totalRewards: text("total_rewards").notNull().default("0"),
  fighters: integer("fighters").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const battlesTable = pgTable("battles", {
  id: serial("id").primaryKey(),
  player: text("player").notNull(),
  fighterId: text("fighter_id").notNull(),
  win: boolean("win").notNull(),
  reward: text("reward").notNull().default("0"),
  mode: text("mode").notNull().default("PvE"),
  txHash: text("tx_hash"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const marketListingsTable = pgTable("market_listings", {
  tokenId: text("token_id").primaryKey(),
  seller: text("seller").notNull(),
  price: text("price").notNull(),
  rarity: text("rarity").notNull().default("Common"),
  strength: integer("strength").notNull().default(10),
  speed: integer("speed").notNull().default(10),
  intelligence: integer("intelligence").notNull().default(10),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  active: boolean("active").notNull().default(true),
  listedAt: timestamp("listed_at").defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(playersTable).omit({ updatedAt: true });
export const insertBattleSchema = createInsertSchema(battlesTable).omit({ id: true, timestamp: true });
export const insertMarketListingSchema = createInsertSchema(marketListingsTable).omit({ listedAt: true });

export type Player = typeof playersTable.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Battle = typeof battlesTable.$inferSelect;
export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type MarketListing = typeof marketListingsTable.$inferSelect;
export type InsertMarketListing = z.infer<typeof insertMarketListingSchema>;
