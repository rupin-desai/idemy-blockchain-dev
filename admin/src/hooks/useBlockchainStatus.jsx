import { useState, useEffect } from "react";
import apiClient from "../services/api.service";

const useBlockchainStatus = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [recordsCount, setRecordsCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to manually refresh data
  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchBlockchainStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch network information from API (real Ganache data)
        const networkResponse = await apiClient.get("/blockchain/info");
        setNetworkInfo(networkResponse.data.data);

        // Fetch student count from API (real contract data)
        const countResponse = await apiClient.get(
          "/blockchain/contracts/identity/count"
        );
        setRecordsCount(countResponse.data.data.count);
      } catch (err) {
        console.error("Failed to fetch blockchain status:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch blockchain status"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainStatus();
  }, [refreshTrigger]);

  return {
    loading,
    error,
    networkInfo,
    recordsCount,
    refreshData,
  };
};

export default useBlockchainStatus;
