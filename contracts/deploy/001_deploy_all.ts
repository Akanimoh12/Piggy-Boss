/**
 * Deploy Script for Piggy Boss Contracts
 * 
 * Deploys all smart contracts in the correct order and sets up
 * initial configurations for the Piggy Boss DeFi platform.
 */

import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"

const deployAll: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("🐷 Starting Piggy Boss deployment...")
  log(`Deploying to network: ${network.name}`)
  log(`Deployer address: ${deployer}`)

  // Get deployer balance
  const deployerBalance = await ethers.provider.getBalance(deployer)
  log(`Deployer balance: ${ethers.utils.formatEther(deployerBalance)} ETH`)

  if (deployerBalance.eq(0)) {
    throw new Error("Deployer has no ETH for gas fees")
  }

  // 1. Deploy MockUSDT (test token with faucet)
  log("\n📄 Deploying MockUSDT...")
  const mockUSDT = await deploy("MockUSDT", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.live ? 5 : 1,
  })

  // 2. Deploy InterestCalculator library
  log("\n📊 Deploying InterestCalculator library...")
  const interestCalculator = await deploy("InterestCalculator", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.live ? 5 : 1,
  })

  // 3. Deploy YieldManager
  log("\n💰 Deploying YieldManager...")
  const yieldManager = await deploy("YieldManager", {
    from: deployer,
    args: [],
    log: true,
    libraries: {
      InterestCalculator: interestCalculator.address,
    },
    waitConfirmations: network.live ? 5 : 1,
  })

  // 4. Deploy NFTRewards
  log("\n🎨 Deploying NFTRewards...")
  const nftRewards = await deploy("NFTRewards", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.live ? 5 : 1,
  })

  // 5. Deploy PiggyVault (main contract)
  log("\n🐷 Deploying PiggyVault...")
  const piggyVault = await deploy("PiggyVault", {
    from: deployer,
    args: [mockUSDT.address, yieldManager.address, nftRewards.address],
    log: true,
    libraries: {
      InterestCalculator: interestCalculator.address,
    },
    waitConfirmations: network.live ? 5 : 1,
  })

  // Setup configurations
  log("\n⚙️ Setting up configurations...")
  
  const mockUSDTContract = await ethers.getContractAt("MockUSDT", mockUSDT.address)
  const yieldManagerContract = await ethers.getContractAt("YieldManager", yieldManager.address)
  const nftRewardsContract = await ethers.getContractAt("NFTRewards", nftRewards.address)
  const piggyVaultContract = await ethers.getContractAt("PiggyVault", piggyVault.address)

  // Set PiggyVault as authorized minter for NFTRewards
  try {
    const tx1 = await nftRewardsContract.setAuthorizedMinter(piggyVault.address, true)
    await tx1.wait()
    log("✅ Set PiggyVault as authorized NFT minter")
  } catch (error) {
    log("⚠️ Failed to set NFT minter authorization:", error)
  }

  // Set PiggyVault in YieldManager
  try {
    const tx2 = await yieldManagerContract.setPiggyVault(piggyVault.address)
    await tx2.wait()
    log("✅ Connected YieldManager to PiggyVault")
  } catch (error) {
    log("⚠️ Failed to connect YieldManager:", error)
  }

  // Initialize savings plans in PiggyVault
  try {
    const savingsPlans = [
      { duration: 7 * 24 * 60 * 60, apy: 500 },    // 7 days, 5% APY
      { duration: 14 * 24 * 60 * 60, apy: 800 },   // 14 days, 8% APY
      { duration: 30 * 24 * 60 * 60, apy: 1200 },  // 30 days, 12% APY
      { duration: 90 * 24 * 60 * 60, apy: 1800 },  // 90 days, 18% APY
    ]

    for (let i = 0; i < savingsPlans.length; i++) {
      const plan = savingsPlans[i]
      const tx = await piggyVaultContract.addSavingsPlan(plan.duration, plan.apy)
      await tx.wait()
      log(`✅ Added savings plan: ${plan.duration / (24 * 60 * 60)} days at ${plan.apy / 100}% APY`)
    }
  } catch (error) {
    log("⚠️ Failed to initialize savings plans:", error)
  }

  // Mint initial USDT to deployer for testing
  if (!network.live) {
    try {
      const initialAmount = ethers.utils.parseEther("10000") // 10,000 USDT
      const tx3 = await mockUSDTContract.mint(deployer, initialAmount)
      await tx3.wait()
      log(`✅ Minted ${ethers.utils.formatEther(initialAmount)} USDT to deployer for testing`)
    } catch (error) {
      log("⚠️ Failed to mint initial USDT:", error)
    }
  }

  // Deployment summary
  log("\n🎉 Deployment completed successfully!")
  log("📋 Contract Addresses:")
  log(`   MockUSDT: ${mockUSDT.address}`)
  log(`   InterestCalculator: ${interestCalculator.address}`)
  log(`   YieldManager: ${yieldManager.address}`)
  log(`   NFTRewards: ${nftRewards.address}`)
  log(`   PiggyVault: ${piggyVault.address}`)

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    deployer,
    timestamp: new Date().toISOString(),
    contracts: {
      MockUSDT: mockUSDT.address,
      InterestCalculator: interestCalculator.address,
      YieldManager: yieldManager.address,
      NFTRewards: nftRewards.address,
      PiggyVault: piggyVault.address,
    },
    savingsPlans: [
      { id: 0, duration: "7 days", apy: "5%" },
      { id: 1, duration: "14 days", apy: "8%" },
      { id: 2, duration: "30 days", apy: "12%" },
      { id: 3, duration: "90 days", apy: "18%" },
    ],
  }

  // Log frontend integration info
  log("\n🔗 Frontend Integration:")
  log("Add these addresses to your frontend configuration:")
  log(`export const CONTRACTS = {`)
  log(`  PIGGY_VAULT: "${piggyVault.address}",`)
  log(`  YIELD_MANAGER: "${yieldManager.address}",`)
  log(`  NFT_REWARDS: "${nftRewards.address}",`)
  log(`  MOCK_USDT: "${mockUSDT.address}",`)
  log(`  CHAIN_ID: ${network.config.chainId},`)
  log(`}`)

  log("\n🧪 Testing Commands:")
  log("To interact with the contracts:")
  log(`npx hardhat console --network ${network.name}`)
  log(`const piggyVault = await ethers.getContractAt("PiggyVault", "${piggyVault.address}")`)
  log(`const mockUSDT = await ethers.getContractAt("MockUSDT", "${mockUSDT.address}")`)

  if (network.live) {
    log("\n🔍 Verification:")
    log("Run these commands to verify contracts on block explorer:")
    log(`npx hardhat verify --network ${network.name} ${mockUSDT.address}`)
    log(`npx hardhat verify --network ${network.name} ${yieldManager.address}`)
    log(`npx hardhat verify --network ${network.name} ${nftRewards.address}`)
    log(`npx hardhat verify --network ${network.name} ${piggyVault.address} "${mockUSDT.address}" "${yieldManager.address}" "${nftRewards.address}"`)
  }

  return true
}

export default deployAll
deployAll.tags = ["all", "PiggyBoss"]
