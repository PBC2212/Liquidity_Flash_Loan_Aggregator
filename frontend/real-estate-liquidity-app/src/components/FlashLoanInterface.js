import React, { useState, useEffect } from 'react';
import { useWeb3Auth } from '../providers/Web3AuthProvider';
import { useFlashLoan } from '../hooks/useFlashLoan';

const FlashLoanInterface = () => {
  const { isLoggedIn, login, logout, address, userInfo, getBalance, isLoading } = useWeb3Auth();
  const { initiateFlashLoan, loading: flashLoanLoading, txHash, error, clearError, getEstimatedFee } = useFlashLoan();
  const [balance, setBalance] = useState('0');

  // Common token addresses on Sepolia
  const TOKENS = {
    WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    USDC: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'
  };

  const [formData, setFormData] = useState({
    provider: '0', // 0=Aave, 1=Balancer, 2=Uniswap
    loanAsset: TOKENS.WETH,
    loanAmount: '1000000000000000000', // 1 WETH in wei
    collateralTokens: [TOKENS.USDC],
    collateralAmounts: ['2000000000'], // 2000 USDC (6 decimals)
  });

  const [estimatedFee, setEstimatedFee] = useState('0');

  useEffect(() => {
    if (isLoggedIn) {
      updateBalance();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // Calculate estimated fee when form changes
    if (formData.loanAmount && formData.provider) {
      const fee = getEstimatedFee(parseInt(formData.provider), formData.loanAmount);
      setEstimatedFee(fee.toString());
    }
  }, [formData.provider, formData.loanAmount, getEstimatedFee]);

  const updateBalance = async () => {
    try {
      const bal = await getBalance();
      setBalance(bal);
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleFlashLoan = async () => {
    if (!formData.loanAmount || !formData.collateralAmounts[0]) {
      alert('Please fill in all amounts');
      return;
    }

    try {
      clearError();
      await initiateFlashLoan(
        parseInt(formData.provider),
        formData.loanAsset,
        formData.loanAmount,
        formData.collateralTokens,
        formData.collateralAmounts
      );
      alert('Flash loan successful! Check the transaction hash below.');
      updateBalance(); // Refresh balance after transaction
    } catch (error) {
      console.error('Flash loan error:', error);
      alert('Flash loan failed: ' + error.message);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const providerNames = ['Aave V3', 'Balancer V2', 'Uniswap V3'];

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🔄 Initializing Web3Auth...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        🏠 Real Estate Liquidity Aggregator
      </h1>
      
      {!isLoggedIn ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '10px' }}>
          <h3>🔐 Connect Your Wallet</h3>
          <p>Login with Web3Auth to access flash loan functionality</p>
          <button 
            onClick={handleLogin} 
            style={{ 
              padding: '12px 24px', 
              fontSize: '16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🚀 Login with Google/Email
          </button>
        </div>
      ) : (
        <div>
          {/* User Info Panel */}
          <div style={{ 
            background: '#e8f5e8', 
            padding: '15px', 
            marginBottom: '20px', 
            borderRadius: '8px',
            border: '1px solid #28a745'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>👤 Wallet Connected</h3>
            <p style={{ margin: '5px 0' }}><strong>Email:</strong> {userInfo?.email || 'N/A'}</p>
            <p style={{ margin: '5px 0' }}><strong>Address:</strong> {formatAddress(address)}</p>
            <p style={{ margin: '5px 0' }}><strong>Balance:</strong> {balance} TEST</p>
            <button 
              onClick={logout} 
              style={{ 
                padding: '5px 10px', 
                background: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Disconnect
            </button>
          </div>

          {/* Flash Loan Interface */}
          <div style={{ 
            background: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#495057' }}>⚡ Flash Loan Interface</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Provider:
              </label>
              <select 
                value={formData.provider} 
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
                style={{ 
                  padding: '8px', 
                  width: '200px', 
                  borderRadius: '4px', 
                  border: '1px solid #ced4da'
                }}
              >
                <option value="0">Aave V3 (0.09% fee)</option>
                <option value="1">Balancer V2 (0% fee)</option>
                <option value="2">Uniswap V3 (~0.3% fee)</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Loan Asset:
              </label>
              <select 
                value={formData.loanAsset}
                onChange={(e) => setFormData({...formData, loanAsset: e.target.value})}
                style={{ 
                  padding: '8px', 
                  width: '300px', 
                  borderRadius: '4px', 
                  border: '1px solid #ced4da'
                }}
              >
                <option value={TOKENS.WETH}>WETH (Wrapped Ether)</option>
                <option value={TOKENS.USDC}>USDC (USD Coin)</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Loan Amount (Wei):
              </label>
              <input 
                type="text" 
                value={formData.loanAmount}
                onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
                placeholder="1000000000000000000"
                style={{ 
                  padding: '8px', 
                  width: '300px', 
                  borderRadius: '4px', 
                  border: '1px solid #ced4da'
                }}
              />
              <small style={{ display: 'block', color: '#6c757d', marginTop: '5px' }}>
                Estimated fee: {estimatedFee} wei ({providerNames[parseInt(formData.provider)]})
              </small>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Collateral Amount (Wei/Smallest Unit):
              </label>
              <input 
                type="text" 
                value={formData.collateralAmounts[0]}
                onChange={(e) => setFormData({
                  ...formData, 
                  collateralAmounts: [e.target.value]
                })}
                placeholder="2000000000"
                style={{ 
                  padding: '8px', 
                  width: '300px', 
                  borderRadius: '4px', 
                  border: '1px solid #ced4da'
                }}
              />
              <small style={{ display: 'block', color: '#6c757d', marginTop: '5px' }}>
                Collateral Token: {formData.collateralTokens[0] === TOKENS.USDC ? 'USDC (6 decimals)' : 'WETH (18 decimals)'}
              </small>
            </div>

            {error && (
              <div style={{ 
                background: '#f8d7da', 
                color: '#721c24', 
                padding: '10px', 
                borderRadius: '4px',
                marginBottom: '15px',
                border: '1px solid #f5c6cb'
              }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            <button 
              onClick={handleFlashLoan} 
              disabled={flashLoanLoading}
              style={{ 
                padding: '12px 24px', 
                fontSize: '16px', 
                background: flashLoanLoading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: flashLoanLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {flashLoanLoading ? '⏳ Processing...' : '🚀 Execute Flash Loan'}
            </button>

            {txHash && (
              <div style={{ 
                marginTop: '20px', 
                background: '#d4edda', 
                padding: '15px', 
                borderRadius: '8px',
                border: '1px solid #c3e6cb'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>✅ Transaction Successful!</h4>
                <p style={{ margin: '5px 0' }}><strong>Hash:</strong></p>
                <a 
                  href={`https://testnet.explorer.sapphire.oasis.dev/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#007bff', textDecoration: 'none', wordBreak: 'break-all' }}
                >
                  {txHash}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashLoanInterface;