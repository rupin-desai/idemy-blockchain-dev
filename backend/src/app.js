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
const devAuthRoutes = require('./api/routes/dev-auth.routes');

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

    return { firebaseAdmin, web3 };
  } catch (error) {
    logger.error("Error during services initialization:", error);
    throw error;
  }
};

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
  app.use('/api/dev-auth', devAuthRoutes);
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
