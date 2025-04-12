import React, { useState } from "react";
import { Search, Filter, UserPlus, ShieldCheck, Edit, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock users data
  const users = [
    { id: 1, name: "Admin User", email: "admin@university.edu", role: "admin", department: "IT Services", status: "active", lastLogin: "2023-10-15 09:15" },
    { id: 2, name: "Registrar Staff", email: "registrar@university.edu", role: "issuer", department: "Registrar's Office", status: "active", lastLogin: "2023-10-14 16:30" },
    { id: 3, name: "Department Head", email: "department@university.edu", role: "issuer", department: "Computer Science", status: "active", lastLogin: "2023-10-13 11:45" },
    { id: 4, name: "Security Officer", email: "security@university.edu", role: "verifier", department: "Campus Security", status: "inactive", lastLogin: "2023-10-10 08:20" }
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Users</h1>
          <p className="text-gray-600 mt-1">Manage users who can access the student ID system</p>
        </div>
        <Button icon={<UserPlus size={16} />}>
          Add User
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
              placeholder="Search users by name, email or department..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ShieldCheck size={16} className={`mr-1 ${
                        user.role === 'admin' ? 'text-purple-500' : 
                        user.role === 'issuer' ? 'text-blue-500' : 
                        'text-green-500'
                      }`} />
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'issuer' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button title="Edit" className="text-blue-600 hover:text-blue-900">
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

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
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

export default UsersPage;