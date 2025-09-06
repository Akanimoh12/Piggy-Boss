import { Address } from 'viem'
import { 
  PiggyVaultABI,
  MockUSDTABI,
  YieldManagerABI,
  NFTRewardsABI,
  CONTRACT_ADDRESSES 
} from '../abi'

// Network configurations
export const SUPPORTED_CHAINS = {
  somnia: {
    id: 50312,
    name: 'Somnia Network',
    network: 'somnia',
    nativeCurrency: {
      decimals: 18,
      name: 'SOM',
      symbol: 'SOM',
    },
    rpcUrls: {
      default: {
        http: ['https://dream-rpc.somnia.network'],
      },
      public: {
        http: ['https://dream-rpc.somnia.network'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Shannon Explorer',
        url: 'https://shannon-explorer.somnia.network',
      },
    },
    testnet: true,
  },
  hardhat: {
    id: 31337,
    name: 'Hardhat',
    network: 'hardhat',
    nativeCurrency: {
      decimals: 18,
      name: 'Ethereum',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: ['http://127.0.0.1:8545'],
      },
      public: {
        http: ['http://127.0.0.1:8545'],
      },
    },
    testnet: true,
  },
} as const

// Contract configurations
export const CONTRACTS = {
  PiggyVault: {
    address: CONTRACT_ADDRESSES.PiggyVault as Address,
    abi: PiggyVaultABI,
  },
  MockUSDT: {
    address: CONTRACT_ADDRESSES.MockUSDT as Address,
    abi: MockUSDTABI,
  },
  YieldManager: {
    address: CONTRACT_ADDRESSES.YieldManager as Address,
    abi: YieldManagerABI,
  },
  NFTRewards: {
    address: CONTRACT_ADDRESSES.NFTRewards as Address,
    abi: NFTRewardsABI,
  },
} as const

// Savings plan configurations
export const SAVINGS_PLANS = [
  {
    id: 7,
    name: 'Starter',
    duration: 7,
    durationLabel: '7 Days',
    apy: 8,
    minimumDeposit: 100,
    description: 'Perfect for beginners',
    color: 'from-blue-400 to-blue-600',
    icon: '🏃',
  },
  {
    id: 14,
    name: 'Growth',
    duration: 14,
    durationLabel: '14 Days',
    apy: 10,
    minimumDeposit: 250,
    description: 'Steady growth option',
    color: 'from-green-400 to-green-600',
    icon: '📈',
  },
  {
    id: 30,
    name: 'Optimizer',
    duration: 30,
    durationLabel: '30 Days',
    apy: 12,
    minimumDeposit: 500,
    description: 'Optimized returns',
    color: 'from-purple-400 to-purple-600',
    icon: '⚡',
  },
  {
    id: 90,
    name: 'Boss Mode',
    duration: 90,
    durationLabel: '90 Days',
    apy: 15,
    minimumDeposit: 1000,
    description: 'Maximum rewards',
    color: 'from-pink-400 to-pink-600',
    icon: '👑',
  },
] as const

// App constants
export const APP_CONFIG = {
  name: 'Piggy Boss',
  description: 'DeFi Savings Platform on Somnia Network',
  url: 'https://piggyboss.finance',
  decimals: 6, // USDT decimals
  faucetAmount: 1000, // 1000 USDT
  faucetCooldown: 24 * 60 * 60, // 24 hours in seconds
} as const

export type SavingsPlan = typeof SAVINGS_PLANS[number]
export type ContractConfig = typeof CONTRACTS[keyof typeof CONTRACTS]
