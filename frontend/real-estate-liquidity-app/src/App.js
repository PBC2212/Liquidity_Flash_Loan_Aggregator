import React from 'react';
import { Web3AuthProvider } from './providers/Web3AuthProvider';
import FlashLoanInterface from './components/FlashLoanInterface';
import './App.css';

function App() {
  return (
    <Web3AuthProvider>
      <div className="App">
        <FlashLoanInterface />
      </div>
    </Web3AuthProvider>
  );
}

export default App;