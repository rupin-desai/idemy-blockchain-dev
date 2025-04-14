import React from "react";
import useBlockchainStatus from "../../hooks/useBlockchainStatus";

const TestBlockchainStatus = () => {
  const { loading, error, networkInfo, recordsCount } = useBlockchainStatus();

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">Student Blockchain Status</h3>
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading blockchain status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-100">
        <h3 className="font-medium text-red-800 mb-2">Blockchain Status</h3>
        <p className="text-sm text-red-600">
          {error === 'Network Error' 
            ? 'Unable to connect to blockchain. Make sure Ganache is running.' 
            : `Error: ${error}`}
        </p>
        <div className="flex">
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
      <h3 className="font-medium text-blue-800 mb-2">Student Blockchain Status</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-blue-600 mb-1">University Network</p>
          <p className="font-mono font-medium">{networkInfo?.networkId || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-blue-600 mb-1">Student Records</p>
          <p className="font-mono font-medium">{recordsCount}</p>
        </div>
        <div>
          <p className="text-xs text-blue-600 mb-1">Gas Price</p>
          <p className="font-mono font-medium">{networkInfo?.gasPrice || 'N/A'} Gwei</p>
        </div>
        <div>
          <p className="text-xs text-blue-600 mb-1">Blockchain Status</p>
          <p className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full ${networkInfo ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
            <span className="font-medium">{networkInfo ? 'Connected' : 'Disconnected'}</span>
          </p>
        </div>
      </div>
      {networkInfo && (
        <div className="mt-3 text-xs text-blue-600">
          <p>Provider: {networkInfo.provider}</p>
          <p>Block #: {networkInfo.blockNumber}</p>
        </div>
      )}
    </div>
  );
};

export default TestBlockchainStatus;