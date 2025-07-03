const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting Simple LiquidityAggregator deployment...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    console.log("Balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

    // === STEP 1: Deploy PriceOracle ===
    console.log("\n📊 Deploying PriceOracle...");
    const PriceOracle = await ethers.getContractFactory("PriceOracle");
    const priceOracle = await PriceOracle.deploy();
    await priceOracle.deployed();
    console.log("✅ PriceOracle deployed:", priceOracle.address);

    // === STEP 2: Deploy LiquidityAggregatorV2 (without CustodyRegistry) ===
    console.log("\n⚡ Deploying LiquidityAggregatorV2...");
    const LiquidityAggregatorV2 = await ethers.getContractFactory("LiquidityAggregatorV2");
    
    // Try with 2 parameters first (your current contract might not need CustodyRegistry)
    try {
        const liquidityAggregator = await LiquidityAggregatorV2.deploy(
            deployer.address,           // DAO address
            priceOracle.address         // Price oracle
        );
        await liquidityAggregator.deployed();
        console.log("✅ LiquidityAggregatorV2 deployed:", liquidityAggregator.address);

        // === STEP 3: Setup Initial Configuration ===
        console.log("\n⚙️ Setting up initial configuration...");
        
        // Sepolia token addresses
        const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
        const USDC = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
        const LINK = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

        // Add allowed collateral (check if function exists)
        try {
            await liquidityAggregator.addAllowedCollateral(WETH, false);
            await liquidityAggregator.addAllowedCollateral(USDC, false);
            await liquidityAggregator.addAllowedCollateral(LINK, false);
            console.log("✅ Added WETH, USDC, LINK as collateral (with isERC721=false)");
        } catch (error) {
            // Try without the boolean parameter
            try {
                await liquidityAggregator.addAllowedCollateral(WETH);
                await liquidityAggregator.addAllowedCollateral(USDC);
                await liquidityAggregator.addAllowedCollateral(LINK);
                console.log("✅ Added WETH, USDC, LINK as collateral");
            } catch (error2) {
                console.log("⚠️ Could not add collateral automatically:", error2.message);
            }
        }

        // === FINAL SUMMARY ===
        console.log("\n🎉 ===== DEPLOYMENT COMPLETE! =====");
        console.log("📋 Contract Addresses:");
        console.log("   PriceOracle:           ", priceOracle.address);
        console.log("   LiquidityAggregatorV2: ", liquidityAggregator.address);
        console.log("\n🔧 Configuration:");
        console.log("   DAO:                   ", deployer.address);
        console.log("   Network:               Sepolia");
        console.log("\n✅ Ready for flash loans!");

        return {
            priceOracle: priceOracle.address,
            liquidityAggregator: liquidityAggregator.address
        };

    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        console.log("\n💡 This might be because your LiquidityAggregatorV2 has compilation errors.");
        console.log("Let's check what constructor parameters it expects...");
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });