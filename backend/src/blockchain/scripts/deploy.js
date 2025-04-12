const Web3 = require('web3');
const path = require('path');
const fs = require('fs-extra');

async function deploy() {
  try {
    console.log("Creating Web3 instance...");
    // Create Web3 instance
    const web3 = new Web3('http://127.0.0.1:8545');
    
    // Test connection
    console.log("Testing connection to Ganache...");
    const networkId = await web3.eth.net.getId();
    console.log("Connected to network ID:", networkId);
    
    // Get accounts
    console.log("Getting accounts...");
    const accounts = await web3.eth.getAccounts();
    console.log('Available accounts:', accounts);
    
    const deployer = accounts[0];
    console.log('Deploying from account:', deployer);
    
    // Check balance
    const balance = await web3.eth.getBalance(deployer);
    console.log('Account balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
    
    // Load contract artifacts
    console.log("Loading contract artifacts...");
    const buildPath = path.resolve(__dirname, '../build/contracts');
    
    const Identity = require(path.join(buildPath, 'Identity.json'));
    const IDCard = require(path.join(buildPath, 'IDCard.json'));
    const DocumentRegistry = require(path.join(buildPath, 'DocumentRegistry.json'));
    
    // Deploy Identity contract
    console.log('Deploying Identity contract...');
    const identityContract = new web3.eth.Contract(Identity.abi);
    const identity = await identityContract.deploy({
      data: Identity.bytecode
    }).send({
      from: deployer,
      gas: 3000000
    });
    console.log('Identity contract deployed at:', identity.options.address);
    
    // Deploy IDCard contract
    console.log('Deploying IDCard contract...');
    const idCardContract = new web3.eth.Contract(IDCard.abi);
    const idCard = await idCardContract.deploy({
      data: IDCard.bytecode,
      arguments: [identity.options.address]
    }).send({
      from: deployer,
      gas: 3000000
    });
    console.log('IDCard contract deployed at:', idCard.options.address);
    
    // Deploy DocumentRegistry contract
    console.log('Deploying DocumentRegistry contract...');
    const docRegistryContract = new web3.eth.Contract(DocumentRegistry.abi);
    const docRegistry = await docRegistryContract.deploy({
      data: DocumentRegistry.bytecode
    }).send({
      from: deployer,
      gas: 3000000
    });
    console.log('DocumentRegistry contract deployed at:', docRegistry.options.address);
    
    console.log('\n======= Contract Addresses =======');
    console.log(`IDENTITY_CONTRACT_ADDRESS=${identity.options.address}`);
    console.log(`IDCARD_CONTRACT_ADDRESS=${idCard.options.address}`);
    console.log(`DOCUMENT_REGISTRY_CONTRACT_ADDRESS=${docRegistry.options.address}`);
    console.log('==================================\n');
    
  } catch (error) {
    console.error('Deployment error:', error);
  }
}

// Execute deploy function
deploy();