# Backend for Blockchain-based Self-Sovereign Identity (SSI)

This project is the backend for a blockchain-based self-sovereign identity (SSI) system. It leverages blockchain technology, smart contracts, and decentralized storage to provide a secure and decentralized identity management solution.

## Features

- **Blockchain Integration**: Uses Ethereum-compatible blockchain for identity management.
- **Smart Contracts**: Implements smart contracts for identity and document linking.
- **Decentralized Storage**: Supports IPFS for storing identity-related data.
- **JWT Authentication**: Secures API endpoints with JSON Web Tokens.
- **Firebase Integration**: Provides additional backend services like notifications and analytics.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Ganache](https://trufflesuite.com/ganache/) (for local blockchain development)
- [Truffle](https://trufflesuite.com/truffle/) (for smart contract management)
- [IPFS](https://ipfs.tech/) (for decentralized storage)

---

## Setup Instructions

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/idemy-blockchain-dev.git
    cd idemy-blockchain-dev/backend
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Configure Environment Variables**:
    Create a `.env` file in the `backend` directory and configure the following variables:
    ```env
    PORT=3000
    NODE_ENV=development
    JWT_SECRET=your-jwt-secret-key
    BLOCKCHAIN_PROVIDER=http://127.0.0.1:8545
    BLOCKCHAIN_NETWORK_ID=1337
    DEPLOYER_ADDRESS=your-deployer-address
    DEPLOYER_PRIVATE_KEY=your-deployer-private-key
    ```

4. **Start Ganache**:
    Run Ganache to simulate a local Ethereum blockchain:
    ```bash
    npm run ganache
    ```

5. **Compile Smart Contracts**:
    Navigate to the blockchain directory and compile the contracts:
    ```bash
    cd src/blockchain
    npx truffle compile
    ```

6. **Deploy Smart Contracts**:
    Deploy the contracts to the local blockchain:
    ```bash
    npx truffle migrate --network development
    ```

---

## Running the Backend

1. **Start the Development Server**:
    ```bash
    npm run dev
    ```

2. **Access the API**:
    The backend will be available at `http://localhost:3000`.

---

## Testing

Run the test suite to ensure everything is working correctly:
```bash
npm test
```

---

## Project Structure

```
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

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

---

## Contact

For questions or support, please contact [your-email@example.com].  