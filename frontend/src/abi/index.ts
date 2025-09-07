export { PiggyVaultABI } from './PiggyVault'
export { MockUSDTABI } from './MockUSDT'
export { YieldManagerABI } from './YieldManager'
export { NFTRewardsABI } from './NFTRewards'

// Contract addresses on Somnia testnet
export const SOMNIA_CONTRACTS = {
  MOCK_USDT: "0xeE0667c01DeFEBca6d753544D6C8Db80ceaAC9B6",
  YIELD_MANAGER: "0x53538F8b7cF6e3022E91C3742DD32672d1dBE0bE", 
  NFT_REWARDS: "0x1Bd4FE7221e4796039c3F5eeD98ec80A84A36667",
  PIGGY_VAULT: "0xa1fBDb1737E6C8B0510cFeb440d2d33ea2c4B2C6", // NEW - Fixed 6 decimals
} as const;

// Export with alternative name for backward compatibility
export const CONTRACT_ADDRESSES = {
  PiggyVault: "0xa1fBDb1737E6C8B0510cFeb440d2d33ea2c4B2C6", // NEW - Fixed 6 decimals
  MockUSDT: "0xeE0667c01DeFEBca6d753544D6C8Db80ceaAC9B6",
  YieldManager: "0x53538F8b7cF6e3022E91C3742DD32672d1dBE0bE",
  NFTRewards: "0x1Bd4FE7221e4796039c3F5eeD98ec80A84A36667",
} as const;


// Network configuration
export const SOMNIA_NETWORK = {
  chainId: 50312,
  name: "Somnia Testnet",
  rpcUrl: "https://dream-rpc.somnia.network",
  blockExplorerUrl: "https://shannon-explorer.somnia.network",
  nativeCurrency: {
    name: "SOM",
    symbol: "SOM",
    decimals: 18,
  },
} as const;

// Savings plans configuration
export const SAVINGS_PLANS = [
  { id: 30, duration: "30 days", apy: 3, apyBasisPoints: 300, minAmount: "10", maxAmount: "1000" },
  { id: 90, duration: "90 days", apy: 5, apyBasisPoints: 500, minAmount: "10", maxAmount: "5000" },
  { id: 180, duration: "180 days", apy: 8, apyBasisPoints: 800, minAmount: "10", maxAmount: "10000" },
  { id: 365, duration: "365 days", apy: 12, apyBasisPoints: 1200, minAmount: "10", maxAmount: "50000" },
] as const;

export type ContractName = keyof typeof CONTRACT_ADDRESSES
export type SomniaContractName = keyof typeof SOMNIA_CONTRACTS
