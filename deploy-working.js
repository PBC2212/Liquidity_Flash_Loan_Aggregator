const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting LiquidityAggregator deployment (working version)...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    console.log("Balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

    // === STEP 1: Deploy PriceOracle ===
    console.log("\n📊 Deploying PriceOracle...");
    const PriceOracle = await ethers.getContractFactory("PriceOracle");
    const priceOracle = await PriceOracle.deploy();
    await priceOracle.deployed();
    console.log("✅ PriceOracle deployed:", priceOracle.address);

    // === STEP 2: Deploy LiquidityAggregator (V1 - the working one) ===
    console.log("\n⚡ Deploying LiquidityAggregator...");
    const LiquidityAggregator = await ethers.getContractFactory("LiquidityAggregator");
    const liquidityAggregator = await LiquidityAggregator.deploy(
        deployer.address,           // DAO address
        priceOracle.address         // Price oracle
    );
    await liquidityAggregator.deployed();
    console.log("✅ LiquidityAggregator deployed:", liquidityAggregator.address);

    // === STEP 3: Setup Initial Configuration ===
    console.log("\n⚙️ Setting up initial configuration...");
    
    // Sepolia token addresses
    const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
    const USDC = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
    const LINK = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

    // Add allowed collateral
    try {
        await liquidityAggregator.addAllowedCollateral(WETH, false);
        await liquidityAggregator.addAllowedCollateral(USDC, false);
        await liquidityAggregator.addAllowedCollateral(LINK, false);
        console.log("✅ Added WETH, USDC, LINK as ERC20 collateral");
    } catch (error) {
        console.log("⚠️ Could not add collateral:", error.message);
    }

    // Check current settings
    console.log("\n🔧 Checking contract settings...");
    try {
        const daoAddress = await liquidityAggregator.daoAddress();
        const priceOracleAddr = await liquidityAggregator.priceOracle();
        const minCollateralRatio = await liquidityAggregator.minimumCollateralRatio();
        const slippageTolerance = await liquidityAggregator.slippageTolerance();

        console.log("DAO Address:", daoAddress);
        console.log("Price Oracle:", priceOracleAddr);
        console.log("Min Collateral Ratio:", minCollateralRatio.toString(), "(105% = 10500)");
        console.log("Slippage Tolerance:", slippageTolerance.toString(), "(3% = 300)");
    } catch (error) {
        console.log("⚠️ Could not read contract settings:", error.message);
    }

    // === FINAL SUMMARY ===
    console.log("\n🎉 ===== DEPLOYMENT COMPLETE! =====");
    console.log("📋 Contract Addresses:");
    console.log("   PriceOracle:         ", priceOracle.address);
    console.log("   LiquidityAggregator: ", liquidityAggregator.address);
    console.log("\n🔧 Configuration:");
    console.log("   DAO:                 ", deployer.address);
    console.log("   Network:             Sepolia");
    console.log("   Flash Loan Providers: Aave, Balancer, Uniswap");
    console.log("\n✅ Ready for flash loans!");

    return {
        priceOracle: priceOracle.address,
        liquidityAggregator: liquidityAggregator.address
    };
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });