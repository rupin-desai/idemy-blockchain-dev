import React from "react";
import { Database, Clock, CheckCircle, AlertTriangle, Activity } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const BlockchainPage = () => {
  // Mock blockchain transaction data
  const transactions = [
    { hash: "0x3a8d...e72f", type: "Issue ID", student: "John Doe (S12345678)", status: "confirmed", time: "10 minutes ago", block: 12345678 },
    { hash: "0x9c4b...f23a", type: "Verify Document", student: "Jane Smith (S23456789)", status: "confirmed", time: "25 minutes ago", block: 12345677 },
    { hash: "0x7e2f...a91c", type: "Revoke ID", student: "Robert Johnson (S34567890)", status: "pending", time: "32 minutes ago", block: null },
    { hash: "0x5d6c...b43e", type: "Update Record", student: "Alice Brown (S45678901)", status: "confirmed", time: "1 hour ago", block: 12345670 },
    { hash: "0x2b9a...c56d", type: "Issue ID", student: "David Wilson (S56789012)", status: "failed", time: "1 hour ago", block: null }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blockchain Monitor</h1>
          <p className="text-gray-600 mt-1">View and manage blockchain operations for the student ID system</p>
        </div>
        <Button icon={<Activity size={16} />}>
          Sync Network Status
        </Button>
      </div>

      {/* Network Stats */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <h2 className="text-lg font-medium text-blue-800 mb-4">Network Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-blue-600">CURRENT BLOCK</p>
            <p className="mt-1 text-2xl font-mono font-bold">12,345,678</p>
          </div>
          <div>
            <p className="text-xs font-medium text-blue-600">GAS PRICE</p>
            <p className="mt-1 text-2xl font-mono font-bold">12 Gwei</p>
          </div>
          <div>
            <p className="text-xs font-medium text-blue-600">PENDING TXs</p>
            <p className="mt-1 text-2xl font-mono font-bold">3</p>
          </div>
          <div>
            <p className="text-xs font-medium text-blue-600">NETWORK</p>
            <div className="mt-1 flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <p className="font-medium">Connected (University Chain)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-medium mb-4">Student ID Contract</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Address</span>
              <span className="text-sm font-mono bg-gray-100 p-1 rounded">0x7e3a4c5b6d7e8f9a1b2c3d4e5f6a7b8c9d0e1f2a</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total IDs Issued</span>
              <span className="text-sm font-medium">1,234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Active IDs</span>
              <span className="text-sm font-medium">1,150</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Revoked IDs</span>
              <span className="text-sm font-medium">84</span>
            </div>
            <div className="mt-4">
              <Button size="sm">View Contract</Button>
            </div>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-medium mb-4">Document Verification Contract</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Address</span>
              <span className="text-sm font-mono bg-gray-100 p-1 rounded">0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Documents Registered</span>
              <span className="text-sm font-medium">3,567</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Verified Documents</span>
              <span className="text-sm font-medium">3,245</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Pending Verification</span>
              <span className="text-sm font-medium">322</span>
            </div>
            <div className="mt-4">
              <Button size="sm">View Contract</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Hash</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Database size={16} className="mr-2 text-blue-500" />
                      <span className="text-sm font-mono text-gray-900">{tx.hash}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.student}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center text-xs ${
                      tx.status === 'confirmed' ? 'text-green-800' : 
                      tx.status === 'pending' ? 'text-yellow-800' : 
                      'text-red-800'
                    }`}>
                      {tx.status === 'confirmed' ? <CheckCircle size={14} className="mr-1" /> : 
                       tx.status === 'pending' ? <Clock size={14} className="mr-1" /> : 
                       <AlertTriangle size={14} className="mr-1" />}
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tx.block ? tx.block.toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default BlockchainPage;