// Import dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
// Removed rate-limit

// Import routes
const authRoutes = require("./api/routes/auth.routes");
const identityRoutes = require("./api/routes/identity.routes");
const documentRoutes = require("./api/routes/document.routes");
const nftRoutes = require("./api/routes/nft.routes");
const blockchainRoutes = require("./api/routes/blockchain.routes");
const adminRoutes = require("./api/routes/admin.routes");
const devAuthRoutes = require("./api/routes/dev-auth.routes");

// Import utilities
const { AppError } = require("./utils/error-handler.util");
const logger = require("./utils/logger.util");

// Import configurations
const appConfig = require("./config/app.config");

// Initialize services if needed before app starts
const initializeServices = async () => {
  try {
    // Initialize Firebase
    logger.info("Initializing Firebase...");
    const initializeFirebase = require("./config/firebase.config");
    const firebaseAdmin = initializeFirebase();
    logger.info("Firebase initialized successfully");

    // Make Firebase service available to request handlers
    app.locals.firebase = require("./services/firebase.service");

    // Initialize IPFS service if needed at startup
    logger.info("Initializing IPFS connection...");
    const ipfsService = require("./services/ipfs.service");
    const ipfsConnection = await ipfsService.testConnection();
    logger.info("IPFS connection successful:", ipfsConnection);

    // Initialize blockchain connection
    logger.info("Initializing Blockchain connection...");
    const { web3 } = require("./blockchain/services/blockchain.service");
    const networkId = await web3.eth.net.getId();
    logger.info(`Connected to blockchain network ID: ${networkId}`);

    // Test contract functionality
    logger.info("Testing blockchain contracts...");
    await testBlockchainContracts();

    return { firebaseAdmin, web3 };
  } catch (error) {
    logger.error("Error during services initialization:", error);
    throw error;
  }
};

/**
 * Test if blockchain contracts are properly initialized and accessible
 */
async function testBlockchainContracts() {
  try {
    // Import blockchain service
    const blockchainService = require("./blockchain/services/blockchain.service");

    // Access contracts directly
    const identityContract = blockchainService.identityContract;
    const idCardContract = blockchainService.idCardContract;
    const documentRegistryContract = blockchainService.documentRegistryContract;

    // Test Identity Contract with public methods
    logger.info(`Testing Identity Contract...`);
    if (!identityContract) {
      logger.error("Identity contract not initialized!");
      return;
    }

    try {
      // Test didExists which is a public method in Identity.sol
      const testDid = "did:ethr:0x0000000000000000000000000000000000000000";
      const exists = await identityContract.methods.didExists(testDid).call();
      logger.info(`Identity Contract didExists check result: ${exists}`);
    } catch (error) {
      logger.error(
        `Error calling view function on Identity Contract: ${error.message}`
      );
    }

    // Test IDCard Contract with public methods
    logger.info(`Testing IDCard Contract...`);
    if (!idCardContract) {
      logger.error("IDCard contract not initialized!");
      return;
    }

    try {
      // Get a fake DID to test with
      const testDid = "did:ethr:0x0000000000000000000000000000000000000001";

      // Test if a fake token exists by trying to get it (will fail but tests connectivity)
      try {
        const fakeTokenId = 9999;
        await idCardContract.methods.ownerOf(fakeTokenId).call();
      } catch (err) {
        // This is expected to fail with "invalid token ID" which confirms contract works
        logger.info(
          `IDCard Contract test - expected error confirms contract connectivity: ${err.message.includes("invalid token ID")}`
        );
      }
    } catch (error) {
      logger.error(`Error testing IDCard Contract: ${error.message}`);
    }

    // Test Document Registry Contract
    logger.info(`Testing Document Registry Contract...`);
    if (!documentRegistryContract) {
      logger.error("Document Registry contract not initialized!");
      return;
    }

    try {
      // Get the available methods from the contract
      const availableMethods = Object.keys(documentRegistryContract.methods)
        .filter(
          (key) =>
            typeof documentRegistryContract.methods[key] === "function" &&
            key !== "call"
        )
        .join(", ");

      logger.info(`Available DocumentRegistry methods: ${availableMethods}`);

      // Try to use one of the available methods instead
      // This could be verifyDocument, registerDocument, etc.
      // For now, just check if the contract is properly initialized
      if (availableMethods.length > 0) {
        logger.info("Document Registry contract is properly initialized");
      } else {
        logger.warn("Document Registry contract has no available methods");
      }
    } catch (error) {
      logger.error(
        `Error testing Document Registry Contract: ${error.message}`
      );
    }

    logger.info("Contract tests completed");
  } catch (error) {
    logger.error(`Error testing blockchain contracts: ${error.message}`);
  }
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS handling
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Set up request logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Removed rate limiter

// Basic health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Set up API routes
app.use("/api/auth", authRoutes);
app.use("/api/identity", identityRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/nft", nftRoutes);
app.use("/api/blockchain", blockchainRoutes);

if (process.env.NODE_ENV === "development") {
  app.use("/api/admin", adminRoutes);
  app.use("/api/dev-auth", devAuthRoutes);
}

// 404 handler for undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  logger.error(`${err.statusCode} - ${err.message}`, { url: req.originalUrl });

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Process-level error handling
process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT EXCEPTION:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  logger.error("UNHANDLED REJECTION:", error);
  process.exit(1);
});

// Start the server with proper initialization
(async () => {
  try {
    // Initialize services before starting the server
    await initializeServices();

    // Start the server
    app.listen(PORT, () => {
      logger.info(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
      logger.info("Contract addresses:");
      logger.info(`- Identity: ${process.env.IDENTITY_CONTRACT_ADDRESS}`);
      logger.info(`- IDCard: ${process.env.IDCARD_CONTRACT_ADDRESS}`);
      logger.info(
        `- DocumentRegistry: ${process.env.DOCUMENT_REGISTRY_CONTRACT_ADDRESS}`
      );
      logger.info("SSI Blockchain platform is ready!");
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
})();

module.exports = app; // For testing purposes
