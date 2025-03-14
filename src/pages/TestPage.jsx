import React from 'react';
import TestWallet from '../components/Test/TestWallet';
import TestSmartContract from '../components/Test/TestSmartContract';
import TestIdentityFetch from '../components/Test/TestIdentityFetch';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-8">Idemy Test Page</h1>
      <TestWallet />
      <TestSmartContract />
      <TestIdentityFetch />
    </div>
  );
};

export default TestPage;