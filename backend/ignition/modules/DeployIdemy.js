const { ethers } = require("hardhat");

async function main() {
  const IdemyIdentity = await ethers.getContractFactory("IdemyIdentity");
  const contract = await IdemyIdentity.deploy();
  // For ethers v6, use waitForDeployment() instead of deployed()
  await contract.waitForDeployment();
  console.log("IdemyIdentity deployed to:", contract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });