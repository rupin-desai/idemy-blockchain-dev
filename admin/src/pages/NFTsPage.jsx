import React, { useState } from "react";
import { Search, Filter, CreditCard, User, Tag } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const NFTsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock NFT data for student ID cards
  const studentCards = [
    { id: 1, tokenId: "0x7e3a...9f21", studentId: "S12345678", name: "John Doe", department: "Computer Science", issueDate: "2023-09-01", expiryDate: "2024-08-31", status: "active" },
    { id: 2, tokenId: "0x9c4b...3e67", studentId: "S23456789", name: "Jane Smith", department: "Engineering", issueDate: "2023-09-01", expiryDate: "2024-08-31", status: "active" },
    { id: 3, tokenId: "0x2d5f...8a12", studentId: "S34567890", name: "Robert Johnson", department: "Business", issueDate: "2023-09-01", expiryDate: "2024-08-31", status: "suspended" },
    { id: 4, tokenId: "0x6b3c...1d45", studentId: "S45678901", name: "Alice Brown", department: "Arts", issueDate: "2023-09-01", expiryDate: "2024-08-31", status: "active" }
  ];

  const filteredCards = studentCards.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.tokenId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student ID Cards</h1>
          <p className="text-gray-600 mt-1">Manage blockchain-based student identification cards</p>
        </div>
        <Button icon={<CreditCard size={16} />}>
          Issue New Card
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Cards</p>
              <h3 className="mt-1 text-2xl font-semibold text-green-600">243</h3>
            </div>
            <div className="p-2 rounded-lg bg-green-50">
              <CreditCard size={24} className="text-green-500" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Issuance</p>
              <h3 className="mt-1 text-2xl font-semibold text-yellow-600">18</h3>
            </div>
            <div className="p-2 rounded-lg bg-yellow-50">
              <Clock size={24} className="text-yellow-500" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expired/Revoked</p>
              <h3 className="mt-1 text-2xl font-semibold text-red-600">7</h3>
            </div>
            <div className="p-2 rounded-lg bg-red-50">
              <XCircle size={24} className="text-red-500" />
            </div>
          </div>
        </Card>
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
              placeholder="Search by name, student ID or token ID..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Tag size={16} className="mr-2 text-blue-500" />
                      <span className="text-sm font-mono text-gray-900">{card.tokenId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{card.name}</p>
                        <p className="text-xs text-gray-500">{card.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{card.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.issueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card.expiryDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      card.status === 'active' ? 'bg-green-100 text-green-800' : 
                      card.status === 'suspended' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {card.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Renew</button>
                      <button className="text-red-600 hover:text-red-900">Revoke</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredCards.length}</span> of <span className="font-medium">{studentCards.length}</span> student ID cards
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border rounded text-sm bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 border rounded text-sm">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NFTsPage;