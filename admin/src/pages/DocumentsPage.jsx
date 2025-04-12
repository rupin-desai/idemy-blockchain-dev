import React, { useState } from "react";
import { Search, Filter, Upload, FileText, Clock } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const DocumentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock document data
  const documents = [
    { id: 1, name: "Student Transcript", studentId: "S12345678", studentName: "John Doe", type: "transcript", status: "verified", date: "2023-09-15" },
    { id: 2, name: "Enrollment Certificate", studentId: "S23456789", studentName: "Jane Smith", type: "certificate", status: "pending", date: "2023-10-02" },
    { id: 3, name: "ID Card Request", studentId: "S34567890", studentName: "Robert Johnson", type: "identification", status: "verified", date: "2023-09-20" },
    { id: 4, name: "Degree Certificate", studentId: "S45678901", studentName: "Alice Brown", type: "certificate", status: "pending", date: "2023-10-10" }
  ];

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Documents</h1>
          <p className="text-gray-600 mt-1">Manage and verify student academic documents</p>
        </div>
        <Button icon={<Upload size={16} />}>
          Upload Document
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
              placeholder="Search documents or students..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{doc.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {doc.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Verify</button>
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
            Showing <span className="font-medium">{filteredDocuments.length}</span> of <span className="font-medium">{documents.length}</span> documents
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

export default DocumentsPage;