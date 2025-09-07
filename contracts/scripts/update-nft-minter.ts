import { ethers } from "hardhat"

async function main() {
  console.log("🎨 Updating NFTRewards with new PiggyVault minter authorization...")

  // Contract addresses
  const NFT_REWARDS_ADDRESS = "0x1Bd4FE7221e4796039c3F5eeD98ec80A84A36667"
  const NEW_PIGGY_VAULT_ADDRESS = "0xa1fBDb1737E6C8B0510cFeb440d2d33ea2c4B2C6"

  // Get the NFTRewards contract
  const nftRewards = await ethers.getContractAt("NFTRewards", NFT_REWARDS_ADDRESS)

  console.log(`📝 NFTRewards Contract: ${NFT_REWARDS_ADDRESS}`)
  console.log(`📝 New PiggyVault: ${NEW_PIGGY_VAULT_ADDRESS}`)

  try {
    // Check current authorization status
    const isCurrentlyAuthorized = await nftRewards.authorizedMinters(NEW_PIGGY_VAULT_ADDRESS)
    console.log(`📋 Current authorization status: ${isCurrentlyAuthorized}`)

    if (!isCurrentlyAuthorized) {
      // Authorize the new PiggyVault address as a minter
      console.log("🔄 Authorizing new PiggyVault as NFT minter...")
      const tx = await nftRewards.authorizeMinter(NEW_PIGGY_VAULT_ADDRESS, true)
      console.log(`📝 Transaction hash: ${tx.hash}`)
      
      // Wait for confirmation
      await tx.wait()
      console.log("✅ Transaction confirmed!")

      // Verify the update
      const updatedAuthorization = await nftRewards.authorizedMinters(NEW_PIGGY_VAULT_ADDRESS)
      console.log(`📋 Updated authorization status: ${updatedAuthorization}`)

      if (updatedAuthorization) {
        console.log("🎉 Successfully authorized new PiggyVault as NFT minter!")
      } else {
        console.log("❌ Authorization failed")
      }
    } else {
      console.log("✅ PiggyVault is already authorized as NFT minter!")
    }

  } catch (error) {
    console.error("❌ Error updating NFTRewards authorization:", error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
