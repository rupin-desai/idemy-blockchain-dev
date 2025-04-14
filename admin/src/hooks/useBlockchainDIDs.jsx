import { useState, useEffect, useCallback } from 'react';
import blockchainService from '../services/blockchain.service';

/**
 * Custom hook for fetching DIDs directly from the blockchain
 */
const useBlockchainDIDs = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dids, setDids] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Refresh function
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Fetch DIDs from blockchain
  const fetchBlockchainDIDs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await blockchainService.getBlockchainDIDs();
      
      if (response && response.success) {
        setDids(response.data || []);
      } else {
        console.warn("Invalid response format or no DIDs found:", response);
        setDids([]);
        setError(response?.message || "No DIDs found in blockchain");
      }
    } catch (err) {
      console.error('Failed to fetch DIDs from blockchain:', err);
      setError(err.message || 'Failed to fetch DIDs from blockchain');
      setDids([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount and when refreshTrigger changes
  useEffect(() => {
    fetchBlockchainDIDs();
  }, [fetchBlockchainDIDs, refreshTrigger]);

  return {
    loading,
    error,
    dids,
    refreshData,
    fetchBlockchainDIDs
  };
};

export default useBlockchainDIDs;