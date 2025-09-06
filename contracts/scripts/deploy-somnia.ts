import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🐷 Starting Piggy Boss deployment to Somnia Network...");
  
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log(`📍 Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`👤 Deployer: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} SOM`);
  
  if (balance === 0n) {
    throw new Error("❌ Deployer has no SOM tokens for gas fees");
  }
  
  console.log("\n📄 Deploying contracts...");
  
  console.log("1️⃣ Deploying MockUSDT...");
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.waitForDeployment();
  const mockUSDTAddress = await mockUSDT.getAddress();
  console.log(`✅ MockUSDT deployed to: ${mockUSDTAddress}`);
  
  console.log("2️⃣ Deploying YieldManager...");
  const YieldManager = await ethers.getContractFactory("YieldManager");
  const yieldManager = await YieldManager.deploy();
  await yieldManager.waitForDeployment();
  const yieldManagerAddress = await yieldManager.getAddress();
  console.log(`✅ YieldManager deployed to: ${yieldManagerAddress}`);
  
  console.log("3️⃣ Deploying NFTRewards...");
  const NFTRewards = await ethers.getContractFactory("NFTRewards");
  const nftRewards = await NFTRewards.deploy();
  await nftRewards.waitForDeployment();
  const nftRewardsAddress = await nftRewards.getAddress();
  console.log(`✅ NFTRewards deployed to: ${nftRewardsAddress}`);

  console.log("4️⃣ Deploying PiggyVault...");
  const PiggyVault = await ethers.getContractFactory("PiggyVault");
  const piggyVault = await PiggyVault.deploy(
    mockUSDTAddress,
    yieldManagerAddress,
    nftRewardsAddress
  );
  await piggyVault.waitForDeployment();
  const piggyVaultAddress = await piggyVault.getAddress();
  console.log(`✅ PiggyVault deployed to: ${piggyVaultAddress}`);
  
  console.log("\n⚙️ Setting up contract permissions...");
  
  try {
    console.log("🔗 Setting PiggyVault as authorized minter for NFTRewards...");
    const tx1 = await nftRewards.setAuthorizedMinter(piggyVaultAddress, true);
    await tx1.wait();
    console.log("✅ NFT minter authorization set");
  } catch (error) {
    console.log("⚠️ Failed to set NFT minter authorization:", error);
  }
  
  try {
    console.log("🔗 Connecting YieldManager to PiggyVault...");
    const tx2 = await yieldManager.setPiggyVault(piggyVaultAddress);
    await tx2.wait();
    console.log("✅ YieldManager connected to PiggyVault");
  } catch (error) {
    console.log("⚠️ Failed to connect YieldManager:", error);
  }
  
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      MockUSDT: mockUSDTAddress,
      YieldManager: yieldManagerAddress,
      NFTRewards: nftRewardsAddress,
      PiggyVault: piggyVaultAddress,
    },
    savingsPlans: [
      { id: 0, duration: "7 days", apy: "5%" },
      { id: 1, duration: "14 days", apy: "8%" },
      { id: 2, duration: "30 days", apy: "12%" },
      { id: 3, duration: "90 days", apy: "18%" },
    ],
  };
  
  const deploymentsDir = path.join(__dirname, "../deployments");
  const networkDir = path.join(deploymentsDir, network.name);
  
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  if (!fs.existsSync(networkDir)) {
    fs.mkdirSync(networkDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(networkDir, "deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Contract Addresses:");
  console.log(`   MockUSDT: ${mockUSDTAddress}`);
  console.log(`   YieldManager: ${yieldManagerAddress}`);
  console.log(`   NFTRewards: ${nftRewardsAddress}`);
  console.log(`   PiggyVault: ${piggyVaultAddress}`);
  
  console.log("\n🔗 Frontend Integration:");
  console.log("Add these addresses to your frontend configuration:");
  console.log(`export const CONTRACTS = {`);
  console.log(`  PIGGY_VAULT: "${piggyVaultAddress}",`);
  console.log(`  YIELD_MANAGER: "${yieldManagerAddress}",`);
  console.log(`  NFT_REWARDS: "${nftRewardsAddress}",`);
  console.log(`  MOCK_USDT: "${mockUSDTAddress}",`);
  console.log(`  CHAIN_ID: ${network.chainId},`);
  console.log(`}`);
  
  if (network.chainId === 50312n) {
    console.log("\n🔍 Verification Commands:");
    console.log("Run these commands to verify contracts:");
    console.log(`npx hardhat verify --network somnia ${mockUSDTAddress}`);
    console.log(`npx hardhat verify --network somnia ${yieldManagerAddress}`);
    console.log(`npx hardhat verify --network somnia ${nftRewardsAddress}`);
    console.log(`npx hardhat verify --network somnia ${piggyVaultAddress} "${mockUSDTAddress}" "${yieldManagerAddress}" "${nftRewardsAddress}"`);
  }
  
  console.log(`\n📁 Deployment info saved to: ${path.join(networkDir, "deployment.json")}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
