import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  initWeb3Auth,
  loginWithWeb3Auth,
  logoutFromWeb3Auth,
  getUserInfo,
  getAccounts,
  isWeb3AuthConnected,
  getProvider,
  getSigner,
  web3auth
} from '../config/web3auth';
import {
  CONTRACT_ADDRESSES,
  CUSTODY_REGISTRY_ABI,
  LIQUIDITY_AGGREGATOR_ABI,
  PRICE_ORACLE_ABI,
  FLASH_LOAN_PROVIDERS
} from '../config/contracts';
import toast from 'react-hot-toast';

// Create Web3 Context
const Web3Context = createContext();

// Custom hook to use Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Web3 Provider Component
export const Web3Provider = ({ children }) => {
  // State management
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Contract instances
  const [contracts, setContracts] = useState({
    custodyRegistry: null,
    liquidityAggregator: null,
    priceOracle: null
  });

  // Initialize Web3Auth on component mount
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const initialized = await initWeb3Auth();
        setIsInitialized(initialized);
        
        if (initialized && isWeb3AuthConnected()) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Error initializing Web3Auth:', error);
        toast.error('Failed to initialize wallet connection');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setLoading(true);
      
      if (!isInitialized) {
        throw new Error('Web3Auth not initialized');
      }

      // Login with Web3Auth
      const web3authProvider = await loginWithWeb3Auth();
      
      if (web3authProvider) {
        // Set up ethers provider and signer
        const ethersProvider = new ethers.BrowserProvider(web3authProvider);
        const ethersSigner = await ethersProvider.getSigner();
        
        setProvider(ethersProvider);
        setSigner(ethersSigner);
        setIsConnected(true);
        
        // Get user info and accounts
        const [user, accountsList] = await Promise.all([
          getUserInfo(),
          getAccounts()
        ]);
        
        setUserInfo(user);
        setAccounts(accountsList);
        
        // Initialize contracts
        await initializeContracts(ethersSigner);
        
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      setLoading(true);
      
      await logoutFromWeb3Auth();
      
      // Reset state
      setIsConnected(false);
      setUserInfo(null);
      setAccounts([]);
      setProvider(null);
      setSigner(null);
      setContracts({
        custodyRegistry: null,
        liquidityAggregator: null,
        priceOracle: null
      });
      
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
    } finally {
      setLoading(false);
    }
  };

  // Initialize contract instances
  const initializeContracts = async (signerInstance) => {
    try {
      const custodyRegistry = new ethers.Contract(
        CONTRACT_ADDRESSES.CUSTODY_REGISTRY,
        CUSTODY_REGISTRY_ABI,
        signerInstance
      );

      const liquidityAggregator = new ethers.Contract(
        CONTRACT_ADDRESSES.LIQUIDITY_AGGREGATOR,
        LIQUIDITY_AGGREGATOR_ABI,
        signerInstance
      );

      const priceOracle = new ethers.Contract(
        CONTRACT_ADDRESSES.PRICE_ORACLE,
        PRICE_ORACLE_ABI,
        signerInstance
      );

      setContracts({
        custodyRegistry,
        liquidityAggregator,
        priceOracle
      });
    } catch (error) {
      console.error('Error initializing contracts:', error);
      toast.error('Failed to initialize smart contracts');
    }
  };

  // Contract interaction functions
  const contractFunctions = {
    // Custody Registry Functions
    registerAsset: async (tokenAddress, description, chainId, custodyAddress, defiProtocol, custodyType, offchainDocs) => {
      try {
        if (!contracts.custodyRegistry) throw new Error('Custody Registry contract not initialized');
        
        const tx = await contracts.custodyRegistry.registerAsset(
          tokenAddress,
          description,
          chainId,
          custodyAddress,
          defiProtocol,
          custodyType,
          offchainDocs
        );
        
        toast.success('Transaction submitted. Waiting for confirmation...');
        const receipt = await tx.wait();
        toast.success('Asset registered successfully!');
        return receipt;
      } catch (error) {
        console.error('Error registering asset:', error);
        toast.error('Failed to register asset');
        throw error;
      }
    },

    updateCompliance: async (tokenAddress, kyc, aml, inspection, title, custody) => {
      try {
        if (!contracts.custodyRegistry) throw new Error('Custody Registry contract not initialized');
        
        const tx = await contracts.custodyRegistry.updateCompliance(
          tokenAddress,
          kyc,
          aml,
          inspection,
          title,
          custody
        );
        
        toast.success('Transaction submitted. Waiting for confirmation...');
        const receipt = await tx.wait();
        toast.success('Compliance updated successfully!');
        return receipt;
      } catch (error) {
        console.error('Error updating compliance:', error);
        toast.error('Failed to update compliance');
        throw error;
      }
    },

    getAssetInfo: async (tokenAddress) => {
      try {
        if (!contracts.custodyRegistry) throw new Error('Custody Registry contract not initialized');
        
        const assetInfo = await contracts.custodyRegistry.getAssetInfo(tokenAddress);
        return assetInfo;
      } catch (error) {
        console.error('Error getting asset info:', error);
        throw error;
      }
    },

    isAssetCompliant: async (tokenAddress) => {
      try {
        if (!contracts.custodyRegistry) throw new Error('Custody Registry contract not initialized');
        
        const isCompliant = await contracts.custodyRegistry.isAssetCompliant(tokenAddress);
        return isCompliant;
      } catch (error) {
        console.error('Error checking asset compliance:', error);
        throw error;
      }
    },

    // Liquidity Aggregator Functions
    initiateFlashLoan: async (provider, loanAsset, loanAmount, collateralTokens, collateralAmounts) => {
      try {
        if (!contracts.liquidityAggregator) throw new Error('Liquidity Aggregator contract not initialized');
        
        const tx = await contracts.liquidityAggregator.initiateFlashLoan(
          provider,
          loanAsset,
          loanAmount,
          collateralTokens,
          collateralAmounts
        );
        
        toast.success('Flash loan initiated. Waiting for confirmation...');
        const receipt = await tx.wait();
        toast.success('Flash loan executed successfully!');
        return receipt;
      } catch (error) {
        console.error('Error initiating flash loan:', error);
        toast.error('Failed to initiate flash loan');
        throw error;
      }
    },

    addAllowedCollateral: async (tokenAddress, isERC721) => {
      try {
        if (!contracts.liquidityAggregator) throw new Error('Liquidity Aggregator contract not initialized');
        
        const tx = await contracts.liquidityAggregator.addAllowedCollateral(tokenAddress, isERC721);
        
        toast.success('Transaction submitted. Waiting for confirmation...');
        const receipt = await tx.wait();
        toast.success('Collateral token added successfully!');
        return receipt;
      } catch (error) {
        console.error('Error adding collateral:', error);
        toast.error('Failed to add collateral token');
        throw error;
      }
    },

    getTokenPrice: async (tokenAddress) => {
      try {
        if (!contracts.liquidityAggregator) throw new Error('Liquidity Aggregator contract not initialized');
        
        const [price, decimals] = await contracts.liquidityAggregator.getChainlinkPrice(tokenAddress);
        return { price, decimals };
      } catch (error) {
        console.error('Error getting token price:', error);
        throw error;
      }
    },

    // Price Oracle Functions
    setTokenPrice: async (tokenAddress, price, decimals) => {
      try {
        if (!contracts.priceOracle) throw new Error('Price Oracle contract not initialized');
        
        const tx = await contracts.priceOracle.setTokenPrice(tokenAddress, price, decimals);
        
        toast.success('Transaction submitted. Waiting for confirmation...');
        const receipt = await tx.wait();
        toast.success('Token price updated successfully!');
        return receipt;
      } catch (error) {
        console.error('Error setting token price:', error);
        toast.error('Failed to update token price');
        throw error;
      }
    },

    // Utility Functions
    getBalance: async (tokenAddress, userAddress) => {
      try {
        if (!provider) throw new Error('Provider not available');
        
        if (tokenAddress === ethers.ZeroAddress) {
          // Get ETH balance
          const balance = await provider.getBalance(userAddress);
          return ethers.formatEther(balance);
        } else {
          // Get ERC20 token balance
          const tokenContract = new ethers.Contract(
            tokenAddress,
            ['function balanceOf(address) view returns (uint256)'],
            provider
          );
          const balance = await tokenContract.balanceOf(userAddress);
          return balance;
        }
      } catch (error) {
        console.error('Error getting balance:', error);
        throw error;
      }
    }
  };

  // Context value
  const contextValue = {
    // State
    isConnected,
    userInfo,
    accounts,
    provider,
    signer,
    loading,
    isInitialized,
    contracts,
    
    // Functions
    connectWallet,
    disconnectWallet,
    
    // Contract functions
    ...contractFunctions,
    
    // Constants
    FLASH_LOAN_PROVIDERS,
    CONTRACT_ADDRESSES
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;