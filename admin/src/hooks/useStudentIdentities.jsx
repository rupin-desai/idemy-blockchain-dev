import { useState, useEffect, useCallback } from "react";
import apiClient from "../services/api.service";

/**
 * Hook for fetching and managing student identity data from the blockchain
 */
const useStudentIdentities = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Fetch students from blockchain API
   */
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch student identities from the blockchain API
      const response = await apiClient.get("/blockchain/students");

      if (response.data?.data) {
        const formattedStudents = response.data.data.map((student) => ({
          id: student.id || student.uid,
          studentId: student.studentInfo?.studentId || "Unknown",
          did: student.did,
          name:
            `${student.personalInfo?.firstName || ""} ${
              student.personalInfo?.lastName || ""
            }`.trim() || "Unnamed",
          department:
            mapDepartmentCode(student.studentInfo?.department) || "General",
          type: student.studentInfo?.type || "undergraduate",
          status: student.identityStatus || "pending",
          blockchainTxHash: student.blockchainTxHash,
          walletAddress: student.walletAddress,
          createdAt: student.createdAt,
          blockchainVerified: student.blockchainVerified || false,
        }));

        setStudents(formattedStudents);
      } else {
        // Don't create mock data
        setError("No student identities found in the system");
        setStudents([]);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError(err.response?.data?.message || err.message);
      // Don't create mock data here either
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create mock student data for development
   */
  const createMockStudentData = () => {
    const mockStudents = Array.from({ length: 10 }, (_, i) => ({
      id: `student-${i + 1}`,
      studentId: `CS${10000 + i}`,
      did: `did:ethr:0x${Array(40)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`,
      name: `Student ${i + 1}`,
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

  /**
   * Map department code to full name
   */
  const mapDepartmentCode = (code) => {
    const departmentMap = {
      cs: "Computer Science",
      eng: "Engineering",
      bus: "Business",
      arts: "Arts & Humanities",
    };

    return departmentMap[code] || code;
  };

  /**
   * Refresh data
   */
  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  /**
   * Verify student identity on the blockchain
   */
  const verifyStudent = useCallback(
    async (did) => {
      try {
        const response = await apiClient.post(
          `/blockchain/students/verify/${did}`
        );
        refreshData();
        return response.data;
      } catch (err) {
        console.error("Failed to verify student:", err);
        throw err;
      }
    },
    [refreshData]
  );

  /**
   * Revoke student identity on the blockchain
   */
  const revokeStudent = useCallback(
    async (did) => {
      try {
        const response = await apiClient.post(
          `/blockchain/students/revoke/${did}`
        );
        refreshData();
        return response.data;
      } catch (err) {
        console.error("Failed to revoke student:", err);
        throw err;
      }
    },
    [refreshData]
  );

  /**
   * Check blockchain status for a student
   */
  const checkBlockchainStatus = useCallback(async (did) => {
    try {
      const response = await apiClient.get(
        `/blockchain/students/status/${did}`
      );
      return response.data;
    } catch (err) {
      console.error("Failed to check blockchain status:", err);
      return { verified: false, error: err.message };
    }
  }, []);

  // Fetch students when the component mounts or refresh is triggered
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, refreshTrigger]);

  return {
    loading,
    error,
    students,
    refreshData,
    verifyStudent,
    revokeStudent,
    checkBlockchainStatus,
  };
};

export default useStudentIdentities;
