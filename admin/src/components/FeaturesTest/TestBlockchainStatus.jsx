import React from "react";

const TestBlockchainStatus = () => {
  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
      <h3 className="font-medium text-blue-800 mb-2">Student Blockchain Status</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-blue-600 mb-1">University Network</p>
          <p className="font-mono font-medium">1337</p>
        </div>
        <div>
          <p className="text-xs text-blue-600 mb-1">Student Records</p>
          <p className="font-mono font-medium">1,234</p>
        </div>
        <div>
          <p className="text-xs text-blue-600 mb-1">Verification Cost</p>
          <p className="font-mono font-medium">20 Gwei</p>
        </div>
        <div>
          <p className="text-xs text-blue-600 mb-1">Credential Status</p>
          <p className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span className="font-medium">Verifiable</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestBlockchainStatus;