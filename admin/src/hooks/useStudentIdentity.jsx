import { useState, useCallback } from "react";
import identityService from "../services/identity.service";
import { useAuth } from "../contexts/AuthContext";

const useStudentIdentity = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentIdentity, setStudentIdentity] = useState(null);
  const [studentIdentities, setStudentIdentities] = useState([]);
  const [paginationData, setPaginationData] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const { currentUser } = useAuth();

  // Create student identity
  const createStudentIdentity = useCallback(async (identityData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await identityService.createIdentity(identityData);
      setStudentIdentity(result.data);
      return result.data;
    } catch (err) {
      setError(err.message || "Failed to create student identity");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get student identities with filtering and pagination
  const fetchStudentIdentities = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await identityService.listIdentities(params);

      if (Array.isArray(result.data.identities)) {
        setStudentIdentities(result.data.identities);
      } else if (Array.isArray(result.data)) {
        setStudentIdentities(result.data);
      }

      if (result.data.pagination) {
        setPaginationData(result.data.pagination);
      }

      return {
        data: Array.isArray(result.data.identities)
          ? result.data.identities
          : result.data,
        pagination: result.data.pagination || paginationData,
      };
    } catch (err) {
      setError(err.message || "Failed to fetch student identities");
      setStudentIdentities([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get specific student identity by DID
  const fetchStudentIdentity = useCallback(async (did) => {
    setLoading(true);
    setError(null);

    try {
      const result = await identityService.getIdentity(did);
      setStudentIdentity(result.data);
      return result.data;
    } catch (err) {
      setError(err.message || "Failed to fetch student identity");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify student identity
  const verifyStudentIdentity = useCallback(
    async (did, status) => {
      setLoading(true);
      setError(null);

      try {
        if (!currentUser || currentUser.role !== "admin") {
          throw new Error("You do not have permission to verify identities");
        }

        const result = await identityService.verifyIdentity(did, status);
        return result.data;
      } catch (err) {
        setError(err.message || "Failed to verify student identity");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  return {
    loading,
    error,
    studentIdentity,
    studentIdentities,
    paginationData,
    createStudentIdentity,
    fetchStudentIdentities,
    verifyStudentIdentity,
    fetchStudentIdentity,
  };
};

export default useStudentIdentity;
