import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);
      // Simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsConnected(true);
      setUserInfo({
        name: 'Demo User',
        email: 'demo@example.com',
        typeOfLogin: 'Demo Mode'
      });
      setAccounts(['0x1234567890123456789012345678901234567890']);
      
      toast.success('Connected in Demo Mode!');
    } catch (error) {
      console.error('Connection failed:', error);
      toast.error('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    setIsConnected(false);
    setUserInfo(null);
    setAccounts([]);
    toast.success('Disconnected');
  };

  // Mock contract functions
  const contractFunctions = {
    registerAsset: async (...args) => {
      toast.success('Asset registered (Demo)');
      return { hash: '0xdemo...' };
    },
    updateCompliance: async (...args) => {
      toast.success('Compliance updated (Demo)');
      return { hash: '0xdemo...' };
    },
    getAssetInfo: async (address) => {
      return {
        assetDescription: 'Demo Asset',
        custodyType: 'Demo Custody',
        compliance: {
          kycCompleted: true,
          amlCompleted: true,
          inspectionPassed: false,
          titleVerified: true,
          custodyConfirmed: false
        }
      };
    },
    isAssetCompliant: async (address) => false,
    initiateFlashLoan: async (...args) => {
      toast.success('Flash loan initiated (Demo)');
      return { hash: '0xdemo...' };
    },
    getTokenPrice: async (address) => {
      return { price: '2000000000', decimals: 8 };
    },
    getBalance: async (address, user) => {
      return '1000000000000000000'; // 1 ETH
    }
  };

  const contextValue = {
    isConnected,
    userInfo,
    accounts,
    loading,
    connectWallet,
    disconnectWallet,
    ...contractFunctions,
    CONTRACT_ADDRESSES: {
      WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
      USDC: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
      LINK: '0x779877A7B0D9E8603169DdbD7836e478b4624789'
    },
    FLASH_LOAN_PROVIDERS: {
      AAVE: 0,
      BALANCER: 1,
      UNISWAP: 2
    }
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;