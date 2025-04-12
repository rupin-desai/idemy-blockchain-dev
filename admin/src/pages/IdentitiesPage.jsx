import React, { useState } from "react";
import { Search, Filter, Plus, Eye, Edit, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

// Mock data
const mockIdentities = [
  {
    id: "did:eth:0x1234567890abcdef",
    name: "John Doe",
    email: "john@example.com",
    type: "government",
    issueDate: "2023-01-15",
    status: "active",
  },
  {
    id: "did:eth:0xabcdef1234567890",
    name: "Jane Smith",
    email: "jane@example.com",
    type: "passport",
    issueDate: "2023-02-20",
    status: "active",
  },
  {
    id: "did:eth:0x9876543210fedcba",
    name: "Robert Johnson",
    email: "robert@example.com",
    type: "license",
    issueDate: "2023-03-10",
    status: "pending",
  },
  {
    id: "did:eth:0xfedcba0987654321",
    name: "Alice Williams",
    email: "alice@example.com", 
    type: "student",
    issueDate: "2023-04-05",
    status: "revoked",
  },
];

const Identities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredIdentities = mockIdentities.filter(identity => 
    identity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    identity.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    identity.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Identities</h1>
          <p className="text-gray-600 mt-1">Manage digital identities in the system</p>
        </div>
        <Button icon={<Plus size={16} />}>
          Create Identity
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              placeholder="Search by name, email or DID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="secondary" 
            icon={<Filter size={16} />}
            className="whitespace-nowrap"
          >
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIdentities.map((identity) => (
                <tr key={identity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900 truncate max-w-[140px]" title={identity.id}>
                      {identity.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{identity.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{identity.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {identity.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{identity.issueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      identity.status === 'active' ? 'bg-green-100 text-green-800' : 
                      identity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {identity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button title="View" className="text-blue-600 hover:text-blue-900">
                        <Eye size={18} />
                      </button>
                      <button title="Edit" className="text-green-600 hover:text-green-900">
                        <Edit size={18} />
                      </button>
                      <button title="Delete" className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredIdentities.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No identities found matching your search.</p>
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredIdentities.length}</span> of <span className="font-medium">{mockIdentities.length}</span> identities
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border rounded text-sm bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded text-sm">
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Identities;