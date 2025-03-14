import React, { useState } from 'react';

const TestSmartContract = () => {
  const [identityForm, setIdentityForm] = useState({
    name: '',
    university: '',
    email: '',
  });
  const [transactionStatus, setTransactionStatus] = useState('');

  const handleCreateIdentity = (e) => {
    e.preventDefault();
    console.log('Create Identity called with:', identityForm);
    setTransactionStatus('Pending');
    
    // Simulate smart contract interaction delay
    setTimeout(() => {
      setTransactionStatus('Success');
      console.log('Transaction Successful:', identityForm);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">2️⃣ Smart Contract Interaction</h2>
      <form onSubmit={handleCreateIdentity} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={identityForm.name}
            onChange={(e) => setIdentityForm({ ...identityForm, name: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Name"
          />
        </div>
        <div>
          <label className="block text-gray-700">University</label>
          <input
            type="text"
            name="university"
            value={identityForm.university}
            onChange={(e) => setIdentityForm({ ...identityForm, university: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter University"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={identityForm.email}
            onChange={(e) => setIdentityForm({ ...identityForm, email: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Email"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Create Identity
        </button>
      </form>
      {transactionStatus && (
        <p className="mt-4 text-gray-800">
          Transaction Status: <span className="font-semibold">{transactionStatus}</span>
        </p>
      )}
    </div>
  );
};

export default TestSmartContract;