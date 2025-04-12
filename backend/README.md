# 🌐 Backend for Blockchain-based Self-Sovereign Identity (SSI)

This project serves as the backend for a blockchain-based self-sovereign identity (SSI) system. It leverages cutting-edge technologies like blockchain, smart contracts, and decentralized storage to provide a secure and decentralized identity management solution.

---

## ✨ Features

| Feature                       | Description                                                            |
| ----------------------------- | ---------------------------------------------------------------------- |
| 🔗 **Blockchain Integration** | Uses Ethereum-compatible blockchain for identity management.           |
| 📜 **Smart Contracts**        | Implements smart contracts for identity and document linking.          |
| 📂 **Decentralized Storage**  | Supports IPFS for storing identity-related data.                       |
| 🔒 **JWT Authentication**     | Secures API endpoints with JSON Web Tokens.                            |
| 🔔 **Firebase Integration**   | Provides additional backend services like notifications and analytics. |

---

## 📡 API Documentation

### Authentication APIs

| Method | Endpoint                   | Description         | Auth Required | Request Body                                  | Response             |
| ------ | -------------------------- | ------------------- | ------------- | --------------------------------------------- | -------------------- |
| POST   | `/api/auth/register`       | Register new user   | No            | `{email, password, displayName, phoneNumber}` | User data with token |
| POST   | `/api/auth/login`          | Login user          | No            | `{email, password}`                           | User data with token |
| POST   | `/api/auth/reset-password` | Reset password      | No            | `{email}`                                     | Success message      |
| GET    | `/api/auth/profile`        | Get user profile    | Yes           | -                                             | User profile data    |
| PUT    | `/api/auth/profile`        | Update user profile | Yes           | `{displayName, phoneNumber}`                  | Updated profile data |

### Identity APIs

| Method | Endpoint                    | Description         | Auth Required | Request Body                                          | Response                     |
| ------ | --------------------------- | ------------------- | ------------- | ----------------------------------------------------- | ---------------------------- |
| POST   | `/api/identity/`            | Create new identity | Yes           | `{personalInfo, address, contactInfo, walletAddress}` | Identity data                |
| GET    | `/api/identity/my-identity` | Get user's identity | Yes           | -                                                     | Identity data                |
| GET    | `/api/identity/:did`        | Get identity by DID | Yes           | -                                                     | Identity data                |
| PUT    | `/api/identity/:did`        | Update identity     | Yes           | `{address, contactInfo}`                              | Updated identity data        |
| PUT    | `/api/identity/:did/verify` | Verify identity     | Yes (Issuer)  | `{status, notes}`                                     | Verification result          |
| GET    | `/api/identity/`            | List identities     | Yes (Admin)   | Query params: `status, page, limit`                   | Paginated list of identities |

### Document APIs

| Method | Endpoint                                | Description             | Auth Required | Request Body/Params                                                   | Response                      |
| ------ | --------------------------------------- | ----------------------- | ------------- | --------------------------------------------------------------------- | ----------------------------- |
| POST   | `/api/document/`                        | Create new document     | Yes (Issuer)  | Multipart: `{did, documentType, name, description, expiryDate, file}` | Document data                 |
| GET    | `/api/document/:documentId`             | Get document by ID      | Yes           | Path param: `documentId`                                              | Document data                 |
| GET    | `/api/document/verify/:documentId`      | Verify document         | No            | Path param: `documentId`                                              | Verification status           |
| DELETE | `/api/document/:documentId/revoke`      | Revoke document         | Yes           | Path param: `documentId`                                              | Revocation result             |
| GET    | `/api/document/user/documents`          | List user documents     | Yes           | -                                                                     | Array of user's documents     |
| GET    | `/api/document/identity/:did/documents` | List identity documents | Yes           | Path param: `did`                                                     | Array of identity's documents |

### NFT APIs

