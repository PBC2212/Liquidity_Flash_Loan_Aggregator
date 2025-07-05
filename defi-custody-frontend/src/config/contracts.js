// Contract ABIs and Addresses Configuration

// Contract Addresses (Sepolia Testnet - update these with your deployed addresses)
export const CONTRACT_ADDRESSES = {
  CUSTODY_REGISTRY: "0x0000000000000000000000000000000000000000", // Replace with your deployed address
  LIQUIDITY_AGGREGATOR: "0x0000000000000000000000000000000000000000", // Replace with your deployed address
  PRICE_ORACLE: "0x0000000000000000000000000000000000000000", // Replace with your deployed address
  
  // Protocol Addresses (Sepolia)
  AAVE_POOL_ADDRESSES_PROVIDER: "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A",
  BALANCER_VAULT: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
  UNISWAP_V3_FACTORY: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  UNISWAP_SWAP_ROUTER: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  
  // Token Addresses (Sepolia)
  WETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
  USDC: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
  LINK: "0x779877A7B0D9E8603169DdbD7836e478b4624789"
};

// Network Configuration
export const NETWORK_CONFIG = {
  chainId: 11155111, // Sepolia
  chainName: "Sepolia",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: ["https://sepolia.infura.io/v3/fb1d47dc75784bcca0d4672a3e1a5e22"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"]
};

// Flash Loan Provider Enum
export const FLASH_LOAN_PROVIDERS = {
  AAVE: 0,
  BALANCER: 1,
  UNISWAP: 2
};

// Token Information
export const TOKEN_INFO = {
  [CONTRACT_ADDRESSES.WETH]: {
    name: "Wrapped Ethereum",
    symbol: "WETH",
    decimals: 18,
    logo: "/tokens/weth.png"
  },
  [CONTRACT_ADDRESSES.USDC]: {
    name: "USD Coin",
    symbol: "USDC", 
    decimals: 6,
    logo: "/tokens/usdc.png"
  },
  [CONTRACT_ADDRESSES.LINK]: {
    name: "Chainlink",
    symbol: "LINK",
    decimals: 18,
    logo: "/tokens/link.png"
  }
};

// Simplified ABIs (only essential functions to avoid bloat)
export const CUSTODY_REGISTRY_ABI = [
  "function registerAsset(address,string,uint256,address,address,string,string)",
  "function updateCompliance(address,bool,bool,bool,bool,bool)",
  "function getAssetInfo(address) view returns (tuple)",
  "function isAssetCompliant(address) view returns (bool)",
  "function assetInfo(address) view returns (tuple)"
];

export const LIQUIDITY_AGGREGATOR_ABI = [
  "function initiateFlashLoan(uint8,address,uint256,address[],uint256[])",
  "function addAllowedCollateral(address,bool)",
  "function getChainlinkPrice(address) view returns (uint256,uint8)",
  "function allowedERC20Collateral(address) view returns (bool)",
  "function minimumCollateralRatio() view returns (uint256)",
  "function slippageTolerance() view returns (uint256)"
];

export const PRICE_ORACLE_ABI = [
  "function getLatestPrice(address) view returns (uint256,uint8)",
  "function setTokenPrice(address,uint256,uint8)",
  "function tokenPrices(address) view returns (uint256)"
];