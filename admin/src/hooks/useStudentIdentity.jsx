import { useState, useCallback } from 'react';
import identityService from '../services/identity.service';

const useStudentIdentity = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentIdentity, setStudentIdentity] = useState(null);
  const [studentIdentities, setStudentIdentities] = useState([]);

  // Create new student identity
  const createStudentIdentity = useCallback(async (identityData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await identityService.createIdentity(identityData);
      setStudentIdentity(result.data);
      return result.data;
    } catch (err) {
      setError(err.message || 'Failed to create student identity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get student identities (admin)
  const fetchStudentIdentities = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await identityService.listIdentities(filters);
      setStudentIdentities(result.data);
      return result.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch student identities');
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
      setStudentIdentities(prevIdentities => 
        prevIdentities.map(identity => 
          identity.did === did ? { ...identity, identityStatus: status } : identity
        )
      );
      
      return result.data;
    } catch (err) {
      setError(err.message || 'Failed to verify student identity');
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
      setError(err.message || 'Failed to fetch student identity');
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
    createStudentIdentity,
    fetchStudentIdentities,
    verifyStudentIdentity,
    fetchStudentIdentity
  };
};

export default useStudentIdentity;