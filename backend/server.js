require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Load environment variables from .env (RPC URL, PRIVATE_KEY, CONTRACT_ADDRESS, PORT)
const RPC_URL = process.env.RPC_URL; // e.g., "https://your-rpc-url"
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PORT = process.env.PORT || 5000;

// Specify the network details and set ensAddress to null to disable ENS resolution
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Load the contract ABI from the Hardhat artifact
const artifactPath = path.join(__dirname, "artifacts", "contracts", "IdemyIdentity.sol", "IdemyIdentity.json");
const contractArtifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
const contractABI = contractArtifact.abi;

// Create contract instance with wallet signer
const idemyContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

// API Endpoint: Create Identity
app.post("/create-identity", async (req, res) => {
  try {
    const { name, university, email } = req.body;
    console.log("Creating identity with:", name, university, email);
    const tx = await idemyContract.createIdentity(name, university, email);
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    res.json({ status: "Success", txHash: tx.hash });
  } catch (error) {
    console.error("Error creating identity:", error);
    res.status(500).json({ status: "Error", error: error.message });
  }
});

// API Endpoint: Get Student Identity
app.get("/get-student/:address", async (req, res) => {
  try {
    const studentAddress = req.params.address;
    console.log("Fetching identity for:", studentAddress);
    const details = await idemyContract.getStudent(studentAddress);
    const [name, university, email, reputation] = details;
    res.json({ name, university, email, reputation: reputation.toNumber() });
  } catch (error) {
    console.error("Error fetching identity:", error);
    res.status(500).json({ status: "Error", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});