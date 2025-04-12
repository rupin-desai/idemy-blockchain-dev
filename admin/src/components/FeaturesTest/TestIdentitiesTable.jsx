import React, { useState } from "react";
import { Search } from "lucide-react";
import { mockIdentities } from "../../constants/mockData";

const TestIdentitiesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredIdentities = mockIdentities.filter(identity => 
    identity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    identity.id.toString().includes(searchTerm)
  );
  
  return (
    <div>
      <div className="flex mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search identities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredIdentities.map((identity) => (
              <tr key={identity.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{identity.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{identity.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {identity.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    identity.status === "active" ? "bg-green-100 text-green-800" :
                    identity.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {identity.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                    <button className="text-green-600 hover:text-green-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestIdentitiesTable;