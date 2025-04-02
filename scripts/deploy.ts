import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  const Upload = await ethers.getContractFactory("Upload");
  console.log("Contract factory created...");

  const upload = await Upload.deploy(); // Deploying contract
  console.log("Waiting for deployment...");

  await upload.waitForDeployment();
  console.log(`Upload deployed successfully to: ${await upload.getAddress()}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
