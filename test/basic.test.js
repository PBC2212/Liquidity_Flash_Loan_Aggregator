const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiquidityAggregator", function () {
  let priceOracle;
  let liquidityAggregator;
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();
    
    // Deploy PriceOracle
    const PriceOracle = await ethers.getContractFactory("PriceOracle");
    priceOracle = await PriceOracle.deploy(owner.address);
    await priceOracle.waitForDeployment();
    
    // Deploy LiquidityAggregator
    const LiquidityAggregator = await ethers.getContractFactory("LiquidityAggregator");
    liquidityAggregator = await LiquidityAggregator.deploy(
      owner.address,
      await priceOracle.getAddress()
    );
    await liquidityAggregator.waitForDeployment();
  });

  it("Should deploy successfully", async function () {
    expect(await liquidityAggregator.daoAddress()).to.equal(owner.address);
    expect(await liquidityAggregator.minimumCollateralRatio()).to.equal(10500);
  });

  it("Should set slippage tolerance", async function () {
    await liquidityAggregator.setSlippageTolerance(500); // 5%
    expect(await liquidityAggregator.slippageTolerance()).to.equal(500);
  });

  it("Should add allowed collateral", async function () {
    const tokenAddress = "0x1234567890123456789012345678901234567890";
    
    await liquidityAggregator.addAllowedCollateral(tokenAddress, false);
    expect(await liquidityAggregator.allowedERC20Collateral(tokenAddress)).to.be.true;
  });

  it("Should update minimum collateral ratio", async function () {
    await liquidityAggregator.setMinimumCollateralRatio(11000); // 110%
    expect(await liquidityAggregator.minimumCollateralRatio()).to.equal(11000);
  });
});