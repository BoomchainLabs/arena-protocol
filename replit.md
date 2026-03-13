# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── arena-protocol/     # Arena Protocol frontend (React + Vite)
├── contracts/              # Solidity smart contracts (Hardhat)
│   ├── ArenaCoin.sol       # ERC20 token
│   ├── ArenaFighterNFT.sol # ERC721 fighters
│   ├── ArenaBattle.sol     # Battle engine
│   ├── ArenaStaking.sol    # Staking contract
│   ├── ArenaRewardVault.sol# Reward pool
│   ├── ArenaMarketplace.sol# NFT marketplace
│   └── ArenaLeaderboard.sol# On-chain leaderboard
├── scripts/                # Deploy + verify Hardhat scripts
│   ├── deploy.js
│   └── verify.js
├── backend/                # Standalone Node.js backend (event indexer)
│   ├── server.js           # Express + WebSocket server
│   └── indexer.js          # Ethers.js on-chain event indexer
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── hardhat.config.js       # Hardhat config (Base Mainnet, Solidity 0.8.21)
├── arena-package.json      # Package.json for Hardhat project (rename to use)
├── .env.example            # Environment variable template
├── README.md               # Full project documentation
├── pnpm-workspace.yaml     # pnpm workspace config
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package
```

## Arena Protocol

### Smart Contracts (Base Mainnet, chainId 8453)

| Contract | Description |
|---|---|
| ArenaCoin (ARENA) | ERC20 token, 1M supply, mintable/burnable |
| ArenaFighterNFT (AFIGHT) | ERC721 with strength/speed/intelligence/rarity |
| ArenaBattle | Battle engine: 10 ARENA entry, 18 ARENA reward, 2 ARENA burn |
| ArenaStaking | Stake ARENA, 1% daily rewards |
| ArenaRewardVault | Reward pool for battles |
| ArenaMarketplace | NFT trading with 2% fee |
| ArenaLeaderboard | On-chain player stats |

### Frontend Screens (React + Vite + Wagmi + RainbowKit)

- **Home** — Hero banner, stats, navigation CTAs
- **Mint Fighter** — Mint NFT fighters with randomized stats + rarity
- **Battle Arena** — PvE/PvP battles, entry fee 10 ARENA, 18 ARENA reward on win
- **Leaderboard** — Top players by wins
- **Marketplace** — List/buy/cancel fighter NFTs
- **Profile** — Player stats + battle history

### Telegram Mini App

- Integrates Telegram WebApp SDK (`@twa-dev/sdk`)
- Auto-initializes on load
- Supports Telegram theme colors

## Contract Env Variables (after deployment)

```
VITE_ARENA_COIN_ADDRESS=
VITE_ARENA_FIGHTER_NFT_ADDRESS=
VITE_ARENA_REWARD_VAULT_ADDRESS=
VITE_ARENA_BATTLE_ADDRESS=
VITE_ARENA_STAKING_ADDRESS=
VITE_ARENA_MARKETPLACE_ADDRESS=
VITE_ARENA_LEADERBOARD_ADDRESS=
```

## Database Schema

- `players` — address, total_wins, total_battles, total_rewards, fighters
- `battles` — id, player, fighter_id, win, reward, mode, tx_hash, timestamp
- `market_listings` — token_id, seller, price, rarity, stats, active, listed_at

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/arena-protocol` (`@workspace/arena-protocol`)

React + Vite frontend for Arena Protocol. Uses Wagmi, framer-motion, Telegram WebApp SDK.

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes: health, leaderboard, player stats, battle history, marketplace.

### `lib/db` (`@workspace/db`)

Database layer with tables: players, battles, market_listings.

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec for Arena Protocol endpoints.

### `lib/api-zod` / `lib/api-client-react`

Generated Zod schemas and React Query hooks from OpenAPI spec.
