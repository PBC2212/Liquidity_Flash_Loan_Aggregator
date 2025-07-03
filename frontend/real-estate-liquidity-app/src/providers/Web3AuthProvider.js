import React, { createContext, useContext, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import Web3 from 'web3';
import { WEB3AUTH_CONFIG } from '../config/web3auth.config';

const Web3AuthContext = createContext();

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3Auth must be used within Web3AuthProvider');
  }
  return context;
};

export const Web3AuthProvider = ({ children }) => {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig: WEB3AUTH_CONFIG.chainConfig },
        });

        const web3authInstance = new Web3Auth({
          clientId: WEB3AUTH_CONFIG.clientId,
          web3AuthNetwork: WEB3AUTH_CONFIG.network,
          chainConfig: WEB3AUTH_CONFIG.chainConfig,
          privateKeyProvider,
          uiConfig: {
            appName: "Real Estate Liquidity Aggregator",
            theme: "dark",
            modalZIndex: "99999",
          },
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId: WEB3AUTH_CONFIG.clientId,
            network: WEB3AUTH_CONFIG.network,
            uxMode: "popup",
          },
          privateKeyProvider,
        });

        web3authInstance.configureAdapter(openloginAdapter);
        await web3authInstance.initModal();
        setWeb3auth(web3authInstance);

        if (web3authInstance.connected) {
          await handleLoginSuccess(web3authInstance);
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const handleLoginSuccess = async (web3authInstance) => {
    const web3authProvider = web3authInstance.provider;
    setProvider(web3authProvider);

    const web3Instance = new Web3(web3authProvider);
    setWeb3(web3Instance);

    const user = await web3authInstance.getUserInfo();
    setUserInfo(user);

    const accounts = await web3Instance.eth.getAccounts();
    setAddress(accounts[0]);
    setIsLoggedIn(true);
  };

  const login = async () => {
    if (!web3auth) return;
    try {
      setIsLoading(true);
      await web3auth.connect();
      await handleLoginSuccess(web3auth);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!web3auth) return;
    try {
      await web3auth.logout();
      setProvider(null);
      setWeb3(null);
      setUserInfo(null);
      setAddress('');
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getBalance = async () => {
    if (!web3 || !address) return '0';
    try {
      const balance = await web3.eth.getBalance(address);
      return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error("Error getting balance:", error);
      return '0';
    }
  };

  const getIdToken = async () => {
    if (!web3auth) throw new Error('Web3Auth not initialized');
    try {
      const idToken = await web3auth.authenticateUser();
      return idToken.idToken;
    } catch (error) {
      console.error("Error getting ID token:", error);
      throw error;
    }
  };

  const value = {
    isLoading,
    isLoggedIn,
    userInfo,
    address,
    web3,
    provider,
    login,
    logout,
    getBalance,
    getIdToken,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
};