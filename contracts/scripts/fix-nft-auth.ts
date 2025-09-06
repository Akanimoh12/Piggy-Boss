import { ethers } from "hardhat";

async function main() {
  const nftRewardsAddress = "0x1Bd4FE7221e4796039c3F5eeD98ec80A84A36667";
  const piggyVaultAddress = "0x160a9B6Fd478b12E758ff047fEC08e6Bd4182D76";
  
  console.log("🔗 Fixing NFT Authorization...");
  
  const NFTRewards = await ethers.getContractFactory("NFTRewards");
  const nftRewards = NFTRewards.attach(nftRewardsAddress);
  
  try {
    const tx = await nftRewards.authorizeMinter(piggyVaultAddress, true);
    await tx.wait();
    console.log("✅ PiggyVault authorized as NFT minter!");
  } catch (error: any) {
    console.log("❌ Failed to authorize minter:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
