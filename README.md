# Arena Protocol

A complete Web3 GameFi platform deployed on Base Mainnet (chainId 8453). Fight, mint, trade, and earn ARENA tokens.

## Features

- **ArenaCoin (ARENA)** — ERC20 governance and utility token
- **Arena Fighters (AFIGHT)** — ERC721 NFT fighters with on-chain stats (strength, speed, intelligence, rarity)
- **Battle Engine** — PvE and PvP battles with 10 ARENA entry fee, 18 ARENA winner reward, 2 ARENA burn
- **Staking** — Stake ARENA tokens and earn daily rewards
- **Marketplace** — List, buy, and cancel fighter NFT listings (2% fee)
- **Leaderboard** — On-chain and off-chain leaderboard tracking
- **Telegram Mini App** — Full Telegram WebApp SDK integration

## Stack

- **Contracts**: Solidity 0.8.21, OpenZeppelin, Hardhat
- **Backend**: Node.js, Express, WebSockets, Ethers.js, PostgreSQL
- **Frontend**: Next.js / Vite + React, TailwindCSS, Wagmi, RainbowKit, Telegram WebApp SDK

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```
PRIVATE_KEY=your_deployer_private_key
BASESCAN_API_KEY=your_basescan_api_key
```

### 3. Compile contracts

```bash
npx hardhat compile
```

### 4. Deploy to Base Mainnet

```bash
npx hardhat run scripts/deploy.js --network base
```

Copy the printed addresses into your `.env` file.

### 5. Verify contracts

```bash
# Verify each contract individually:
npx hardhat verify --network base <ARENA_COIN_ADDRESS> <DEPLOYER_ADDRESS>
npx hardhat verify --network base <ARENA_FIGHTER_NFT_ADDRESS> <DEPLOYER_ADDRESS>
npx hardhat verify --network base <ARENA_REWARD_VAULT_ADDRESS> <DEPLOYER_ADDRESS> <ARENA_COIN_ADDRESS>
npx hardhat verify --network base <ARENA_BATTLE_ADDRESS> <DEPLOYER_ADDRESS> <ARENA_COIN_ADDRESS> <ARENA_FIGHTER_NFT_ADDRESS> <ARENA_REWARD_VAULT_ADDRESS>
npx hardhat verify --network base <ARENA_STAKING_ADDRESS> <DEPLOYER_ADDRESS> <ARENA_COIN_ADDRESS>
npx hardhat verify --network base <ARENA_MARKETPLACE_ADDRESS> <DEPLOYER_ADDRESS> <ARENA_COIN_ADDRESS> <ARENA_FIGHTER_NFT_ADDRESS>
npx hardhat verify --network base <ARENA_LEADERBOARD_ADDRESS> <DEPLOYER_ADDRESS>

# Or use the verify script (set addresses in .env first):
node scripts/verify.js
```

### 6. Run backend server

```bash
node backend/server.js
```

### 7. Start frontend

```bash
npm run dev
# or for pnpm workspace:
pnpm --filter @workspace/arena-protocol run dev
```

---

## Contract Architecture

```
ArenaCoin (ERC20)
    ↕
ArenaFighterNFT (ERC721)
    ↕
ArenaRewardVault ←─── ArenaBattle ───→ ArenaLeaderboard
                            ↕
                      ArenaStaking
                            ↕
                    ArenaMarketplace
```

### ArenaCoin

| Function | Description |
|---|---|
| `mint(to, amount)` | Owner mints new tokens |
| `burn(amount)` | Burn caller's tokens |

### ArenaFighterNFT

| Function | Description |
|---|---|
| `mintFighter(player)` | Mint a new fighter with pseudo-random stats |
| `getFighter(tokenId)` | Get fighter attributes |

### ArenaBattle

| Function | Description |
|---|---|
| `fight(fighterId, mode)` | Enter a battle (10 ARENA fee, 18 ARENA reward on win) |

**Events:** `FightResult(player, win, fighterId, mode, reward)`

### ArenaStaking

| Function | Description |
|---|---|
| `stake(amount)` | Stake ARENA tokens |
| `unstake()` | Unstake all tokens + pending rewards |
| `claimRewards()` | Claim pending daily rewards |

### ArenaRewardVault

| Function | Description |
|---|---|
| `depositRewards(amount)` | Add rewards to pool |
| `withdrawRewards(to, amount)` | Owner withdraws (used by ArenaBattle) |

### ArenaMarketplace

| Function | Description |
|---|---|
| `listNFT(tokenId, price)` | List a fighter for sale |
| `buyNFT(tokenId)` | Buy a listed fighter |
| `cancelListing(tokenId)` | Cancel your listing |

### ArenaLeaderboard

| Function | Description |
|---|---|
| `recordFight(player, win, reward)` | Record a battle result (called by ArenaBattle) |
| `getTopPlayers(count)` | Get top N players by wins |

---

## Telegram Mini App

The frontend is built to run inside Telegram as a Mini App:

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Set the Mini App URL to your deployed frontend URL
3. The app auto-initializes `window.Telegram.WebApp.ready()` on mount

---

## Security

- All contracts use OpenZeppelin libraries
- NFT ownership validated before battles and listings
- Token transfers use `transferFrom` with proper allowance checks
- Stake amounts validated before staking operations
- Marketplace fee collected atomically during purchase

---

## Rarity Tiers

| Rarity | Chance | Base Stat Bonus |
|---|---|---|
| Common | 50% | +0 |
| Rare | 30% | +10 |
| Epic | 15% | +20 |
| Legendary | 5% | +30 |

---

## License

MIT
