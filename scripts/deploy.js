// Updated deploy.js with gas optimization
const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting RWA LiquidityAggregator deployment...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying from:", deployer.address);
    
    // Check balance first
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Current balance:", ethers.formatEther(balance), "ETH");
    
    // Get current gas price
    const feeData = await deployer.provider.getFeeData();
    console.log("Gas Price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
    
    // Gas optimization options
    const gasOptions = {
        gasPrice: feeData.gasPrice * BigInt(90) / BigInt(100), // 10% lower gas price
        // Alternative: use maxFeePerGas for EIP-1559
        // maxFeePerGas: feeData.maxFeePerGas * BigInt(90) / BigInt(100),
        // maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * BigInt(90) / BigInt(100)
    };
    
    try {
        // Deploy PriceOracle with gas optimization
        console.log("📊 Deploying PriceOracle with optimized gas...");
        const PriceOracle = await ethers.getContractFactory("PriceOracle");
        
        // Estimate gas first
        const deploymentData = PriceOracle.interface.encodeDeploy([]);
        const gasEstimate = await deployer.estimateGas({
            data: deploymentData
        });
        
        console.log("Estimated gas:", gasEstimate.toString());
        console.log("Estimated cost:", ethers.formatEther(gasEstimate * gasOptions.gasPrice), "ETH");
        
        const priceOracle = await PriceOracle.deploy(gasOptions);
        await priceOracle.waitForDeployment();
        console.log("✅ PriceOracle deployed to:", await priceOracle.getAddress());
        
        // Deploy CustodyRegistry
        console.log("🏛️ Deploying CustodyRegistry...");
        const CustodyRegistry = await ethers.getContractFactory("CustodyRegistry");
        const custodyRegistry = await CustodyRegistry.deploy(gasOptions);
        await custodyRegistry.waitForDeployment();
        console.log("✅ CustodyRegistry deployed to:", await custodyRegistry.getAddress());
        
        // Deploy LiquidityAggregatorV2
        console.log("💫 Deploying LiquidityAggregatorV2...");
        const LiquidityAggregator = await ethers.getContractFactory("LiquidityAggregatorV2");
        
        // Sepolia addresses (updated)
        const aavePoolAddress = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
        const balancerVaultAddress = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
        const uniswapFactoryAddress = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c";
        
        const liquidityAggregator = await LiquidityAggregator.deploy(
            aavePoolAddress,
            balancerVaultAddress,
            uniswapFactoryAddress,
            await priceOracle.getAddress(),
            await custodyRegistry.getAddress(),
            gasOptions
        );
        await liquidityAggregator.waitForDeployment();
        console.log("✅ LiquidityAggregatorV2 deployed to:", await liquidityAggregator.getAddress());
        
        // Setup tokens with gas optimization
        console.log("🔧 Setting up token prices...");
        
        const tokens = [
            { symbol: "WETH", address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", price: "2000000000000000000000" },
            { symbol: "USDC", address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", price: "1000000000000000000" },
            { symbol: "LINK", address: "0x779877A7B0D9E8603169DdbD7836e478b4624789", price: "15000000000000000000" }
        ];
        
        for (const token of tokens) {
            const tx = await priceOracle.setPrice(token.address, token.price, gasOptions);
            await tx.wait();
            console.log(`✅ Set ${token.symbol} price`);
        }
        
        // Final balance check
        const finalBalance = await deployer.provider.getBalance(deployer.address);
        console.log("Final balance:", ethers.formatEther(finalBalance), "ETH");
        console.log("Gas used:", ethers.formatEther(balance - finalBalance), "ETH");
        
        console.log("\n🎉 Deployment Complete!");
        console.log("=====================================");
        console.log("📊 PriceOracle:", await priceOracle.getAddress());
        console.log("🏛️ CustodyRegistry:", await custodyRegistry.getAddress());
        console.log("💫 LiquidityAggregatorV2:", await liquidityAggregator.getAddress());
        console.log("=====================================");
        
    } catch (error) {
        console.log("❌ Deployment failed:", error.message);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Fatal error:", error);
        process.exit(1);
    });