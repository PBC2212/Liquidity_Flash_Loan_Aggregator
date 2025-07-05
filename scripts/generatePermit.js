import { ethers } from "ethers";

const TOKEN_ADDRESS = "0xTokenAddress";  // e.g., USDC contract
const OWNER_PRIVATE_KEY = "YOUR_PRIVATE_KEY";
const SPENDER_ADDRESS = "0xYourContractAddress";  // Your deployed flash loan contract

const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");
const wallet = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);

const erc20Abi = [
  "function name() view returns (string)",
  "function nonces(address owner) view returns (uint256)"
];

async function main() {
  const token = new ethers.Contract(TOKEN_ADDRESS, erc20Abi, provider);
  const name = await token.name();
  const nonce = await token.nonces(wallet.address);
  const deadline = Math.floor(Date.now() / 1000) + 3600;  // 1 hour from now
  const value = ethers.utils.parseUnits("1000", 6);       // 1000 tokens, adjust decimals

  const domain = {
    name,
    version: "1",
    chainId: 1,  // Mainnet
    verifyingContract: TOKEN_ADDRESS,
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" }
    ],
  };

  const message = {
    owner: wallet.address,
    spender: SPENDER_ADDRESS,
    value: value.toString(),
    nonce: nonce.toNumber(),
    deadline,
  };

  const signature = await wallet._signTypedData(domain, types, message);
  const sig = ethers.utils.splitSignature(signature);

  console.log("v:", sig.v);
  console.log("r:", sig.r);
  console.log("s:", sig.s);
  console.log("deadline:", deadline);
  console.log("value:", value.toString());
}

main();
