import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  ExternalLink,
  Eye,
  Clock,
  Shield,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import apiClient from "../../services/api.service";
import Button from "../../ui/Button";

const TestIdentitiesTable = ({ onVerifySuccess, onVerifyError }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionInProgress, setActionInProgress] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch real student identities from blockchain
  const fetchStudentsFromBlockchain = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from blockchain API
      const response = await apiClient.get("/blockchain/students");

      if (response.data?.success) {
        if (response.data.data && response.data.data.length > 0) {
          setStudents(response.data.data.map(formatStudentData));
          console.log(`Loaded ${response.data.data.length} student records`);
        } else {
          setStudents([]);
          setError(
            "No student identities found. Create some using the 'Create Identity' tab."
          );
        }
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Failed to fetch from blockchain:", err);
      setError(
        err.message || "Failed to fetch student identities from blockchain"
      );
      setStudents([]); // Do NOT fall back to mock data
    } finally {
      setLoading(false);
    }
  };

  // Format student data from API
  const formatStudentData = (student) => {
    return {
      id: student.uid || student.id || `student-${Date.now()}`,
      studentId: student.studentInfo?.studentId || "Unknown ID",
      did: student.did || "did:ethr:0xunknown",
      name:
        `${student.personalInfo?.firstName || ""} ${
          student.personalInfo?.lastName || ""
        }`.trim() || "Unknown Student",
      department:
        mapDepartmentCode(student.studentInfo?.department) || "General",
      type: student.studentInfo?.type || "undergraduate",
      status: student.identityStatus || "pending",
      blockchainTxHash: student.blockchainTxHash,
      walletAddress: student.walletAddress,
      createdAt: student.createdAt,
      blockchainVerified: student.blockchainVerified || false,
      ipfsHash: student.ipfsHash,
    };
  };

  // Map department codes to full names
  const mapDepartmentCode = (code) => {
    const deptMap = {
      cs: "Computer Science",
      eng: "Engineering",
      bus: "Business",
      arts: "Arts",
    };

    return deptMap[code] || code;
  };

  // Create mock data for development
  const createMockData = () => {
    const mockStudents = Array.from({ length: 8 }, (_, i) => ({
      id: `student-${i + 1}`,
      studentId: `S${100000 + i}`,
      did: `did:ethr:0x${Array(40)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`,
      name: `Student-${i + 1} Test`,
      department: ["Computer Science", "Engineering", "Business", "Arts"][
        i % 4
      ],
      type: ["undergraduate", "graduate", "exchange"][i % 3],
      status: ["pending", "verified", "active", "revoked"][i % 4],
      blockchainTxHash:
        i % 3 === 0
          ? `0x${Array(64)
              .fill(0)
              .map(() => Math.floor(Math.random() * 16).toString(16))
              .join("")}`
          : null,
      walletAddress: `0x${Array(40)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      blockchainVerified: i % 2 === 0,
    }));

    setStudents(mockStudents);
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.did?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle verify student
  const handleVerify = async (did) => {
    try {
      setActionInProgress(did);

      // Call blockchain API to verify student
      const response = await apiClient.post(
        `/blockchain/identity/${did}/verify`
      );

      if (response.data?.success) {
        // Refresh data to get updated status
        fetchStudentsFromBlockchain();

        // Notify parent component
        if (onVerifySuccess) onVerifySuccess(did);
        else alert("Student identity verified successfully on blockchain!");
      } else {
        throw new Error(response.data?.message || "Verification failed");
      }
    } catch (error) {
      console.error("Failed to verify student:", error);

      // Notify parent component or show alert
      if (onVerifyError) onVerifyError(error.message);
      else
        alert(
          "Failed to verify student: " +
            (error.response?.data?.message || error.message)
        );
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle revoke student
  const handleRevoke = async (did) => {
    if (
      !window.confirm("Are you sure you want to revoke this student identity?")
    )
      return;

    try {
      setActionInProgress(did);

      // Call blockchain API to revoke student
      const response = await apiClient.post(
        `/blockchain/identity/${did}/revoke`
      );

      if (response.data?.success) {
        // Refresh data to get updated status
        fetchStudentsFromBlockchain();
        alert("Student identity revoked successfully");
      } else {
        throw new Error(response.data?.message || "Revocation failed");
      }
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

  // Handle view student card
  const handleViewCard = (student) => {
    setSelectedStudent(student);
    setViewModalOpen(true);

    // Fetch additional blockchain data if available
    if (student.did) {
      fetchBlockchainDetails(student.did);
    }
  };

  // Fetch additional blockchain details for a student
  const fetchBlockchainDetails = async (did) => {
    try {
      const response = await apiClient.get(
        `/blockchain/identity/${did}/verify`
      );

      if (response.data?.success && response.data?.data) {
        setSelectedStudent((prev) => ({
          ...prev,
          blockchainDetails: response.data.data,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch blockchain details:", error);
    }
  };

  // Get blockchain explorer URL
  const getEtherscanUrl = (hash) => {
    // Use local explorer in development, testnet in production
    if (
      process.env.NODE_ENV === "development" &&
      /^http:\/\/localhost/.test(window.location.origin)
    ) {
      return `http://localhost:8545/tx/${hash}`;
    }
    return `https://sepolia.etherscan.io/tx/${hash}`;
  };

  // Format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStudentsFromBlockchain();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Student Identities</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchStudentsFromBlockchain}
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
            placeholder="Search by name, ID, department, or DID..."
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
                  Loading student identities from blockchain...
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
                  <div className="flex items-center space-x-1">
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

                    {/* Blockchain verification indicator */}
                    {student.blockchainVerified && (
                      <span
                        className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                        title="Verified on blockchain"
                      >
                        <Shield size={10} className="mr-1" />
                        Chain
                      </span>
                    )}

                    {/* If has transaction hash but verification pending */}
                    {student.blockchainTxHash &&
                      !student.blockchainVerified && (
                        <span
                          className="inline-flex items-center bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full"
                          title="Transaction pending"
                        >
                          <Clock size={10} className="mr-1" />
                          Pending
                        </span>
                      )}
                  </div>
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
                        title="View transaction on blockchain explorer"
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

      {/* Student Card Modal with Blockchain Details */}
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
                  <div className="text-sm text-gray-500">Type</div>
                  <div className="font-medium">{selectedStudent.type}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">DID</div>
                  <div className="font-mono text-xs break-all">
                    {selectedStudent.did}
                  </div>
                </div>

                {selectedStudent.walletAddress && (
                  <div>
                    <div className="text-sm text-gray-500">Wallet Address</div>
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

                {selectedStudent.createdAt && (
                  <div>
                    <div className="text-sm text-gray-500">Created At</div>
                    <div className="font-medium text-sm">
                      {formatDate(selectedStudent.createdAt)}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm text-gray-500">Blockchain Status</div>
                  <div className="flex items-center mt-1">
                    {selectedStudent.blockchainVerified ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 size={14} className="mr-1" />
                        Verified on blockchain
                      </div>
                    ) : selectedStudent.blockchainTxHash ? (
                      <div className="flex items-center text-yellow-600">
                        <Clock size={14} className="mr-1" />
                        Pending verification
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <XCircle size={14} className="mr-1" />
                        Not on blockchain
                      </div>
                    )}
                  </div>
                </div>

                {selectedStudent.blockchainTxHash && (
                  <div>
                    <div className="text-sm text-gray-500">
                      Transaction Hash
                    </div>
                    <div className="font-mono text-xs break-all">
                      {selectedStudent.blockchainTxHash}
                    </div>
                  </div>
                )}

                {selectedStudent.ipfsHash && (
                  <div>
                    <div className="text-sm text-gray-500">IPFS Hash</div>
                    <div className="font-mono text-xs break-all">
                      {selectedStudent.ipfsHash}
                    </div>
                  </div>
                )}

                {/* Blockchain verification details */}
                {selectedStudent.blockchainDetails && (
                  <div className="border-t border-gray-200 pt-3 mt-1">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Blockchain Verification
                    </div>
                    <div className="text-xs space-y-1">
                      {selectedStudent.blockchainDetails.verified && (
                        <>
                          <div>
                            <span className="text-gray-500">Status: </span>
                            <span
                              className={`px-1.5 py-0.5 rounded ${
                                selectedStudent.blockchainDetails.status ===
                                "active"
                                  ? "bg-green-100 text-green-800"
                                  : selectedStudent.blockchainDetails.status ===
                                    "suspended"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : selectedStudent.blockchainDetails.status ===
                                    "revoked"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {selectedStudent.blockchainDetails.status}
                            </span>
                          </div>

                          {selectedStudent.blockchainDetails.owner && (
                            <div className="break-all">
                              <span className="text-gray-500">Owner: </span>
                              <span className="font-mono">
                                {selectedStudent.blockchainDetails.owner}
                              </span>
                            </div>
                          )}

                          {selectedStudent.blockchainDetails.createdAt && (
                            <div>
                              <span className="text-gray-500">Created: </span>
                              {formatDate(
                                selectedStudent.blockchainDetails.createdAt
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
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
