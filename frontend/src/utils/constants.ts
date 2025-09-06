/**
 * Network Configuration for Somnia Testnet
 */
export const SOMNIA_NETWORK = {
  id: 50312,
  name: 'Somnia Testnet',
  network: 'somnia',
  nativeCurrency: {
    decimals: 18,
    name: 'Somnia Token',
    symbol: 'STT',
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
} as const

/**
 * Contract Addresses (will be updated after deployment)
 */
export const CONTRACT_ADDRESSES = {
  MOCK_USDT: import.meta.env.VITE_MOCK_USDT_ADDRESS || '',
  PIGGY_VAULT: import.meta.env.VITE_PIGGY_VAULT_ADDRESS || '',
  YIELD_MANAGER: import.meta.env.VITE_YIELD_MANAGER_ADDRESS || '',
  NFT_REWARDS: import.meta.env.VITE_NFT_REWARDS_ADDRESS || '',
  FACTORY: import.meta.env.VITE_FACTORY_ADDRESS || '',
} as const

/**
 * Savings Plans Configuration
 */
export const SAVINGS_PLANS = [
  {
    id: 1,
    duration: 7,
    durationText: '7 days',
    apy: 5,
    apyBasisPoints: 500,
    minAmount: 10,
    maxAmount: 100000,
    color: 'from-blue-400 to-blue-600',
    icon: '🌱',
    title: 'Starter Plan',
    description: 'Perfect for beginners',
    features: ['Low risk', 'Quick returns', 'Flexible amount'],
  },
  {
    id: 2,
    duration: 14,
    durationText: '14 days',
    apy: 8,
    apyBasisPoints: 800,
    minAmount: 10,
    maxAmount: 100000,
    color: 'from-green-400 to-green-600',
    icon: '🌿',
    title: 'Growth Plan',
    description: 'Balanced risk and reward',
    features: ['Medium risk', 'Better returns', 'Popular choice'],
  },
  {
    id: 3,
    duration: 30,
    durationText: '30 days',
    apy: 12,
    apyBasisPoints: 1200,
    minAmount: 10,
    maxAmount: 100000,
    color: 'from-purple-400 to-purple-600',
    icon: '🌳',
    title: 'Premium Plan',
    description: 'High yield opportunity',
    features: ['Higher returns', 'Monthly commitment', 'NFT rewards'],
  },
  {
    id: 4,
    duration: 90,
    durationText: '90 days',
    apy: 18,
    apyBasisPoints: 1800,
    minAmount: 10,
    maxAmount: 100000,
    color: 'from-orange-400 to-red-600',
    icon: '🏆',
    title: 'Elite Plan',
    description: 'Maximum yield potential',
    features: ['Highest APY', 'Quarterly lock', 'Exclusive NFTs'],
  },
] as const

/**
 * NFT Reward Categories
 */
export const NFT_CATEGORIES = {
  FIRST_DEPOSIT: {
    name: 'Piggy Starter',
    description: 'Your first step into DeFi savings!',
    rarity: 1,
    image: '/nft/piggy-starter.png',
    achievementPoints: 10,
  },
  PIGGY_SAVER: {
    name: 'Piggy Saver',
    description: 'Saved 100+ USDT',
    rarity: 2,
    image: '/nft/piggy-saver.png',
    achievementPoints: 25,
  },
  PIGGY_MASTER: {
    name: 'Piggy Master', 
    description: 'Saved 1,000+ USDT',
    rarity: 3,
    image: '/nft/piggy-master.png',
    achievementPoints: 50,
  },
  PIGGY_LEGEND: {
    name: 'Piggy Legend',
    description: 'Saved 10,000+ USDT',
    rarity: 4,
    image: '/nft/piggy-legend.png',
    achievementPoints: 100,
  },
  EARLY_ADOPTER: {
    name: 'Early Adopter',
    description: 'Among the first 1000 users',
    rarity: 3,
    image: '/nft/early-adopter.png',
    achievementPoints: 75,
  },
  LOYAL_SAVER: {
    name: 'Loyal Saver',
    description: 'Completed 10+ savings cycles',
    rarity: 3,
    image: '/nft/loyal-saver.png',
    achievementPoints: 60,
  },
  YIELD_HUNTER: {
    name: 'Yield Hunter',
    description: 'Earned 100+ USDT in yield',
    rarity: 4,
    image: '/nft/yield-hunter.png',
    achievementPoints: 80,
  },
} as const

/**
 * UI Constants
 */
export const UI_CONSTANTS = {
  // Animation durations
  ANIMATION_DURATION: {
    SHORT: 0.2,
    MEDIUM: 0.3,
    LONG: 0.5,
  },
  
  // Toast notification duration
  TOAST_DURATION: 3000,
  
  // Polling intervals
  POLLING_INTERVAL: {
    BALANCE: 30000, // 30 seconds
    INTEREST: 10000, // 10 seconds
    TRANSACTIONS: 15000, // 15 seconds
  },
  
  // Pagination
  ITEMS_PER_PAGE: 10,
  
  // Maximum file size for uploads
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Debounce delay for search
  SEARCH_DEBOUNCE: 300,
} as const

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_AMOUNT: 'Please enter a valid amount',
  AMOUNT_TOO_LOW: 'Amount is below minimum requirement',
  AMOUNT_TOO_HIGH: 'Amount exceeds maximum limit',
  DEPOSIT_NOT_MATURED: 'Deposit has not matured yet',
  USER_REJECTED: 'Transaction was rejected by user',
  SWITCH_NETWORK: 'Please switch to Somnia Network',
  CONTRACT_ERROR: 'Smart contract error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully!',
  DEPOSIT_CREATED: 'Deposit created successfully!',
  WITHDRAWAL_COMPLETED: 'Withdrawal completed successfully!',
  FAUCET_CLAIMED: 'Tokens claimed from faucet!',
  NFT_MINTED: 'NFT reward earned!',
  TRANSACTION_CONFIRMED: 'Transaction confirmed on blockchain',
} as const

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  PRICE_API: 'https://api.coingecko.com/api/v3',
  IPFS_GATEWAY: 'https://ipfs.io/ipfs/',
  NFT_METADATA: '/api/nft/metadata',
  USER_ANALYTICS: '/api/analytics/user',
  PLATFORM_STATS: '/api/stats/platform',
} as const

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  THEME: 'piggy-boss-theme',
  LANGUAGE: 'piggy-boss-language',
  SETTINGS: 'piggy-boss-settings',
  ONBOARDING: 'piggy-boss-onboarding',
  REFERRAL: 'piggy-boss-referral',
} as const

