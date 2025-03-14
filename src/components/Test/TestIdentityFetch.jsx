import React, { useState } from 'react';

const TestIdentityFetch = () => {
  const [fetchAddress, setFetchAddress] = useState('');
  const [fetchedIdentity, setFetchedIdentity] = useState(null);

  const handleFetchIdentity = () => {
    console.log('Fetch Identity called for address:', fetchAddress);
    // Simulate fetching identity data from blockchain
    const dummyIdentity = {
      name: 'Alice Tester',
      university: 'Test University',
      email: 'alice@test.com',
      reputation: 75,
    };
    setFetchedIdentity(dummyIdentity);
    console.log('Fetched Identity:', dummyIdentity);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">3️⃣ Fetch Identity Data</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Wallet Address</label>
          <input
            type="text"
            value={fetchAddress}
            onChange={(e) => setFetchAddress(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter wallet address to fetch identity"
          />
        </div>
        <button
          onClick={handleFetchIdentity}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Fetch Identity
        </button>
      </div>
      {fetchedIdentity && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Identity Details</h3>
          <p>
            <span className="font-medium">Name:</span> {fetchedIdentity.name}
          </p>
          <p>
            <span className="font-medium">University:</span> {fetchedIdentity.university}
          </p>
          <p>
            <span className="font-medium">Email:</span> {fetchedIdentity.email}
          </p>
          <p>
            <span className="font-medium">Reputation Score:</span> {fetchedIdentity.reputation}
          </p>
        </div>
      )}
    </div>
  );
};

export default TestIdentityFetch;