import { ethers } from "hardhat"

async function main() {
  console.log("🎨 Adding original NFT categories that deployed PiggyVault expects...")

  // Contract address
  const NFT_REWARDS_ADDRESS = "0x1Bd4FE7221e4796039c3F5eeD98ec80A84A36667"

  // Get the NFTRewards contract
  const nftRewards = await ethers.getContractAt("NFTRewards", NFT_REWARDS_ADDRESS)

  console.log(`📝 NFTRewards Contract: ${NFT_REWARDS_ADDRESS}`)

  try {
    // Add "starter" category for ≤30 day plans
    console.log("🔄 Adding 'starter' category...")
    const tx1 = await nftRewards.addCategory(
      "starter",             // _category
      "Starter Saver",       // _name
      2,                     // _rarity
      false,                 // _isSoulbound
      150,                   // _achievementPoints
      "",                    // _imageURI (empty for now)
      "Started savings journey with 30-day plan"  // _attributes (description)
    )
    console.log(`📝 Transaction hash for starter: ${tx1.hash}`)
    await tx1.wait()
    console.log("✅ Added 'starter' category!")

    // Add "saver" category for ≤90 day plans
    console.log("🔄 Adding 'saver' category...")
    const tx2 = await nftRewards.addCategory(
      "saver",               // _category
      "Dedicated Saver",     // _name
      3,                     // _rarity
      false,                 // _isSoulbound
      300,                   // _achievementPoints
      "",                    // _imageURI (empty for now)
      "Committed to 90-day savings plan"  // _attributes (description)
    )
    console.log(`📝 Transaction hash for saver: ${tx2.hash}`)
    await tx2.wait()
    console.log("✅ Added 'saver' category!")

    // Add "investor" category for ≤180 day plans
    console.log("🔄 Adding 'investor' category...")
    const tx3 = await nftRewards.addCategory(
      "investor",            // _category
      "Smart Investor",      // _name
      4,                     // _rarity
      false,                 // _isSoulbound
      600,                   // _achievementPoints
      "",                    // _imageURI (empty for now)
      "Demonstrated long-term thinking with 180-day plan"  // _attributes (description)
    )
    console.log(`📝 Transaction hash for investor: ${tx3.hash}`)
    await tx3.wait()
    console.log("✅ Added 'investor' category!")

    // Add "champion" category for >180 day plans
    console.log("🔄 Adding 'champion' category...")
    const tx4 = await nftRewards.addCategory(
      "champion",            // _category
      "Savings Champion",    // _name
      5,                     // _rarity (highest)
      false,                 // _isSoulbound
      1000,                  // _achievementPoints (highest)
      "",                    // _imageURI (empty for now)
      "Ultimate commitment with 365-day savings plan"  // _attributes (description)
    )
    console.log(`📝 Transaction hash for champion: ${tx4.hash}`)
    await tx4.wait()
    console.log("✅ Added 'champion' category!")

    console.log("🎉 Successfully added all original NFT categories that PiggyVault expects!")

  } catch (error) {
    console.error("❌ Error adding NFT categories:", error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
