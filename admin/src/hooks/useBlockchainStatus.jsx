import { useState, useEffect } from "react";
import apiClient from "../services/api.service";

const useBlockchainStatus = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [recordsCount, setRecordsCount] = useState(0);

  useEffect(() => {
    const fetchBlockchainStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch network information
        const networkResponse = await apiClient.get("/blockchain/info");
        setNetworkInfo(networkResponse.data.data);

        // You can add another endpoint to get identity count
        // For now we'll mock this with a random number
        setRecordsCount(Math.floor(Math.random() * 100) + 1);
      } catch (err) {
        console.error("Failed to fetch blockchain status:", err);
        setError(err.message || "Failed to fetch blockchain status");
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainStatus();
  }, []);

  return {
    loading,
    error,
    networkInfo,
    recordsCount,
  };
};

export default useBlockchainStatus;