| Method | Endpoint                             | Description          | Auth Required | Request Body/Params                | Response             |
| ------ | ------------------------------------ | -------------------- | ------------- | ---------------------------------- | -------------------- |
| POST   | `/api/nft/mint/:did`                 | Mint ID Card NFT     | Yes           | Path param: `did`                  | NFT minting data     |
| POST   | `/api/nft/:tokenId/link/:documentId` | Link document to NFT | Yes           | Path params: `tokenId, documentId` | Linking result       |
| GET    | `/api/nft/identity/:did`             | Get ID Card details  | Yes           | Path param: `did`                  | ID Card NFT details  |
| GET    | `/api/nft/token/:did`                | Get token by DID     | Yes           | Path param: `did`                  | Token ID information |

### Blockchain APIs

| Method | Endpoint                                  | Description        | Auth Required | Request Body/Params   | Response               |
| ------ | ----------------------------------------- | ------------------ | ------------- | --------------------- | ---------------------- |
| GET    | `/api/blockchain/info`                    | Get network info   | No            | -                     | Network details        |
| GET    | `/api/blockchain/wallet/balance/:address` | Get wallet balance | Yes           | Path param: `address` | Wallet balance         |
| POST   | `/api/blockchain/wallet/create`           | Create new wallet  | Yes           | -                     | New wallet credentials |
| POST   | `/api/blockchain/send`                    | Send transaction   | Yes           | `{to, value}`         | Transaction receipt    |

---

## ⚙️ Prerequisites

Ensure you have the following installed before setting up the project:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Ganache](https://trufflesuite.com/ganache/) (for local blockchain development)
- [Truffle](https://trufflesuite.com/truffle/) (for smart contract management)
- [IPFS](https://ipfs.tech/) (for decentralized storage)

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/idemy-blockchain-dev.git
cd idemy-blockchain-dev/backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the `backend` directory and configure the following variables:

```properties
PORT=3000
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key
BLOCKCHAIN_PROVIDER=http://127.0.0.1:8545
BLOCKCHAIN_NETWORK_ID=1337
DEPLOYER_ADDRESS=your-deployer-address
DEPLOYER_PRIVATE_KEY=your-deployer-private-key
```

### 4️⃣ Start Ganache

Run Ganache to simulate a local Ethereum blockchain:

```bash
npm run ganache
```

### 5️⃣ Compile Smart Contracts

Navigate to the blockchain directory and compile the contracts:

```bash
cd src/blockchain
npx truffle compile
```

### 6️⃣ Deploy Smart Contracts

Deploy the contracts to the local blockchain:

```bash
npx truffle migrate --network development
```

---

## 🏃‍♂️ Running the Backend

### Start the Development Server

```bash
npm run dev
```

### Access the API

The backend will be available at:  
🌐 `http://localhost:3000`

---

## 🧪 Testing

Run the test suite to ensure everything is working correctly:

```bash
npm test
```

---

## 📂 Project Structure

```plaintext
backend/
├── src/
│   ├── app.js          # Main application entry point
│   ├── blockchain/     # Smart contracts and blockchain-related code
│   ├── controllers/    # API controllers
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
├── .env                # Environment variables
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

---

## 📧 Contact

For questions or support, please contact:  
✉️ [your-email@example.com]

---

## 🛠️ Technologies Used

| Technology      | Purpose                                  |
| --------------- | ---------------------------------------- |
| 🛠️ **Node.js**  | Backend runtime environment.             |
| 📦 **npm**      | Dependency management.                   |
| 🔗 **Truffle**  | Smart contract management.               |
| 🌐 **Ganache**  | Local Ethereum blockchain simulation.    |
| 📂 **IPFS**     | Decentralized storage for identity data. |
| 🔒 **JWT**      | Secure API authentication.               |
| 🔔 **Firebase** | Notifications and analytics.             |

---

## 🌟 Acknowledgments

Special thanks to the open-source community for providing the tools and libraries that made this project possible. Backend for Blockchain-based Self-Sovereign Identity (SSI)

This project is the backend for a blockchain-based self-sovereign identity (SSI) system. It leverages blockchain technology, smart contracts, and decentralized storage to provide a secure and decentralized identity management solution.
