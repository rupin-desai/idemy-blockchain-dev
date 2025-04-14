import React, { useState, useEffect } from "react";
import { Search, RefreshCw, ExternalLink, Eye } from "lucide-react";
import useStudentIdentities from "../../hooks/useStudentIdentities";
import Button from "../../ui/Button";

const TestIdentitiesTable = () => {
  const {
    loading,
    error,
    students,
    refreshData,
    verifyStudent,
    revokeStudent,
  } = useStudentIdentities();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionInProgress, setActionInProgress] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toString().includes(searchTerm) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerify = async (did) => {
    try {
      setActionInProgress(did);
      await verifyStudent(did);
      alert("Student identity verified successfully");
    } catch (error) {
      console.error("Failed to verify student:", error);
      alert(
        "Failed to verify student: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRevoke = async (did) => {
    if (
      !window.confirm("Are you sure you want to revoke this student identity?")
    )
      return;

    try {
      setActionInProgress(did);
      await revokeStudent(did);
      alert("Student identity revoked successfully");
    } catch (error) {
      console.error("Failed to revoke student:", error);
      alert(
        "Failed to revoke student: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setActionInProgress(null);
    }
  };

  const handleViewCard = (student) => {
    setSelectedStudent(student);
    setViewModalOpen(true);
  };

  const getEtherscanUrl = (hash) => {
    return `https://sepolia.etherscan.io/tx/${hash}`;
  };

  const departmentColors = {
    "Computer Science": "blue",
    Engineering: "green",
    Business: "purple",
    Arts: "pink",
    General: "gray",
  };

  const getDepartmentColor = (dept) => {
    const color = departmentColors[dept] || "gray";
    return `bg-${color}-100 text-${color}-800`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Student Identities</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={refreshData}
          disabled={loading}
        >
          <RefreshCw
            size={14}
            className={`mr-1 ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mb-4">
          Error loading student identities: {error}
        </div>
      )}

      <div className="flex mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search by name, ID or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                  Loading student identities...
                </td>
              </tr>
            )}

            {!loading && filteredStudents.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No student identities found
                </td>
              </tr>
            )}

            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">
                      {student.studentId}
                    </div>
                    <div
                      className="text-xs text-gray-500 font-mono truncate max-w-[150px]"
                      title={student.did}
                    >
                      {student.did}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.department}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {student.type}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      student.status === "active"
                        ? "bg-green-100 text-green-800"
                        : student.status === "verified"
                        ? "bg-green-100 text-green-800"
                        : student.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : student.status === "revoked"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                      onClick={() => handleViewCard(student)}
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </button>

                    {student.status === "pending" && (
                      <button
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        onClick={() => handleVerify(student.did)}
                        disabled={actionInProgress === student.did}
                      >
                        {actionInProgress === student.did
                          ? "Verifying..."
                          : "Verify"}
                      </button>
                    )}

                    {(student.status === "active" ||
                      student.status === "verified") && (
                      <button
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        onClick={() => handleRevoke(student.did)}
                        disabled={actionInProgress === student.did}
                      >
                        {actionInProgress === student.did
                          ? "Revoking..."
                          : "Revoke"}
                      </button>
                    )}

                    {student.blockchainTxHash && (
                      <a
                        href={getEtherscanUrl(student.blockchainTxHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Card Modal */}
      {viewModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setViewModalOpen(false)}
            >
              ✕
            </button>

            <h3 className="text-lg font-medium mb-4">Student Identity Card</h3>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
              <div className="flex flex-col space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium">{selectedStudent.name}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Student ID</div>
                  <div className="font-medium">{selectedStudent.studentId}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Department</div>
                  <div className="font-medium">
                    {selectedStudent.department}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">DID</div>
                  <div className="font-mono text-xs break-all">
                    {selectedStudent.did}
                  </div>
                </div>

                {selectedStudent.walletAddress && (
                  <div>
                    <div className="text-sm text-gray-500">Wallet</div>
                    <div className="font-mono text-xs break-all">
                      {selectedStudent.walletAddress}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      selectedStudent.status === "active" ||
                      selectedStudent.status === "verified"
                        ? "bg-green-100 text-green-800"
                        : selectedStudent.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedStudent.status === "revoked"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedStudent.status}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </Button>

              {selectedStudent.blockchainTxHash && (
                <Button
                  variant="secondary"
                  size="sm"
                  as="a"
                  href={getEtherscanUrl(selectedStudent.blockchainTxHash)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={14} className="mr-1" />
                  View on Blockchain
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestIdentitiesTable;
