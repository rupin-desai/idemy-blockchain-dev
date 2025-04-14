import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Clock,
  DollarSign,
  Hash,
  Database,
  Code,
} from "lucide-react";
import Button from "../../ui/Button";
import apiClient from "../../services/api.service";
import Web3 from "web3";
import blockchainService from '../../services/blockchain.service';

const TestBlockchainExplorer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [blockDetails, setBlockDetails] = useState({});
  const [transactionDetails, setTransactionDetails] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [showDecodedInput, setShowDecodedInput] = useState(true);
  const [contractABIs, setContractABIs] = useState({
    identityContractABI: [],
    idCardContractABI: [],
    documentRegistryContractABI: []
  });

  // Fetch latest blocks
  const fetchBlocks = async () => {
    try {
      setRefreshing(true);
      const response = await apiClient.get("/blockchain/blocks");
      if (response.data?.success) {
        setBlocks(response.data.data);
      } else {
        throw new Error("Failed to fetch blockchain data");
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching blockchain data:", err);
      // More specific error message to help with debugging
      if (err.response?.status === 503) {
        setError(
          "Cannot connect to blockchain. Make sure Ganache is running at http://127.0.0.1:8545"
        );
      } else {
        setError(
          `Failed to fetch blockchain data: ${
            err.response?.data?.message || err.message
          }. Make sure Ganache is running.`
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch block details
  const fetchBlockDetails = async (blockNumber) => {
    if (blockDetails[blockNumber]) {
      // Already fetched, just toggle expanded state
      setExpandedBlock(expandedBlock === blockNumber ? null : blockNumber);
      return;
    }

    try {
      const response = await apiClient.get(`/blockchain/block/${blockNumber}`);
      if (response.data?.success) {
        setBlockDetails((prev) => ({
          ...prev,
          [blockNumber]: response.data.data,
        }));
        setExpandedBlock(blockNumber);
      } else {
        throw new Error(`Failed to fetch details for block ${blockNumber}`);
      }
    } catch (err) {
      console.error(`Error fetching block ${blockNumber}:`, err);
      setError(`Failed to load block ${blockNumber} details`);
    }
  };

  // Fetch transaction details
  const fetchTransactionDetails = async (hash) => {
    if (transactionDetails[hash]) {
      // Already fetched, just toggle expanded state
      setExpandedTransaction(expandedTransaction === hash ? null : hash);
      return;
    }

    try {
      const response = await apiClient.get(`/blockchain/transaction/${hash}`);
      if (response.data?.success) {
        setTransactionDetails((prev) => ({
          ...prev,
          [hash]: response.data.data,
        }));
        setExpandedTransaction(hash);
      } else {
        throw new Error(`Failed to fetch details for transaction ${hash}`);
      }
    } catch (err) {
      console.error(`Error fetching transaction ${hash}:`, err);
      setError(`Failed to load transaction ${hash} details`);
    }
  };

  // Format addresses to readable format
  const formatAddress = (address) => {
    if (!address) return "N/A";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Format gas values
  const formatGas = (gas) => {
    if (!gas) return "0";
    return parseInt(gas).toLocaleString();
  };

  // Format ETH values
  const formatEth = (wei) => {
    if (!wei) return "0";
    return (parseInt(wei) / 1e18).toFixed(6);
  };

  // Function to decode contract input data
  const decodeTransactionInput = (inputData, toAddress) => {
    if (!inputData || inputData === "0x" || inputData.length < 10) {
      return {
        decoded: false,
        message: "No input data or insufficient data to decode",
      };
    }

    try {
      const web3 = new Web3();
      
      // Determine which ABI to use based on contract address
      let contractABI = contractABIs.identityContractABI || [];
      let contractName = "Identity";

      // Map contract addresses to their ABIs
      const contractAddressMap = {
        // Replace with your actual deployed contract addresses
        [process.env.REACT_APP_IDENTITY_CONTRACT_ADDRESS?.toLowerCase()]: {
          name: "Identity",
          abi: contractABIs.identityContractABI
        },
        [process.env.REACT_APP_IDCARD_CONTRACT_ADDRESS?.toLowerCase()]: {
          name: "IDCard",
          abi: contractABIs.idCardContractABI
        },
        [process.env.REACT_APP_DOCUMENT_REGISTRY_CONTRACT_ADDRESS?.toLowerCase()]: {
          name: "DocumentRegistry",
          abi: contractABIs.documentRegistryContractABI
        }
      };

      // Select the right ABI based on the contract address
      if (toAddress && contractAddressMap[toAddress.toLowerCase()]) {
        contractABI = contractAddressMap[toAddress.toLowerCase()].abi;
        contractName = contractAddressMap[toAddress.toLowerCase()].name;
      }

      // Extract function signature (first 4 bytes after 0x)
      const functionSig = inputData.slice(0, 10);

      // Find matching function in the ABI
      const matchingFunction = contractABI.find((item) => {
        if (item.type !== "function") return false;
        const encodedSig = web3.eth.abi.encodeFunctionSignature(item);
        return encodedSig === functionSig;
      });

      if (!matchingFunction) {
        return {
          decoded: false,
          message: "Function signature not found in ABI",
          functionSig,
        };
      }

      // Decode parameters
      const parameterData = inputData.slice(10); // Remove function signature
      const params = web3.eth.abi.decodeParameters(
        matchingFunction.inputs,
        parameterData
      );

      // Format the decoded output
      const decodedParams = matchingFunction.inputs.map((input, index) => {
        return {
          name: input.name,
          type: input.type,
          value: params[index],
        };
      });

      return {
        decoded: true,
        functionName: matchingFunction.name,
        params: decodedParams,
        raw: inputData,
      };
    } catch (error) {
      console.error("Error decoding input data:", error);
      return {
        decoded: false,
        message: `Error decoding: ${error.message}`,
        raw: inputData,
      };
    }
  };

  // Fetch contract ABIs
  const fetchContractABIs = async () => {
    try {
      const response = await blockchainService.getContractABIs();
      if (response.success) {
        setContractABIs(response.data);
        console.log('Loaded contract ABIs from backend');
      }
    } catch (error) {
      console.error('Failed to load contract ABIs:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchBlocks();
    fetchContractABIs();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Ganache Blockchain Explorer</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchBlocks}
          disabled={refreshing}
        >
          <RefreshCw
            size={14}
            className={`mr-1 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <RefreshCw className="h-6 w-6 text-blue-500 animate-spin mr-2" />
          <span>Loading blockchain data...</span>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-8 gap-4 text-xs font-medium text-gray-500 uppercase">
              <div className="col-span-1">Block</div>
              <div className="col-span-2">Time</div>
              <div className="col-span-2">Transactions</div>
              <div className="col-span-2">Miner</div>
              <div className="col-span-1">Gas Used</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {blocks.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">
                No blocks found. Make sure Ganache is running.
              </div>
            ) : (
              blocks.map((block) => (
                <div key={block.number} className="hover:bg-gray-50">
                  {/* Block row */}
                  <div
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => fetchBlockDetails(block.number)}
                  >
                    <div className="grid grid-cols-8 gap-4 items-center">
                      <div className="col-span-1 flex items-center">
                        {expandedBlock === block.number ? (
                          <ChevronDown
                            size={16}
                            className="mr-1 text-blue-500"
                          />
                        ) : (
                          <ChevronRight
                            size={16}
                            className="mr-1 text-gray-400"
                          />
                        )}
                        <span className="font-mono font-medium text-blue-600">
                          #{block.number}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        <span className="text-sm">
                          {formatTimestamp(block.timestamp)}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                          {block.transactions?.length || 0} transactions
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Hash size={14} className="mr-1 text-gray-400" />
                        <span className="text-sm font-mono">
                          {formatAddress(block.miner)}
                        </span>
                      </div>
                      <div className="col-span-1 text-sm font-mono">
                        {formatGas(block.gasUsed)}
                      </div>
                    </div>
                  </div>

                  {/* Block details when expanded */}
                  {expandedBlock === block.number &&
                    blockDetails[block.number] && (
                      <div className="bg-gray-50 p-4 border-t border-gray-100">
                        <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Hash
                            </div>
                            <div className="font-mono break-all">
                              {blockDetails[block.number].hash}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Parent Hash
                            </div>
                            <div className="font-mono break-all">
                              {blockDetails[block.number].parentHash}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Nonce
                            </div>
                            <div className="font-mono">
                              {blockDetails[block.number].nonce}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Size
                            </div>
                            <div className="font-mono">
                              {parseInt(
                                blockDetails[block.number].size
                              ).toLocaleString()}{" "}
                              bytes
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Gas Limit
                            </div>
                            <div className="font-mono">
                              {formatGas(blockDetails[block.number].gasLimit)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Difficulty
                            </div>
                            <div className="font-mono">
                              {parseInt(
                                blockDetails[block.number].difficulty
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Transactions list */}
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">
                            Transactions (
                            {blockDetails[block.number].transactions?.length ||
                              0}
                            )
                          </h4>

                          {blockDetails[block.number].transactions?.length >
                          0 ? (
                            <div className="border border-gray-200 rounded-md overflow-hidden">
                              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                                <div className="grid grid-cols-8 gap-2 text-xs font-medium text-gray-500 uppercase">
                                  <div className="col-span-3">Hash</div>
                                  <div className="col-span-2">From → To</div>
                                  <div className="col-span-1">Value</div>
                                  <div className="col-span-2">Gas</div>
                                </div>
                              </div>
                              <div className="divide-y divide-gray-100">
                                {blockDetails[block.number].transactions.map(
                                  (tx) => (
                                    <div
                                      key={tx.hash}
                                      className="hover:bg-gray-50"
                                    >
                                      {/* Transaction row */}
                                      <div
                                        className="px-3 py-2 cursor-pointer"
                                        onClick={() =>
                                          fetchTransactionDetails(tx.hash)
                                        }
                                      >
                                        <div className="grid grid-cols-8 gap-2 items-center">
                                          <div className="col-span-3 flex items-center">
                                            {expandedTransaction === tx.hash ? (
                                              <ChevronDown
                                                size={14}
                                                className="mr-1 text-blue-500"
                                              />
                                            ) : (
                                              <ChevronRight
                                                size={14}
                                                className="mr-1 text-gray-400"
                                              />
                                            )}
                                            <span className="font-mono text-xs text-blue-600 truncate">
                                              {tx.hash}
                                            </span>
                                          </div>
                                          <div className="col-span-2 text-xs">
                                            <span className="font-mono">
                                              {formatAddress(tx.from)}
                                            </span>
                                            <span className="inline-block mx-1">
                                              →
                                            </span>
                                            <span className="font-mono">
                                              {formatAddress(tx.to)}
                                            </span>
                                          </div>
                                          <div className="col-span-1 flex items-center">
                                            <DollarSign
                                              size={12}
                                              className="mr-1 text-green-500"
                                            />
                                            <span className="text-xs font-mono">
                                              {formatEth(tx.value)} ETH
                                            </span>
                                          </div>
                                          <div className="col-span-2 text-xs font-mono">
                                            {formatGas(tx.gas)} gas
                                          </div>
                                        </div>
                                      </div>

                                      {/* Transaction details when expanded */}
                                      {expandedTransaction === tx.hash &&
                                        transactionDetails[tx.hash] && (
                                          <div className="bg-gray-50 p-3 border-t border-gray-100 ml-6">
                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                              <div>
                                                <div className="text-xs text-gray-500 mb-1">
                                                  From
                                                </div>
                                                <div className="font-mono break-all">
                                                  {
                                                    transactionDetails[tx.hash]
                                                      .from
                                                  }
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-xs text-gray-500 mb-1">
                                                  To
                                                </div>
                                                <div className="font-mono break-all">
                                                  {
                                                    transactionDetails[tx.hash]
                                                      .to
                                                  }
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-xs text-gray-500 mb-1">
                                                  Value
                                                </div>
                                                <div className="font-mono">
                                                  {formatEth(
                                                    transactionDetails[tx.hash]
                                                      .value
                                                  )}{" "}
                                                  ETH
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-xs text-gray-500 mb-1">
                                                  Gas Price
                                                </div>
                                                <div className="font-mono">
                                                  {formatGas(
                                                    transactionDetails[tx.hash]
                                                      .gasPrice
                                                  )}{" "}
                                                  wei
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-xs text-gray-500 mb-1">
                                                  Gas Used
                                                </div>
                                                <div className="font-mono">
                                                  {formatGas(
                                                    transactionDetails[tx.hash]
                                                      .gasUsed
                                                  )}{" "}
                                                  gas
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-xs text-gray-500 mb-1">
                                                  Nonce
                                                </div>
                                                <div className="font-mono">
                                                  {
                                                    transactionDetails[tx.hash]
                                                      .nonce
                                                  }
                                                </div>
                                              </div>
                                              <div className="col-span-2">
                                                <div className="flex items-center justify-between">
                                                  <div className="text-xs text-gray-500 mb-1">Input Data</div>
                                                  {transactionDetails[tx.hash].input !== "0x" && (
                                                    <button
                                                      onClick={() => setShowDecodedInput(!showDecodedInput)}
                                                      className="text-xs text-blue-600 hover:underline flex items-center"
                                                    >
                                                      <Code size={12} className="mr-1" />
                                                      {showDecodedInput ? "Show Raw" : "Decode Data"}
                                                    </button>
                                                  )}
                                                </div>
                                                
                                                {transactionDetails[tx.hash].input === "0x" ? (
                                                  <div className="text-xs text-gray-500 italic">No input data</div>
                                                ) : showDecodedInput ? (
                                                  <div className="font-mono text-xs bg-gray-100 p-3 rounded max-h-60 overflow-y-auto">
                                                    {(() => {
                                                      const decoded = decodeTransactionInput(
                                                        transactionDetails[tx.hash].input,
                                                        transactionDetails[tx.hash].to
                                                      );
                                                      
                                                      if (decoded.decoded) {
                                                        return (
                                                          <div>
                                                            <div className="text-blue-600 font-bold mb-1">
                                                              Function: {decoded.functionName}
                                                            </div>
                                                            <div className="space-y-1 mb-2">
                                                              {decoded.params.map((param, idx) => (
                                                                <div key={idx}>
                                                                  <span className="text-gray-500">{param.name} ({param.type}): </span>
                                                                  <span className="break-all">{String(param.value)}</span>
                                                                </div>
                                                              ))}
                                                            </div>
                                                          </div>
                                                        );
                                                      } else {
                                                        return (
                                                          <div>
                                                            <div className="text-yellow-600 mb-1">
                                                              {decoded.message}
                                                            </div>
                                                            <div className="break-all">
                                                              {transactionDetails[tx.hash].input}
                                                            </div>
                                                          </div>
                                                        );
                                                      }
                                                    })()}
                                                  </div>
                                                ) : (
                                                  <div className="font-mono text-xs break-all bg-gray-100 p-2 rounded max-h-20 overflow-y-auto">
                                                    {transactionDetails[tx.hash].input}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 italic">
                              No transactions in this block
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center">
          <Database size={14} className="mr-1" />
          <span>Ganache Local Blockchain</span>
        </div>
        <div>
          <a
            href="http://localhost:8545"
            target="_blank"
            rel="noreferrer"
            className="flex items-center text-blue-600 hover:underline"
          >
            Open RPC Endpoint
            <ExternalLink size={12} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestBlockchainExplorer;
