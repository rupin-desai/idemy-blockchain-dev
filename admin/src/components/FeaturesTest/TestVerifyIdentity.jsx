import React, { useState } from 'react';
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import { CheckCircle, XCircle, Loader2, Search } from "lucide-react";
import apiClient from "../../services/api.service";

const TestVerifyIdentity = ({ onSuccess, onError }) => {
  const [did, setDid] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!did || did.trim() === '') {
      onError && onError('Please enter a valid DID');
      return;
    }
    
    try {
      setLoading(true);
      setResult(null);
      
      // Call blockchain API to verify identity
      const response = await apiClient.get(`/blockchain/identity/${did}/verify`);
      
      setResult({
        verified: response.data.data.verified,
        message: response.data.data.message,
        status: response.data.data.status,
        details: response.data.data
      });
      
      if (response.data.data.verified) {
        onSuccess && onSuccess(did);
      }
    } catch (error) {
      console.error('Error verifying identity:', error);
      setResult({
        verified: false,
        message: error.response?.data?.message || error.message || 'Failed to verify identity',
        error: true
      });
      onError && onError(error.message || 'Failed to verify identity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Verify Blockchain Identity">
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter Decentralized Identifier (DID)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2"
              placeholder="did:ethr:0x..."
              value={did}
              onChange={(e) => setDid(e.target.value)}
              disabled={loading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter a DID to verify if it exists on the blockchain
          </p>
        </div>

        {result && (
          <div className={`p-4 rounded-md ${result.verified ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {result.verified ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${result.verified ? 'text-green-800' : 'text-red-800'}`}>
                  {result.verified ? 'Identity Verified' : 'Verification Failed'}
                </h3>
                <div className={`mt-2 text-sm ${result.verified ? 'text-green-700' : 'text-red-700'}`}>
                  <p>{result.message}</p>
                </div>
                
                {result.verified && result.details && (
                  <div className="mt-3 border-t border-green-200 pt-3">
                    <div className="text-xs text-gray-600 space-y-1">
                      {result.details.status && (
                        <p>Status: <span className="font-medium">{result.details.status}</span></p>
                      )}
                      {result.details.owner && (
                        <p>Owner: <span className="font-mono text-xs">{result.details.owner}</span></p>
                      )}
                      {result.details.createdAt && (
                        <p>Created: <span className="font-medium">{new Date(result.details.createdAt).toLocaleString()}</span></p>
                      )}
                      {result.details.transactionHash && (
                        <p>
                          Transaction: 
                          <a 
                            href={`https://sepolia.etherscan.io/tx/${result.details.transactionHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-1 font-mono text-xs text-blue-600 hover:underline"
                          >
                            {result.details.transactionHash.substring(0, 10)}...
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={loading || !did}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify on Blockchain'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TestVerifyIdentity;