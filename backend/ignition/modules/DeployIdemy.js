const { ethers } = require("hardhat");

async function main() {
  const IdemyIdentity = await ethers.getContractFactory("IdemyIdentity");
  const contract = await IdemyIdentity.deploy();
  await contract.deployed();
  console.log("IdemyIdentity deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });