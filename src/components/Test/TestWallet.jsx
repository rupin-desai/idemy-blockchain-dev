import React, { useState } from 'react';

const TestWallet = () => {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = () => {
    console.log('connectWallet() called');
    // Dummy wallet address
    const dummyAddress = '0xABC123...DEF456';
    setWalletAddress(dummyAddress);
    console.log('Wallet Connected:', dummyAddress);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">1️⃣ Wallet Connection</h2>
      <button
        onClick={connectWallet}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
      >
        Connect Wallet
      </button>
      {walletAddress && (
        <p className="mt-4 text-gray-800">
          Connected Wallet: <span className="font-mono">{walletAddress}</span>
        </p>
      )}
    </div>
  );
};

export default TestWallet;