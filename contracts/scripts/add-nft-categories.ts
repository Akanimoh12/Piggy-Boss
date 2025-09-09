import { ethers } from "hardhat"

async function main() {
  console.log("🎨 Adding missing NFT categories to NFTRewards contract...")

  // Contract address
  const NFT_REWARDS_ADDRESS = "0x1Bd4FE7221e4796039c3F5eeD98ec80A84A36667"

  // Get the NFTRewards contract
  const nftRewards = await ethers.getContractAt("NFTRewards", NFT_REWARDS_ADDRESS)

  console.log(`📝 NFTRewards Contract: ${NFT_REWARDS_ADDRESS}`)

  try {
    // Add "half_year_saver" category for 180-day plans
    console.log("🔄 Adding 'half_year_saver' category...")
    const tx1 = await nftRewards.addCategory(
      "half_year_saver",     // _category
      "Half Year Saver",     // _name
      4,                     // _rarity
      false,                 // _isSoulbound
      750,                   // _achievementPoints
      "",                    // _imageURI (empty for now)
      "Completed 180-day savings plan"  // _attributes (description)
    )
    console.log(`📝 Transaction hash for half_year_saver: ${tx1.hash}`)
    await tx1.wait()
    console.log("✅ Added 'half_year_saver' category!")

    // Add "year_champion" category for 365-day plans
    console.log("🔄 Adding 'year_champion' category...")
    const tx2 = await nftRewards.addCategory(
      "year_champion",       // _category
      "Year Champion",       // _name
      5,                     // _rarity (highest)
      false,                 // _isSoulbound
      1000,                  // _achievementPoints (highest)
      "",                    // _imageURI (empty for now)
      "Completed 365-day savings plan - Ultimate saver!"  // _attributes (description)
    )
    console.log(`📝 Transaction hash for year_champion: ${tx2.hash}`)
    await tx2.wait()
    console.log("✅ Added 'year_champion' category!")

    console.log("🎉 Successfully added all missing NFT categories!")

    // Verify the categories exist
    console.log("🔍 Verifying categories...")
    // Note: We can't easily read the categories since they're in a mapping, 
    // but the transactions should have succeeded if no errors occurred

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
