import { ethers } from "hardhat";
import { Contract } from "ethers";

/**
 * Deployment script for Piggy Boss DeFi platform
 * Deploys all contracts in the correct order and sets up initial configuration
 */
async function main() {
  console.log("🐷 Deploying Piggy Boss DeFi Platform...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Contract instances
  let mockUSDT: Contract;
  let nftRewards: Contract;
  let yieldManager: Contract;
  let piggyVault: Contract;

  try {
    // 1. Deploy MockUSDT (test token with faucet)
    console.log("\n📄 Deploying MockUSDT...");
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    mockUSDT = await MockUSDT.deploy();
    await mockUSDT.waitForDeployment();
    console.log("✅ MockUSDT deployed to:", await mockUSDT.getAddress());

    // 2. Deploy NFTRewards
    console.log("\n🎨 Deploying NFTRewards...");
    const baseURI = "https://api.piggyboss.finance/metadata/";
    const NFTRewards = await ethers.getContractFactory("NFTRewards");
    nftRewards = await NFTRewards.deploy(baseURI);
    await nftRewards.waitForDeployment();
    console.log("✅ NFTRewards deployed to:", await nftRewards.getAddress());

    // 3. Deploy YieldManager (with placeholder AI oracle)
    console.log("\n📊 Deploying YieldManager...");
    const aiOracleAddress = deployer.address; // Placeholder for AI oracle
    const YieldManager = await ethers.getContractFactory("YieldManager");
    yieldManager = await YieldManager.deploy(aiOracleAddress);
    await yieldManager.waitForDeployment();
    console.log("✅ YieldManager deployed to:", await yieldManager.getAddress());

    // 4. Deploy PiggyVault (main contract)
    console.log("\n🏦 Deploying PiggyVault...");
    const PiggyVault = await ethers.getContractFactory("PiggyVault");
    piggyVault = await PiggyVault.deploy(
      await mockUSDT.getAddress(),
      await yieldManager.getAddress(),
      await nftRewards.getAddress()
    );
    await piggyVault.waitForDeployment();
    console.log("✅ PiggyVault deployed to:", await piggyVault.getAddress());

    // 5. Setup contract relationships
    console.log("\n🔗 Setting up contract relationships...");
    
    // Set PiggyVault address in YieldManager
    await yieldManager.setPiggyVault(await piggyVault.getAddress());
    console.log("✅ YieldManager linked to PiggyVault");
    
    // Authorize PiggyVault to mint NFTs
    await nftRewards.authorizeMinter(await piggyVault.getAddress(), true);
    console.log("✅ PiggyVault authorized to mint NFTs");

    // Authorize YieldManager to mint NFTs for special rewards
    await nftRewards.authorizeMinter(await yieldManager.getAddress(), true);
    console.log("✅ YieldManager authorized to mint NFTs");

    // 6. Initial configuration
    console.log("\n⚙️ Setting up initial configuration...");
    
    // Add some initial funds to YieldManager reward pool
    const initialRewardPool = ethers.parseEther("10000"); // 10k tokens
    await mockUSDT.transfer(await yieldManager.getAddress(), initialRewardPool);
    console.log("✅ Initial reward pool funded");

    // Mint some tokens to deployer for testing
    const testTokens = ethers.parseUnits("1000", 6); // 1000 USDT (6 decimals)
    await mockUSDT.adminMint(deployer.address, testTokens);
    console.log("✅ Test tokens minted to deployer");

    // 7. Verification and summary
    console.log("\n📋 Deployment Summary:");
    console.log("=".repeat(50));
    console.log("MockUSDT Address:", await mockUSDT.getAddress());
    console.log("NFTRewards Address:", await nftRewards.getAddress());
    console.log("YieldManager Address:", await yieldManager.getAddress());
    console.log("PiggyVault Address:", await piggyVault.getAddress());
    console.log("=".repeat(50));

    // 8. Save deployment info to file
    const deploymentInfo = {
      network: "somnia",
      chainId: 50312,
      deployer: deployer.address,
      contracts: {
        MockUSDT: await mockUSDT.getAddress(),
        NFTRewards: await nftRewards.getAddress(),
        YieldManager: await yieldManager.getAddress(),
        PiggyVault: await piggyVault.getAddress()
      },
      deployedAt: new Date().toISOString(),
      transactionHashes: {
        // These would be filled with actual transaction hashes
      }
    };

    console.log("\n💾 Deployment info:");
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // 9. Test basic functionality
    console.log("\n🧪 Testing basic functionality...");
    
    // Test faucet
    const canClaim = await mockUSDT.canClaimFaucet(deployer.address);
    console.log("Can claim from faucet:", canClaim);
    
    // Test savings plans
    const plan30 = await piggyVault.savingsPlans(30);
    console.log("30-day plan APY:", plan30.apyBasisPoints.toString(), "basis points");
    
    // Test NFT categories
    const firstDepositNFT = await nftRewards.nftCategories("FIRST_DEPOSIT");
    console.log("First deposit NFT:", firstDepositNFT.name);

    console.log("\n🎉 Deployment completed successfully!");
    console.log("🌐 Network: Somnia Testnet (Chain ID: 50312)");
    console.log("🔗 Explorer: https://shannon-explorer.somnia.network");
    
    return {
      mockUSDT: await mockUSDT.getAddress(),
      nftRewards: await nftRewards.getAddress(),
      yieldManager: await yieldManager.getAddress(),
      piggyVault: await piggyVault.getAddress()
    };

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

// Handle script execution
if (require.main === module) {
  main()
    .then((addresses) => {
      console.log("\n📝 Contract addresses for frontend .env:");
      console.log(`VITE_MOCK_USDT_ADDRESS=${addresses.mockUSDT}`);
      console.log(`VITE_NFT_REWARDS_ADDRESS=${addresses.nftRewards}`);
      console.log(`VITE_YIELD_MANAGER_ADDRESS=${addresses.yieldManager}`);
      console.log(`VITE_PIGGY_VAULT_ADDRESS=${addresses.piggyVault}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

export default main;
