const Identity = artifacts.require("Identity");
const IDCard = artifacts.require("IDCard");
const DocumentRegistry = artifacts.require("DocumentRegistry");

module.exports = async function(deployer, network, accounts) {
  // Deploy Identity contract
  await deployer.deploy(Identity);
  const identityInstance = await Identity.deployed();
  console.log("Identity contract deployed to:", identityInstance.address);
  
  // Deploy IDCard contract with Identity address
  await deployer.deploy(IDCard, identityInstance.address);
  const idCardInstance = await IDCard.deployed();
  console.log("IDCard contract deployed to:", idCardInstance.address);
  
  // Deploy DocumentRegistry contract
  await deployer.deploy(DocumentRegistry);
  const documentRegistryInstance = await DocumentRegistry.deployed();
  console.log("DocumentRegistry contract deployed to:", documentRegistryInstance.address);
  
  // Write contract addresses to console for configuration
  console.log("\nContract Addresses for .env configuration:");
  console.log(`IDENTITY_CONTRACT_ADDRESS=${identityInstance.address}`);
  console.log(`IDCARD_CONTRACT_ADDRESS=${idCardInstance.address}`);
  console.log(`DOCUMENT_REGISTRY_CONTRACT_ADDRESS=${documentRegistryInstance.address}`);
};