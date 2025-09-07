import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"

const redeployPiggyVault: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  log("🐷 Redeploying PiggyVault with correct USDT decimals...")
  log(`Deploying to network: ${network.name}`)
  log(`Deployer address: ${deployer}`)

  // Get existing contract addresses
  const mockUSDT = await get("MockUSDT")
  const yieldManager = await get("YieldManager")
  const nftRewards = await get("NFTRewards")

  log(`Using existing MockUSDT: ${mockUSDT.address}`)
  log(`Using existing YieldManager: ${yieldManager.address}`)
  log(`Using existing NFTRewards: ${nftRewards.address}`)

  // Redeploy PiggyVault with fixed decimals
  log("\n🏦 Redeploying PiggyVault...")
  const piggyVault = await deploy("PiggyVault", {
    from: deployer,
    args: [
      mockUSDT.address,
      yieldManager.address,
      nftRewards.address,
    ],
    log: true,
    waitConfirmations: network.live ? 5 : 1,
  })

  // Update YieldManager to point to new PiggyVault
  log("\n🔗 Updating YieldManager with new PiggyVault address...")
  const yieldManagerContract = await ethers.getContractAt("YieldManager", yieldManager.address)
  
  try {
    const tx = await yieldManagerContract.setPiggyVault(piggyVault.address)
    await tx.wait()
    log(`✅ YieldManager updated with new PiggyVault: ${piggyVault.address}`)
  } catch (error) {
    log(`⚠️  Could not update YieldManager (may not be owner): ${error}`)
  }

  // Update NFTRewards to point to new PiggyVault
  log("\n🎁 Updating NFTRewards with new PiggyVault address...")
  const nftRewardsContract = await ethers.getContractAt("NFTRewards", nftRewards.address)
  
  try {
    const tx = await nftRewardsContract.setPiggyVault(piggyVault.address)
    await tx.wait()
    log(`✅ NFTRewards updated with new PiggyVault: ${piggyVault.address}`)
  } catch (error) {
    log(`⚠️  Could not update NFTRewards (may not be owner): ${error}`)
  }

  // Log new deployment details
  log("\n🎉 PiggyVault redeployment completed!")
  log(`New PiggyVault address: ${piggyVault.address}`)
  log("\n📋 Updated Contract Addresses:")
  log(`MockUSDT: ${mockUSDT.address}`)
  log(`YieldManager: ${yieldManager.address}`)
  log(`NFTRewards: ${nftRewards.address}`)
  log(`PiggyVault: ${piggyVault.address} (NEW)`)

  // Verify contracts if on live network
  if (network.live) {
    log("\n🔍 Verifying PiggyVault contract...")
    try {
      await hre.run("verify:verify", {
        address: piggyVault.address,
        constructorArguments: [
          mockUSDT.address,
          yieldManager.address,
          nftRewards.address,
        ],
      })
      log("✅ PiggyVault verified successfully")
    } catch (error) {
      log(`⚠️  Verification failed: ${error}`)
    }
  }
}

export default redeployPiggyVault
redeployPiggyVault.tags = ["PiggyVault", "redeploy"]
redeployPiggyVault.dependencies = ["MockUSDT", "YieldManager", "NFTRewards"]
