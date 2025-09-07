import hre from "hardhat"

async function main() {
  console.log("🔍 Verifying PiggyVault contract on Somnia...")

  const contractAddress = "0xa1fBDb1737E6C8B0510cFeb440d2d33ea2c4B2C6"
  const constructorArgs = [
    "0xeE0667c01DeFEBca6d753544D6C8Db80ceaAC9B6", // MockUSDT
    "0x53538F8b7cF6e3022E91C3742DD32672d1dBE0bE", // YieldManager  
    "0x1Bd4FE7221e4796039c3F5eeD98ec80A84A36667", // NFTRewards
  ]

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArgs,
    })
    console.log("✅ Contract verified successfully!")
  } catch (error) {
    console.error("❌ Verification failed:", error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
