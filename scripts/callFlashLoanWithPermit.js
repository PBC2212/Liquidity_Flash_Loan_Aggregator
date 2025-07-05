import { ethers } from "ethers";

const RPC_URL = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID";
const PRIVATE_KEY = "YOUR_PRIVATE_KEY";
const CONTRACT_ADDRESS = "0xYourContractAddress";

const FlashLoanProvider = { AAVE: 0, BALANCER: 1, UNISWAP: 2 };

const abi = [
  "function initiateFlashLoanWithPermit(uint8 provider,address loanAsset,uint256 loanAmount,address[] collateralTokens,uint256[] collateralAmounts,uint256 permitDeadline,uint8 v,bytes32 r,bytes32 s) external"
];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

  const providerEnum = FlashLoanProvider.AAVE;
  const loanAsset = "0x6B175474E89094C44Da98b954EedeAC495271d0F";  // DAI
  const loanAmount = ethers.utils.parseUnits("1000", 18);

  const collateralTokens = ["0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"];  // USDC
  const collateralAmounts = [ethers.utils.parseUnits("1200", 6)];

  // Paste the values from Step 5 here:
  const permitDeadline = YOUR_DEADLINE_FROM_STEP5;
  const v = YOUR_V_FROM_STEP5;
  const r = "YOUR_R_FROM_STEP5";
  const s = "YOUR_S_FROM_STEP5";

  try {
    const tx = await contract.initiateFlashLoanWithPermit(
      providerEnum,
      loanAsset,
      loanAmount,
      collateralTokens,
      collateralAmounts,
      permitDeadline,
      v,
      r,
      s,
      { gasLimit: 5000000 }
    );
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
  } catch (error) {
    console.error("Flash loan failed:", error);
  }
}

main();
