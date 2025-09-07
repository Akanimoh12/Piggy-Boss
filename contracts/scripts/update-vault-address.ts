import { ethers } from "hardhat"

async function main() {
  console.log("🔄 Updating YieldManager with new PiggyVault address...")

  // Contract addresses
  const YIELD_MANAGER_ADDRESS = "0x53538F8b7cF6e3022E91C3742DD32672d1dBE0bE"
  const NEW_PIGGY_VAULT_ADDRESS = "0xa1fBDb1737E6C8B0510cFeb440d2d33ea2c4B2C6"

  // Get the YieldManager contract
  const yieldManager = await ethers.getContractAt("YieldManager", YIELD_MANAGER_ADDRESS)

  console.log(`📝 Current YieldManager: ${YIELD_MANAGER_ADDRESS}`)
  console.log(`📝 New PiggyVault: ${NEW_PIGGY_VAULT_ADDRESS}`)

  try {
    // Check current vault address
    const currentVault = await yieldManager.piggyVault()
    console.log(`📋 Current authorized vault: ${currentVault}`)

    // Set the new PiggyVault address
    console.log("🔄 Setting new PiggyVault address...")
    const tx = await yieldManager.setPiggyVault(NEW_PIGGY_VAULT_ADDRESS)
    console.log(`📝 Transaction hash: ${tx.hash}`)
    
    // Wait for confirmation
    await tx.wait()
    console.log("✅ Transaction confirmed!")

    // Verify the update
    const updatedVault = await yieldManager.piggyVault()
    console.log(`📋 Updated authorized vault: ${updatedVault}`)

    if (updatedVault.toLowerCase() === NEW_PIGGY_VAULT_ADDRESS.toLowerCase()) {
      console.log("🎉 Successfully updated YieldManager with new PiggyVault address!")
    } else {
      console.log("❌ Update failed - addresses don't match")
    }

  } catch (error) {
    console.error("❌ Error updating YieldManager:", error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
