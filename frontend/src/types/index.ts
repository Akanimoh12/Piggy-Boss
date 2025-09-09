import { type Address } from 'viem'

/**
 * Core application types for Piggy Boss DeFi platform
 */

// ===== BLOCKCHAIN TYPES =====

export interface Network {
  id: number
  name: string
  rpcUrl: string
  explorerUrl: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export interface Transaction {
  hash: string
  from: Address
  to: Address
  value: string
  gasUsed: string
  gasPrice: string
  timestamp: number
  status: 'pending' | 'success' | 'failed'
  type: 'deposit' | 'withdraw' | 'faucet' | 'transfer' | 'approve'
}

// ===== USER TYPES =====

export interface User {
  address: Address
  isConnected: boolean
  balance: string
  nativeBalance: string
  totalSaved: string
  totalEarned: string
  achievementPoints: number
  tier: UserTier
  joinedAt: number
  lastActivity: number
}

export interface UserTier {
  level: number
  name: string
  minPoints: number
  benefits: string[]
  color: string
  icon: string
}

export interface UserStats {
  totalDeposited: string
  totalEarned: string
  totalWithdrawn: string
  activeDeposits: number
  completedDeposits: number
  transactionCount: number
  averageAPY: number
  favoriteplan: number
  streak: number // Days of consecutive activity
}

// ===== SAVINGS TYPES =====

export interface SavingsPlan {
  id: number
  duration: number // in days
  durationText: string
  apy: number
  apyBasisPoints: number
  minAmount: number
  maxAmount: number
  color: string
  icon: string
  title: string
  description: string
  features: string[]
  isActive: boolean
  totalDeposits?: string
  totalUsers?: number
}

export interface Deposit {
  id: string
  user: Address
  amount: string
  planDays: number
  createdAt: number
  maturityTime: number
  isWithdrawn: boolean
  accruedInterest: string
  status: 'active' | 'matured' | 'withdrawn' | 'emergency'
  transactionHash: string
  currentValue?: string
  projectedValue?: string
}

export interface DepositSummary {
  totalAmount: string
  totalInterest: string
  totalValue: string
  activeCount: number
  maturedCount: number
  withdrawnCount: number
}

// ===== NFT TYPES =====

export interface NFTReward {
  id: string
  tokenId: number
  category: string
  name: string
  description: string
  image: string
  rarity: number
  achievementPoints: number
  isSoulbound: boolean
  mintedAt: number
  owner: Address
  attributes?: NFTAttribute[]
}

export interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: string
}

export interface NFTCategory {
  id: string
  name: string
  description: string
  rarity: number
  image: string
  achievementPoints: number
  requirements: string
  isUnlocked?: boolean
}

export interface NFTCollection {
  owned: NFTReward[]
  available: NFTCategory[]
  totalPoints: number
  rareCounts: Record<number, number>
}

// ===== YIELD TYPES =====

export interface YieldData {
  currentAPY: number
  effectiveAPY: number
  dailyRate: number
  monthlyProjection: string
  yearlyProjection: string
  totalEarned: string
  lastUpdated: number
}

export interface YieldOptimization {
  suggestedAPY: number
  suggestedPlan: number
  riskScore: number
  confidence: number
  strategy: string
  reasoning: string
  potentialGain: string
  timestamp: number
}

export interface PlatformMetrics {
  totalValueLocked: string
  totalUsers: number
  totalDeposits: string
  totalRewards: string
  averageAPY: number
  healthScore: number
  utilizationRate: number
  lastUpdated: number
}

// ===== UI TYPES =====

export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface LoadingState {
  isLoading: boolean
  message?: string
  progress?: number
}

export interface ErrorState {
  hasError: boolean
  error?: Error
  code?: string
  message?: string
  retry?: () => void
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

// ===== FORM TYPES =====

export interface DepositFormData {
  amount: string
  planDays: number
  acceptTerms: boolean
}

export interface WithdrawFormData {
  depositId: string
  isEmergency: boolean
  confirmWithdraw: boolean
}

export interface FaucetFormData {
  address: Address
  captcha?: string
}

// ===== API TYPES =====

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ChartDataPoint {
  timestamp: number
  value: number
  label?: string
}

export interface PriceData {
  current: number
  change24h: number
  change7d: number
  marketCap: number
  volume24h: number
  lastUpdated: number
}

// ===== ANALYTICS TYPES =====

export interface AnalyticsEvent {
  name: string
  properties: Record<string, any>
  timestamp: number
  userId?: string
  sessionId: string
}

export interface UserActivity {
  date: string
  deposits: number
  withdrawals: number
  faucetClaims: number
  totalValue: string
}

export interface PlatformAnalytics {
  dailyActiveUsers: number
  totalTransactions: number
  volumeByPlan: Record<number, string>
  topUsers: Array<{
    address: Address
    totalSaved: string
    tier: string
  }>
  recentActivity: UserActivity[]
}

// ===== SETTINGS TYPES =====

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  language: string
  currency: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    maturityReminders: boolean
    yieldUpdates: boolean
    nftRewards: boolean
  }
  privacy: {
    showBalance: boolean
    showActivity: boolean
    analytics: boolean
  }
  trading: {
    slippageTolerance: number
    gasPrice: 'slow' | 'normal' | 'fast'
    autoApprove: boolean
  }
}

export interface AppSettings {
  version: string
  environment: 'development' | 'staging' | 'production'
  features: Record<string, boolean>
  maintenance: {
    enabled: boolean
    message?: string
    estimatedEnd?: number
  }
}

// ===== UTILITY TYPES =====

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// ===== COMPONENT PROP TYPES =====

export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends BaseComponentProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
}

// ===== HOOK RETURN TYPES =====

export interface UseWeb3Return {
  address?: Address
  isConnected: boolean
  isConnecting: boolean
  isReconnecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  switchNetwork: () => Promise<void>
  balance?: string
  error?: Error
}

export interface UseContractReturn<T = any> {
  contract?: T
  isLoading: boolean
  error?: Error
  refetch: () => Promise<void>
}

export interface UseSavingsReturn {
  deposits: Deposit[]
  summary: DepositSummary
  isLoading: boolean
  error?: Error
  createDeposit: (amount: string, planDays: number) => Promise<void>
  withdrawDeposit: (depositId: string) => Promise<void>
  emergencyWithdraw: (depositId: string) => Promise<void>
  refetch: () => Promise<void>
}

export interface UseFaucetReturn {
  canClaim: boolean
  timeUntilNextClaim: number
  claimAmount: string
  isLoading: boolean
  error?: Error
  claimTokens: () => Promise<void>
  refetch: () => Promise<void>
}
