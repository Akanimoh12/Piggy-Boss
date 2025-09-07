import { ethers } from "hardhat"

async function main() {
  console.log("🐷 Redeploying PiggyVault with correct USDT decimals to Somnia...")

  // Get the deployer
  const [deployer] = await ethers.getSigners()
  if (!deployer) {
    throw new Error("No deployer account found")
  }
  console.log("Deploying with account:", deployer.address)

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address)
  console.log("Deployer balance:", ethers.formatEther(balance), "SOM")

  // Existing contract addresses on Somnia (keep the working ones)
  const MOCK_USDT = "0xeE0667c01DeFEBca6d753544D6C8Db80ceaAC9B6"
  const YIELD_MANAGER = "0x53538F8b7cF6e3022E91C3742DD32672d1dBE0bE"
  const NFT_REWARDS = "0x1Bd4FE7221e4796039c3F5eeD98ec80A84A36667"

  console.log("Using existing contracts on Somnia:")
  console.log("MockUSDT:", MOCK_USDT)
  console.log("YieldManager:", YIELD_MANAGER)
  console.log("NFTRewards:", NFT_REWARDS)

  // Deploy new PiggyVault with fixed decimals
  console.log("\n🏦 Deploying new PiggyVault with 6 decimals...")
  const PiggyVault = await ethers.getContractFactory("PiggyVault")
  const piggyVault = await PiggyVault.deploy(
    MOCK_USDT,
    YIELD_MANAGER,
    NFT_REWARDS
  )

  console.log("⏳ Waiting for deployment...")
  await piggyVault.waitForDeployment()

  const address = await piggyVault.getAddress()
  console.log("✅ PiggyVault deployed to:", address)

  // Wait for a few block confirmations
  console.log("⏳ Waiting for block confirmations...")
  await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds

  console.log("\n🧪 Testing savings plan (30 days)...")
  try {
    const plan30 = await piggyVault.savingsPlans(30)
    if (plan30) {
      console.log("Min amount:", plan30.minAmount.toString(), "(should be 10000000 for 10 USDT)")
      console.log("Max amount:", plan30.maxAmount.toString(), "(should be 1000000000 for 1000 USDT)")
      
      if (plan30.minAmount.toString() === "10000000") {
        console.log("✅ Decimals fixed correctly! Contract uses 6 decimals.")
      } else {
        console.log("❌ Decimals still incorrect:", plan30.minAmount.toString())
      }
    }
  } catch (error) {
    console.log("⚠️  Could not test savings plan:", error)
  }

  console.log("\n🎉 Deployment completed!")
  console.log("\n📋 Updated Contract Addresses for Somnia:")
  console.log("MockUSDT:", MOCK_USDT)
  console.log("YieldManager:", YIELD_MANAGER)  
  console.log("NFTRewards:", NFT_REWARDS)
  console.log("PiggyVault:", address, "(NEW - FIXED DECIMALS)")

  console.log("\n📝 Next steps:")
  console.log("1. Update frontend contracts.ts with new PiggyVault address")
  console.log("2. Verify contract on Somnia explorer")
  console.log("3. Test savings functionality with correct decimals")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
