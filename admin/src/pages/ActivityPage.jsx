import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  Activity as ActivityIcon,
  Database,
  Clock,
  FileText,
  CreditCard,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const ActivityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Mock activity log data
  const activityLogs = [
    {
      id: 1,
      type: "identity",
      action: "Student ID created",
      user: "Admin User",
      target: "John Doe (S12345678)",
      timestamp: "2023-10-15 10:25:30",
      details: "New student identity created and stored on blockchain",
    },
    {
      id: 2,
      type: "document",
      action: "Transcript verified",
      user: "Registrar Staff",
      target: "Jane Smith (S23456789)",
      timestamp: "2023-10-15 09:45:12",
      details: "Student transcript verified and hashed to blockchain",
    },
    {
      id: 3,
      type: "card",
      action: "ID card issued",
      user: "Department Head",
      target: "Robert Johnson (S34567890)",
      timestamp: "2023-10-14 16:32:45",
      details: "Student ID card issued as NFT",
    },
    {
      id: 4,
      type: "system",
      action: "User login",
      user: "Security Officer",
      target: "System",
      timestamp: "2023-10-14 15:10:20",
      details: "User logged in from campus IP (192.168.1.45)",
    },
    {
      id: 5,
      type: "identity",
      action: "Student ID updated",
      user: "Admin User",
      target: "Alice Brown (S45678901)",
      timestamp: "2023-10-14 11:05:18",
      details: "Student information updated (Department changed)",
    },
    {
      id: 6,
      type: "document",
      action: "Document revoked",
      user: "Registrar Staff",
      target: "David Wilson (S56789012)",
      timestamp: "2023-10-14 09:30:42",
      details: "Temporary certificate revoked due to error",
    },
    {
      id: 7,
      type: "system",
      action: "Contract deployed",
      user: "System Admin",
      target: "System",
      timestamp: "2023-10-13 17:20:15",
      details: "New student ID contract deployed to blockchain",
    },
  ];

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "all") return matchesSearch;
    return matchesSearch && log.type === filterType;
  });

  const getLogIcon = (type) => {
    switch (type) {
      case "identity":
        return <User size={16} className="text-blue-500" />;
      case "document":
        return <FileText size={16} className="text-amber-500" />;
      case "card":
        return <CreditCard size={16} className="text-green-500" />;
      case "system":
        return <Database size={16} className="text-purple-500" />;
      default:
        return <ActivityIcon size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-600 mt-1">
          Audit trail of all activities in the student ID system
        </p>
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
              placeholder="Search activity logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Activities</option>
              <option value="identity">Identity</option>
              <option value="document">Documents</option>
              <option value="card">ID Cards</option>
              <option value="system">System</option>
            </select>
            <Button
              variant="secondary"
              icon={<Calendar size={16} />}
              className="whitespace-nowrap"
            >
              Date Range
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {log.action}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      {log.timestamp}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{log.details}</p>
                  <div className="mt-2 flex justify-between">
                    <span className="text-xs text-gray-500">
                      Target: {log.target}
                    </span>
                    <span className="text-xs text-gray-500">
                      By: {log.user}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No activity logs found matching your search
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredLogs.length}</span>{" "}
            of <span className="font-medium">{activityLogs.length}</span>{" "}
            activities
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border rounded text-sm bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded text-sm">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ActivityPage;
