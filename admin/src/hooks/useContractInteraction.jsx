import { useState, useCallback } from "react";
import contractService from "../services/contract.service";

const useContractInteraction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contracts, setContracts] = useState({
    identityContract: null,
    cardContract: null,
  });
  const [studentCount, setStudentCount] = useState(0);
  const [verificationResult, setVerificationResult] = useState(null);
  const [cardValidityResult, setCardValidityResult] = useState(null);

  // Fetch contract addresses
  const getContractAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contractService.getContractAddresses();

      setContracts({
        identityContract: response.data?.identityContract,
        cardContract: response.data?.cardContract,
      });

      return response.data;
    } catch (err) {
      setError(err.message || "Failed to fetch contract addresses");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify student records in the identity contract
  const verifyStudentRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contractService.verifyStudentRecords();
      setVerificationResult(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || "Failed to verify student records");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check card validity
  const checkCardValidity = useCallback(async (studentId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await contractService.checkCardValidity(studentId);
      setCardValidityResult(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || "Failed to check card validity");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get student count
  const getStudentCount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contractService.getStudentCount();
      setStudentCount(response.data?.count || 0);
      return response.data;
    } catch (err) {
      setError(err.message || "Failed to get student count");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    contracts,
    studentCount,
    verificationResult,
    cardValidityResult,
    getContractAddresses,
    verifyStudentRecords,
    checkCardValidity,
    getStudentCount,
  };
};

export default useContractInteraction;
