import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

// Web3Auth Configuration
const clientId = "BHT2385fJC4BKKbk1F6c5zSM_uirDNL6rryCs1Gy9gjtQEmUaAMIfH3ZTchPG3gFSJKn3wiBEUE28yb-vn3fCtU";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7", // Sepolia Testnet (11155111 in hex)
  rpcTarget: "https://sepolia.infura.io/v3/fb1d47dc75784bcca0d4672a3e1a5e22",
  displayName: "Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

// Private Key Provider
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

// Web3Auth instance
export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // Use SAPPHIRE_MAINNET for production
  chainConfig,
  privateKeyProvider,
  uiConfig: {
    appName: "DeFi Custody Platform",
    mode: "dark", // light, dark or auto
    logoLight: "https://web3auth.io/images/web3authlog.png",
    logoDark: "https://web3auth.io/images/web3authlogodark.png",
    defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
    loginGridCol: 3,
    primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
  },
});

// OpenLogin Adapter
const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: "optional",
  },
  adapterSettings: {
    uxMode: "popup", // "popup" | "redirect"
    whiteLabel: {
      appName: "DeFi Custody Platform",
      appUrl: "https://defi-custody-platform.com",
      logoLight: "https://web3auth.io/images/web3authlog.png",
      logoDark: "https://web3auth.io/images/web3authlogodark.png",
      defaultLanguage: "en",
      mode: "dark",
    },
    loginConfig: {
      google: {
        verifier: "defi-custody-google",
        typeOfLogin: "google",
        clientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      },
      github: {
        verifier: "defi-custody-github",
        typeOfLogin: "github",
        clientId: "YOUR_GITHUB_CLIENT_ID",
      },
      discord: {
        verifier: "defi-custody-discord",
        typeOfLogin: "discord",
        clientId: "YOUR_DISCORD_CLIENT_ID",
      },
    },
  },
});

web3auth.configureAdapter(openloginAdapter);

// Web3Auth Helper Functions
export const initWeb3Auth = async () => {
  try {
    await web3auth.initModal();
    return true;
  } catch (error) {
    console.error("Error initializing Web3Auth:", error);
    return false;
  }
};

export const loginWithWeb3Auth = async () => {
  try {
    const web3authProvider = await web3auth.connect();
    return web3authProvider;
  } catch (error) {
    console.error("Error connecting to Web3Auth:", error);
    throw error;
  }
};

export const logoutFromWeb3Auth = async () => {
  try {
    await web3auth.logout();
    return true;
  } catch (error) {
    console.error("Error logging out from Web3Auth:", error);
    return false;
  }
};

export const getUserInfo = async () => {
  try {
    const user = await web3auth.getUserInfo();
    return user;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

export const getPrivateKey = async () => {
  try {
    const privateKey = await web3auth.provider.request({
      method: "eth_private_key",
    });
    return privateKey;
  } catch (error) {
    console.error("Error getting private key:", error);
    return null;
  }
};

export const getAccounts = async () => {
  try {
    if (!web3auth.provider) {
      throw new Error("Web3Auth provider not initialized");
    }
    
    const accounts = await web3auth.provider.request({
      method: "eth_accounts",
    });
    return accounts;
  } catch (error) {
    console.error("Error getting accounts:", error);
    return [];
  }
};

export const getChainId = async () => {
  try {
    if (!web3auth.provider) {
      throw new Error("Web3Auth provider not initialized");
    }
    
    const chainId = await web3auth.provider.request({
      method: "eth_chainId",
    });
    return chainId;
  } catch (error) {
    console.error("Error getting chain ID:", error);
    return null;
  }
};

export const switchChain = async (chainId) => {
  try {
    if (!web3auth.provider) {
      throw new Error("Web3Auth provider not initialized");
    }
    
    await web3auth.provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
    return true;
  } catch (error) {
    console.error("Error switching chain:", error);
    return false;
  }
};

export const addTokenToWallet = async (tokenAddress, tokenSymbol, tokenDecimals, tokenImage) => {
  try {
    if (!web3auth.provider) {
      throw new Error("Web3Auth provider not initialized");
    }
    
    await web3auth.provider.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });
    return true;
  } catch (error) {
    console.error("Error adding token to wallet:", error);
    return false;
  }
};

// Check if Web3Auth is connected
export const isWeb3AuthConnected = () => {
  return web3auth.connected;
};

// Get Web3Auth status
export const getWeb3AuthStatus = () => {
  return {
    connected: web3auth.connected,
    provider: web3auth.provider,
    ready: web3auth.ready,
  };
};

// Emergency fallback configuration for development
export const DEVELOPMENT_CONFIG = {
  // IMPORTANT: Never use this private key in production!
  // This is only for development/testing purposes
  FALLBACK_PRIVATE_KEY: "5f3d3a37554f9388a9e74bd42781c8a41ecc995cef31a1a724dcb0b4d52a086d",
  RPC_URL: "https://sepolia.infura.io/v3/fb1d47dc75784bcca0d4672a3e1a5e22"
};

// Utility function to get provider for contract interactions
export const getProvider = async () => {
  try {
    if (web3auth.connected && web3auth.provider) {
      return web3auth.provider;
    }
    
    // Fallback for development - create a provider with the RPC URL
    const { ethers } = await import('ethers');
    return new ethers.JsonRpcProvider(chainConfig.rpcTarget);
  } catch (error) {
    console.error("Error getting provider:", error);
    return null;
  }
};

// Utility function to get signer for transactions
export const getSigner = async () => {
  try {
    if (web3auth.connected && web3auth.provider) {
      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider(web3auth.provider);
      return await provider.getSigner();
    }
    
    throw new Error("No Web3Auth connection available");
  } catch (error) {
    console.error("Error getting signer:", error);
    return null;
  }
};