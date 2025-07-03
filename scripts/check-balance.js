const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const balance = await deployer.provider.getBalance(deployer.address);
  
  console.log("👤 Address:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("✅ Enough for deployment:", balance > hre.ethers.parseEther("0.1") ? "Yes" : "No");
}

main().catch(console.error);