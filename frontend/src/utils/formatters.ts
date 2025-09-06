/**
 * Utility Functions and Formatters
 * 
 * Collection of utility functions for formatting data,
 * handling calculations, and common operations.
 */

// Format configuration constants
const FORMAT_CONFIG = {
  CURRENCY_DECIMALS: 2,
  PERCENTAGE_DECIMALS: 2,
  ADDRESS_PREFIX_LENGTH: 6,
  ADDRESS_SUFFIX_LENGTH: 4,
} as const

/**
 * Format currency values for display
 */
export const formatCurrency = (
  amount: number,
  options: {
    decimals?: number
    symbol?: string
    compact?: boolean
  } = {}
): string => {
  const { 
    decimals = FORMAT_CONFIG.CURRENCY_DECIMALS, 
    symbol = '$', 
    compact = false 
  } = options

  if (compact && amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`
  }
  
  if (compact && amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}K`
  }

  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/**
 * Format percentage values for display
 */
export const formatPercentage = (
  value: number,
  decimals: number = FORMAT_CONFIG.PERCENTAGE_DECIMALS
): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format wallet address for display
 */
export const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Format balance for display
 */
export const formatBalance = (balance: string): string => {
  const num = parseFloat(balance)
  if (num === 0) return '0'
  if (num < 0.001) return '< 0.001'
  return num.toFixed(3)
}

/**
 * Format APY from basis points to percentage
 */
export const formatAPY = (basisPoints: number): string => {
  const percentage = basisPoints / 100
  return formatPercentage(percentage)
}

/**
 * Calculate compound interest
 */
export const calculateCompoundInterest = (
  principal: number,
  annualRate: number,
  days: number,
  compoundFrequency: number = 365 // Daily compounding
): number => {
  const rate = annualRate / 100
  const time = days / 365
  const amount = principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * time)
  return amount - principal
}

/**
 * Calculate simple interest
 */
export const calculateSimpleInterest = (
  principal: number,
  annualRate: number,
  days: number
): number => {
  const rate = annualRate / 100
  const time = days / 365
  return principal * rate * time
}

/**
 * Format time duration
 */
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)

  if (days > 0) {
    return `${days}d ${hours}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

/**
 * Format date for display
 */
export const formatDate = (date: Date | string, options: Intl.DateTimeFormatOptions = {}): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }

  return dateObj.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  return 'Just now'
}

/**
 * Truncate address for display
 */
export const truncateAddress = (address: string, startLength: number = 6, endLength: number = 4): string => {
  if (!address) return ''
  if (address.length <= startLength + endLength) return address
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Validate Ethereum address
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Parse and validate input amounts
 */
export const parseAmount = (input: string): number | null => {
  const cleaned = input.replace(/[^\d.]/g, '')
  const parsed = parseFloat(cleaned)
  
  if (isNaN(parsed) || parsed <= 0) {
    return null
  }
  
  return parsed
}

/**
 * Validate deposit amount against plan limits
 */
export const validateDepositAmount = (
  amount: number,
  minDeposit: number,
  maxDeposit: number
): { isValid: boolean; error?: string } => {
  if (amount < minDeposit) {
    return {
      isValid: false,
      error: `Minimum deposit is ${formatCurrency(minDeposit)}`
    }
  }
  
  if (amount > maxDeposit) {
    return {
      isValid: false,
      error: `Maximum deposit is ${formatCurrency(maxDeposit)}`
    }
  }
  
  return { isValid: true }
}

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Sleep utility for async operations
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Get NFT rarity based on deposit amount
 */
export const getNFTRarity = (totalDeposits: number): 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' => {
  if (totalDeposits >= 100000) return 'LEGENDARY'
  if (totalDeposits >= 10000) return 'EPIC'
  if (totalDeposits >= 1000) return 'RARE'
  return 'COMMON'
}

/**
 * Calculate savings plan progress
 */
export const calculateProgress = (startDate: Date, duration: number): number => {
  const now = new Date()
  const elapsed = now.getTime() - startDate.getTime()
  const total = duration * 24 * 60 * 60 * 1000 // Convert days to milliseconds
  
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}

/**
 * Get time remaining for savings plan
 */
export const getTimeRemaining = (startDate: Date, duration: number): number => {
  const now = new Date()
  const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000)
  
  return Math.max(0, endDate.getTime() - now.getTime())
}

/**
 * Check if savings plan is matured
 */
export const isSavingsPlanMatured = (startDate: Date, duration: number): boolean => {
  const now = new Date()
  const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000)
  
  return now >= endDate
}

/**
 * Format transaction hash for display
 */
export const formatTxHash = (hash: string): string => {
  return truncateAddress(hash, 8, 6)
}

/**
 * Get Explorer URL for transaction
 */
export const getExplorerUrl = (hash: string, type: 'tx' | 'address' = 'tx'): string => {
  const baseUrl = 'https://explorer.somnia.network'
  return `${baseUrl}/${type}/${hash}`
}

/**
 * Validate and format user input
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

/**
 * Generate random colors for charts
 */
export const generateChartColors = (count: number): string[] => {
  const colors = [
    '#EC4899', '#F97316', '#10B981', '#3B82F6', 
    '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'
  ]
  
  return Array.from({ length: count }, (_, i) => colors[i % colors.length] as string)
}

/**
 * Local storage helpers
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch {
      return defaultValue || null
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }
}
