const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  jwt: {
    secret: process.env.JWT_SECRET || "jwt-secret-key",
    expiry: parseInt(process.env.JWT_EXPIRY) || 86400, // 24 hours in seconds
  },
  corsOptions: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
};
