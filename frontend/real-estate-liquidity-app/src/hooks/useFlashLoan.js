import { useState } from 'react';
import { useWeb3Auth } from '../providers/Web3AuthProvider';
import { CONTRACTS } from '../config/web3auth.config';

// Simple ABI for the flash loan function - we'll update this after V2 deployment
const FLASH_LOAN_ABI = [
  {
    "inputs": [
      {"internalType": "uint8", "name": "provider", "type": "uint8"},
      {"internalType": "address", "name": "loanAsset", "type": "address"},
      {"internalType": "uint256", "name": "loanAmount", "type": "uint256"},
      {"internalType": "address[]", "name": "collateralTokens", "type": "address[]"},
      {"internalType": "uint256[]", "name": "collateralAmounts", "type": "uint256[]"}
    ],
    "name": "initiateFlashLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const useFlashLoan = () => {
  const { web3, address, isLoggedIn } = useWeb3Auth();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const initiateFlashLoan = async (provider, loanAsset, loanAmount, collateralTokens, collateralAmounts) => {
    if (!isLoggedIn || !web3) {
      throw new Error('Wallet not connected');
    }

    if (!CONTRACTS.LIQUIDITY_AGGREGATOR_V2) {
      throw new Error('V2 contract not deployed yet. Please deploy V2 first.');
    }
    
    setLoading(true);
    setError('');
    setTxHash('');
    
    try {
      const contract = new web3.eth.Contract(
        FLASH_LOAN_ABI,
        CONTRACTS.LIQUIDITY_AGGREGATOR_V2
      );

      // Estimate gas
      const gasEstimate = await contract.methods
        .initiateFlashLoan(provider, loanAsset, loanAmount, collateralTokens, collateralAmounts)
        .estimateGas({ from: address });

      console.log('Gas estimate:', gasEstimate);

      // Send transaction
      const tx = await contract.methods
        .initiateFlashLoan(provider, loanAsset, loanAmount, collateralTokens, collateralAmounts)
        .send({
          from: address,
          gas: Math.floor(gasEstimate * 1.2), // Add 20% buffer
        });

      setTxHash(tx.transactionHash);
      console.log('Flash loan successful:', tx.transactionHash);
      return tx;
    } catch (error) {
      console.error('Flash loan failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getEstimatedFee = (provider, amount) => {
    const fees = {
      0: 0.09, // Aave: 0.09%
      1: 0,    // Balancer: 0%
      2: 0.3   // Uniswap: ~0.3%
    };
    
    const feePercent = fees[provider] || 0;
    return (BigInt(amount) * BigInt(Math.floor(feePercent * 100))) / BigInt(10000);
  };

  const clearError = () => setError('');

  return { 
    initiateFlashLoan, 
    loading, 
    txHash, 
    error,
    clearError,
    getEstimatedFee
  };
};