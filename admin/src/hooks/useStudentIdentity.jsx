import { useState, useCallback } from "react";
import identityService from "../services/identity.service";

const useStudentIdentity = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentIdentity, setStudentIdentity] = useState(null);
  const [studentIdentities, setStudentIdentities] = useState([]);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Create new student identity
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

      // Update identities
      if (Array.isArray(result.data.identities)) {
        setStudentIdentities(result.data.identities);
      } else if (Array.isArray(result.data)) {
        setStudentIdentities(result.data);
      }

      // Update pagination if available
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
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify a student identity (admin/issuer)
  const verifyStudentIdentity = useCallback(async (did, status) => {
    setLoading(true);
    setError(null);

    try {
      const result = await identityService.verifyIdentity(did, status);

      // Update local state to reflect the change
      setStudentIdentities((prevIdentities) =>
        prevIdentities.map((identity) =>
          identity.did === did
            ? { ...identity, identityStatus: status }
            : identity
        )
      );

      return result.data;
    } catch (err) {
      setError(err.message || "Failed to verify student identity");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a specific student identity
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