/**
 * Feature Flags
 */
export const FEATURES = {
  AI_INSIGHTS: true,
  NFT_MARKETPLACE: false,
  REFERRAL_PROGRAM: true,
  ADVANCED_ANALYTICS: true,
  MOBILE_APP: false,
  GOVERNANCE: false,
} as const

/**
 * Social Media Links
 */
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/piggyboss',
  DISCORD: 'https://discord.gg/piggyboss',
  TELEGRAM: 'https://t.me/piggyboss',
  GITHUB: 'https://github.com/piggyboss',
  MEDIUM: 'https://medium.com/@piggyboss',
  DOCS: 'https://docs.piggyboss.finance',
} as const

/**
 * Color Palette (matches Tailwind config)
 */
export const COLORS = {
  PRIMARY: '#0a120e',
  SECONDARY: '#5f6361', 
  ACCENT: '#9ba896',
  SURFACE: '#f0f0ea',
  BACKGROUND: '#fbfbf9',
  BORDER: '#cccfcd',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
} as const

/**
 * Responsive Breakpoints
 */
export const BREAKPOINTS = {
  XS: 475,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
  '3XL': 1680,
} as const

/**
 * Development Constants
 */
export const DEV_CONSTANTS = {
  LOG_LEVEL: import.meta.env.DEV ? 'debug' : 'error',
  ENABLE_REDUX_DEVTOOLS: import.meta.env.DEV,
  MOCK_DATA: import.meta.env.DEV,
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
} as const

/**
 * Contract References for Hooks
 */
export const CONTRACTS = {
  PIGGY_VAULT: {
    address: CONTRACT_ADDRESSES.PIGGY_VAULT,
    abi: [], // Will be populated when contracts are deployed
  },
  YIELD_MANAGER: {
    address: CONTRACT_ADDRESSES.YIELD_MANAGER,
    abi: [], // Will be populated when contracts are deployed
  },
  NFT_REWARDS: {
    address: CONTRACT_ADDRESSES.NFT_REWARDS,
    abi: [], // Will be populated when contracts are deployed
  },
  MOCK_USDT: {
    address: CONTRACT_ADDRESSES.MOCK_USDT,
    abi: [], // Will be populated when contracts are deployed
  },
} as const
