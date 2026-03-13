/**
 * Checks wallet for ERC20 token balances on Base and swaps them to ETH
 * using Uniswap V3 SwapRouter02.
 */
const { ethers } = require("hardhat");

// ── Uniswap V3 on Base ──────────────────────────────────────────────────────
const SWAP_ROUTER   = "0x2626664c2603336E57B271c5C0b26F421741e481"; // SwapRouter02
const WETH_ADDRESS  = "0x4200000000000000000000000000000000000006"; // WETH on Base
const FEE_TIER_500  = 500;   // 0.05 %  (stablecoins)
const FEE_TIER_3000 = 3000;  // 0.3 %   (general)

// ── Common tokens on Base Mainnet ───────────────────────────────────────────
const TOKENS = [
  { symbol: "USDC",  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", fee: FEE_TIER_500  },
  { symbol: "USDT",  address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2", fee: FEE_TIER_500  },
  { symbol: "DAI",   address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", fee: FEE_TIER_500  },
  { symbol: "cbETH", address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22", fee: FEE_TIER_3000 },
  { symbol: "COMP",  address: "0x9e1028F5F1D5eDE59748FFceE5532509976840E0", fee: FEE_TIER_3000 },
  { symbol: "WELL",  address: "0xFF8adeC2221f9f4D8DfB43AA4b7C7b8b0d9BeC13", fee: FEE_TIER_3000 },
];

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address,uint256) returns (bool)",
  "function allowance(address,address) view returns (uint256)",
];

const WETH_ABI = [
  ...ERC20_ABI,
  "function withdraw(uint256) external",
];

const ROUTER_ABI = [
  `function exactInputSingle((
    address tokenIn,
    address tokenOut,
    uint24  fee,
    address recipient,
    uint256 amountIn,
    uint256 amountOutMinimum,
    uint160 sqrtPriceLimitX96
  )) external payable returns (uint256 amountOut)`,
  `function unwrapWETH9(uint256 amountMinimum, address recipient) external payable`,
];

const GAS_OPTS = { maxPriorityFeePerGas: ethers.parseUnits("0.001", "gwei") };

async function main() {
  const [signer] = await ethers.getSigners();
  const provider  = signer.provider;
  const ethBal    = await provider.getBalance(signer.address);

  console.log("Wallet:", signer.address);
  console.log("ETH balance:", ethers.formatEther(ethBal), "ETH\n");
  console.log("Scanning for token balances on Base Mainnet…\n");

  const swappable = [];

  for (const token of TOKENS) {
    try {
      const erc20    = new ethers.Contract(token.address, ERC20_ABI, provider);
      const [bal, dec, sym] = await Promise.all([
        erc20.balanceOf(signer.address),
        erc20.decimals().catch(() => 18n),
        erc20.symbol().catch(() => token.symbol),
      ]);
      if (bal > 0n) {
        const human = ethers.formatUnits(bal, dec);
        console.log(`  ✅ ${sym}: ${human}`);
        swappable.push({ ...token, balance: bal, decimals: dec, symbol: sym });
      } else {
        console.log(`  ⬜ ${token.symbol}: 0`);
      }
    } catch {
      console.log(`  ⚠️  ${token.symbol}: could not read balance`);
    }
  }

  if (swappable.length === 0) {
    console.log("\nNo swappable token balances found in wallet.");
    console.log("Please add ETH directly to:", signer.address);
    console.log("You need ~0.005 ETH on Base Mainnet to complete deployment.");
    return;
  }

  const router = new ethers.Contract(SWAP_ROUTER, ROUTER_ABI, signer);
  const weth   = new ethers.Contract(WETH_ADDRESS, WETH_ABI,  signer);

  let totalWethReceived = 0n;

  for (const token of swappable) {
    console.log(`\nSwapping ${token.symbol} → WETH…`);

    const erc20 = new ethers.Contract(token.address, ERC20_ABI, signer);

    // Approve router if needed
    const allowance = await erc20.allowance(signer.address, SWAP_ROUTER);
    if (allowance < token.balance) {
      console.log(`  Approving ${token.symbol}…`);
      const approveTx = await erc20.approve(SWAP_ROUTER, ethers.MaxUint256, GAS_OPTS);
      await approveTx.wait();
      console.log("  Approved ✅");
    }

    // 1 % slippage tolerance
    const amountOutMin = 0n; // Accept any amount (small balances may have high slippage)

    try {
      const swapTx = await router.exactInputSingle(
        {
          tokenIn:            token.address,
          tokenOut:           WETH_ADDRESS,
          fee:                token.fee,
          recipient:          signer.address,
          amountIn:           token.balance,
          amountOutMinimum:   amountOutMin,
          sqrtPriceLimitX96:  0n,
        },
        GAS_OPTS,
      );
      const receipt = await swapTx.wait();
      console.log(`  Swap tx: ${receipt.hash}`);

      // Read WETH balance after swap
      const wethBal = await weth.balanceOf(signer.address);
      console.log(`  WETH received so far: ${ethers.formatEther(wethBal)} WETH`);
      totalWethReceived = wethBal;
    } catch (err) {
      console.log(`  ⚠️  Swap failed for ${token.symbol}: ${err.reason ?? err.message}`);
    }
  }

  // Unwrap WETH → ETH
  if (totalWethReceived > 0n) {
    console.log(`\nUnwrapping ${ethers.formatEther(totalWethReceived)} WETH → ETH…`);
    const unwrapTx = await weth.withdraw(totalWethReceived, GAS_OPTS);
    await unwrapTx.wait();
    console.log("  Unwrapped ✅");
  }

  const finalEth = await provider.getBalance(signer.address);
  console.log("\n========================================");
  console.log("Final ETH balance:", ethers.formatEther(finalEth), "ETH");
  if (finalEth >= ethers.parseEther("0.003")) {
    console.log("✅ Sufficient ETH to deploy remaining contracts!");
  } else {
    console.log("⚠️  Still low — you may need to add more ETH manually.");
  }
  console.log("========================================");
}

main()
  .then(() => process.exit(0))
  .catch((err) => { console.error(err); process.exit(1); });
