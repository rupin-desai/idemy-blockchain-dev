import React, { useState } from 'react';
import {
  RefreshCw,
  Search,
  ExternalLink,
  Copy,
  CheckCircle2,
  Database
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import useBlockchainDIDs from '../../hooks/useBlockchainDIDs';

const TestBlockchainDIDs = () => {
  const { loading, error, dids, refreshData } = useBlockchainDIDs();
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedDID, setCopiedDID] = useState(null);
  const [expandedDID, setExpandedDID] = useState(null);

  // Filter DIDs based on search term
  const filteredDIDs = dids?.filter(identity => 
    identity?.did?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${identity?.personalInfo?.firstName || ""} ${identity?.personalInfo?.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    identity?.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    identity?.studentInfo?.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Copy DID to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedDID(text);
    setTimeout(() => setCopiedDID(null), 2000);
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  // Toggle expanded view for a DID
  const toggleExpanded = (did) => {
    setExpandedDID(expandedDID === did ? null : did);
  };

  return (
    <Card>
      <h2 className="text-lg font-medium mb-4">Blockchain DIDs</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            View all decentralized identifiers (DIDs) stored directly on the blockchain
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw size={14} className={`mr-1.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search by name, DID, studentID or wallet address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <RefreshCw className="h-6 w-6 text-blue-500 animate-spin mr-3" />
            <p>Loading blockchain DIDs...</p>
          </div>
        ) : filteredDIDs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-md">
            <div className="flex flex-col items-center">
              <Database className="h-8 w-8 text-gray-400 mb-2" />
              <p className="font-medium">No DIDs found on blockchain</p>
              <p className="text-sm mt-1">
                {searchTerm
                  ? "Try a different search term or clear the search"
                  : "Try creating a new blockchain DID"}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student Info
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    DID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Wallet Address
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDIDs.map((did, index) => (
                  <React.Fragment key={did?.did || index}>
                    <tr className={`hover:bg-gray-50 ${expandedDID === did?.did ? 'bg-blue-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {did?.personalInfo?.firstName} {did?.personalInfo?.lastName}
                          </span>
                          {did?.studentInfo?.studentId && (
                            <span className="text-sm text-gray-500">
                              ID: {did.studentInfo.studentId}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="text-sm font-mono truncate max-w-[200px]" title={did?.did}>
                            {did?.did}
                          </span>
                          <button
                            onClick={() => copyToClipboard(did?.did)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            title="Copy DID"
                          >
                            {copiedDID === did?.did ? (
                              <CheckCircle2 size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono truncate max-w-[120px] inline-block" title={did?.walletAddress}>
                          {did?.walletAddress}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          did?.active || did?.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {did?.active || did?.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleExpanded(did?.did)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          {expandedDID === did?.did ? 'Hide Details' : 'View Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedDID === did?.did && (
                      <tr className="bg-blue-50">
                        <td colSpan="5" className="px-6 py-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-700">Personal Information</h4>
                              <div>
                                <span className="text-xs text-gray-500">Name:</span>
                                <p className="font-medium">
                                  {did?.personalInfo?.firstName} {did?.personalInfo?.lastName}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Student ID:</span>
                                <p className="font-medium">{did?.studentInfo?.studentId || "N/A"}</p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Department:</span>
                                <p className="font-medium">{did?.studentInfo?.department || "N/A"}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-700">Blockchain Information</h4>
                              <div>
                                <span className="text-xs text-gray-500">DID:</span>
                                <p className="font-mono text-sm break-all">{did?.did}</p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Wallet Address:</span>
                                <p className="font-mono text-sm break-all">{did?.walletAddress}</p>
                              </div>
                              {did?.transactionHash && (
                                <div>
                                  <span className="text-xs text-gray-500">Transaction:</span>
                                  <p className="font-mono text-sm truncate">{did.transactionHash}</p>
                                </div>
                              )}
                              {did?.createdAt && (
                                <div>
                                  <span className="text-xs text-gray-500">Created:</span>
                                  <p>{formatDate(did.createdAt)}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 text-sm text-gray-500">
          <span>{filteredDIDs.length} DIDs found</span>
          <span>Data fetched directly from blockchain</span>
        </div>
      </div>
    </Card>
  );
};

export default TestBlockchainDIDs;
