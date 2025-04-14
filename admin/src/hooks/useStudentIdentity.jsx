import { useState, useCallback } from "react";
import identityService from "../services/identity.service";
import blockchainService from "../services/blockchain.service";
import { useAuth } from "../contexts/AuthContext";

const useStudentIdentity = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentIdentity, setStudentIdentity] = useState(null);
  const [studentIdentities, setStudentIdentities] = useState([]);
  const [blockchainStatus, setBlockchainStatus] = useState({
    verified: false,
    txHash: null,
    blockNumber: null,
  });
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
      // Add blockchain param to get blockchain status if available
      const enhancedParams = { ...params, includeBlockchain: true };
      const result = await identityService.listIdentities(enhancedParams);

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

      // Get blockchain status if DID exists
      if (did) {
        try {
          const blockchainResult =
            await blockchainService.verifyIdentityOnBlockchain(did);
          setBlockchainStatus({
            verified: blockchainResult.data.verified,
            txHash: blockchainResult.data.transactionHash,
            blockNumber: blockchainResult.data.blockNumber,
            status: blockchainResult.data.status,
          });
        } catch (blockchainErr) {
          console.error("Failed to verify on blockchain:", blockchainErr);
          // Don't fail the entire operation if blockchain check fails
        }
      }

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

        // Verify in the database first
        const result = await identityService.verifyIdentity(did, status);

        // Then verify on blockchain if successful
        try {
          const blockchainResult =
            await blockchainService.verifyIdentityOnBlockchain(did);

          // If not on blockchain yet, register it
          if (!blockchainResult.data.verified) {
            const registrationResult =
              await blockchainService.registerIdentityOnBlockchain(did);

            if (registrationResult.data.success) {
              setBlockchainStatus({
                verified: true,
                txHash: registrationResult.data.transactionHash,
                blockNumber: registrationResult.data.blockNumber,
                status: "active",
              });
            }
          }
        } catch (blockchainErr) {
          console.error("Blockchain verification failed:", blockchainErr);
          // Continue anyway - we've updated the database
        }

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

  // Revoke a student identity
  const revokeStudentIdentity = useCallback(
    async (did) => {
      setLoading(true);
      setError(null);

      try {
        if (!currentUser || currentUser.role !== "admin") {
          throw new Error("You do not have permission to revoke identities");
        }

        // First update in database
        const result = await identityService.updateIdentityStatus(
          did,
          "revoked"
        );

        // Then update on blockchain
        try {
          const blockchainResult =
            await blockchainService.revokeIdentityOnBlockchain(did);

          if (blockchainResult.data.success) {
            setBlockchainStatus({
              verified: true,
              txHash: blockchainResult.data.transactionHash,
              blockNumber: blockchainResult.data.blockNumber,
              status: "revoked",
            });
          }
        } catch (blockchainErr) {
          console.error("Blockchain revocation failed:", blockchainErr);
          // Continue anyway - we've updated the database
        }

        return result.data;
      } catch (err) {
        setError(err.message || "Failed to revoke student identity");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Check if a student identity exists on blockchain
  const checkBlockchainStatus = useCallback(async (did) => {
    setLoading(true);
    setError(null);

    try {
      const result = await blockchainService.verifyIdentityOnBlockchain(did);

      setBlockchainStatus({
        verified: result.data.verified,
        txHash: result.data.transactionHash,
        blockNumber: result.data.blockNumber,
        status: result.data.status,
      });

      return result.data;
    } catch (err) {
      console.error("Failed to check blockchain status:", err);
      setBlockchainStatus({
        verified: false,
        txHash: null,
        blockNumber: null,
        status: "unknown",
      });

      // Don't set error or throw since this is supplementary info
      return { verified: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register identity on blockchain
  const registerOnBlockchain = useCallback(
    async (did) => {
      setLoading(true);
      setError(null);

      try {
        if (!currentUser || currentUser.role !== "admin") {
          throw new Error(
            "You do not have permission to register identities on blockchain"
          );
        }

        const result = await blockchainService.registerIdentityOnBlockchain(
          did
        );

        if (result.data.success) {
          setBlockchainStatus({
            verified: true,
            txHash: result.data.transactionHash,
            blockNumber: result.data.blockNumber,
            status: "active",
          });
        }

        return result.data;
      } catch (err) {
        setError(err.message || "Failed to register identity on blockchain");
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
    blockchainStatus,
    createStudentIdentity,
    fetchStudentIdentities,
    fetchStudentIdentity,
    verifyStudentIdentity,
    revokeStudentIdentity,
    checkBlockchainStatus,
    registerOnBlockchain,
  };
};

export default useStudentIdentity;
