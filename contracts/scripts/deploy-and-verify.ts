import { ethers, run } from "hardhat";

async function main() {
  console.log("🐷 Deploying and Verifying Piggy Boss Contracts...\n");
  
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("📍 Network:", network.name, "(Chain ID:", Number(network.chainId), ")");
  console.log("👤 Deployer:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "SOM\n");

  // Use existing MockUSDT if available
  const existingMockUSDT = "0xeE0667c01DeFEBca6d753544D6C8Db80ceaAC9B6";
  console.log("📄 Using existing MockUSDT:", existingMockUSDT);
  
  // Deploy YieldManager
  console.log("\n1️⃣ Deploying YieldManager...");
  const YieldManager = await ethers.getContractFactory("YieldManager");
  const yieldManager = await YieldManager.deploy();
  await yieldManager.waitForDeployment();
  const yieldManagerAddress = await yieldManager.getAddress();
  console.log("✅ YieldManager deployed to:", yieldManagerAddress);
  
  // Deploy NFTRewards
  console.log("\n2️⃣ Deploying NFTRewards...");
  const NFTRewards = await ethers.getContractFactory("NFTRewards");
  const nftRewards = await NFTRewards.deploy();
  await nftRewards.waitForDeployment();
  const nftRewardsAddress = await nftRewards.getAddress();
  console.log("✅ NFTRewards deployed to:", nftRewardsAddress);
  
  // Deploy PiggyVault
  console.log("\n3️⃣ Deploying PiggyVault...");
  const PiggyVault = await ethers.getContractFactory("PiggyVault");
  const piggyVault = await PiggyVault.deploy(
    existingMockUSDT,
    yieldManagerAddress,
    nftRewardsAddress
  );
  await piggyVault.waitForDeployment();
  const piggyVaultAddress = await piggyVault.getAddress();
  console.log("✅ PiggyVault deployed to:", piggyVaultAddress);
  
  // Setup contract permissions
  console.log("\n⚙️ Setting up contract permissions...");
  
  try {
    console.log("🔗 Setting PiggyVault as authorized minter for NFTRewards...");
    const tx1 = await nftRewards.setAuthorizedMinter(piggyVaultAddress, true);
    await tx1.wait();
    console.log("✅ NFT minter authorization set");
  } catch (error: any) {
    console.log("⚠️ Failed to set NFT minter authorization:", error.message);
  }
  
  try {
    console.log("🔗 Connecting YieldManager to PiggyVault...");
    const tx2 = await yieldManager.setPiggyVault(piggyVaultAddress);
    await tx2.wait();
    console.log("✅ YieldManager connected to PiggyVault");
  } catch (error: any) {
    console.log("⚠️ Failed to connect YieldManager:", error.message);
  }
  
  // Verify contracts
  console.log("\n🔍 Verifying contracts on Somnia Network...");
  
  const contracts = [
    { name: "YieldManager", address: yieldManagerAddress, args: [] },
    { name: "NFTRewards", address: nftRewardsAddress, args: [] },
    { 
      name: "PiggyVault", 
      address: piggyVaultAddress, 
      args: [existingMockUSDT, yieldManagerAddress, nftRewardsAddress] 
    }
  ];
  
  for (const contract of contracts) {
    try {
      console.log(`🔍 Verifying ${contract.name}...`);
      await run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.args,
      });
      console.log(`✅ ${contract.name} verified successfully`);
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log(`✅ ${contract.name} already verified`);
      } else {
        console.log(`❌ Failed to verify ${contract.name}:`, error.message);
      }
    }
  }
  
  // Final summary
  console.log("\n🎉 Deployment and Verification Complete!");
  console.log("📋 Contract Addresses:");
  console.log(`   MockUSDT: ${existingMockUSDT}`);
  console.log(`   YieldManager: ${yieldManagerAddress}`);
  console.log(`   NFTRewards: ${nftRewardsAddress}`);
  console.log(`   PiggyVault: ${piggyVaultAddress}`);
  
  console.log("\n🔗 Frontend Integration:");
  console.log("Add these addresses to your frontend configuration:");
  console.log(`export const CONTRACTS = {`);
  console.log(`  MOCK_USDT: "${existingMockUSDT}",`);
  console.log(`  YIELD_MANAGER: "${yieldManagerAddress}",`);
  console.log(`  NFT_REWARDS: "${nftRewardsAddress}",`);
  console.log(`  PIGGY_VAULT: "${piggyVaultAddress}",`);
  console.log(`};`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
