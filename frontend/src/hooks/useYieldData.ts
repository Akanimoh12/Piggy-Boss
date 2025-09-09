import { useState, useEffect, useMemo } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { formatUnits } from 'viem'
import { CONTRACTS, APP_CONFIG } from '../config/contracts'

const DECIMALS = APP_CONFIG.decimals

export const useYieldData = () => {
  const { address } = useAccount()
  const [userPositions, setUserPositions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Get user's USDT balance
  const { data: usdtBalance, refetch: refetchBalance } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Get user's allowance for YieldManager
  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'allowance',
    args: [address as `0x${string}`, CONTRACTS.YieldManager.address as `0x${string}`],
    enabled: !!address,
  })

  // Mock yield pools - in production these would come from contracts
  const yieldPools = useMemo(() => [
    {
      id: 'usdt-vault',
      name: 'USDT Yield Vault',
      token: 'USDT',
      apy: '18.5',
      tvl: '2,450,000',
      risk: 'Low',
      lockPeriod: '0 days',
      description: 'Flexible USDT staking with compound interest',
      icon: '💰',
      color: 'from-green-400 to-green-600',
      features: ['Instant unstaking', 'Auto-compound', 'Daily rewards'],
      minStake: '10',
      maxStake: '100000',
      contractAddress: CONTRACTS.YieldManager.address
    },
    {
      id: 'high-yield',
      name: 'High Yield Pool',
      token: 'USDT',
      apy: '25.0',
      tvl: '1,200,000',
      risk: 'Medium',
      lockPeriod: '30 days',
      description: 'Higher returns with 30-day commitment',
      icon: '🚀',
      color: 'from-purple-400 to-purple-600',
      features: ['Higher APY', 'NFT rewards', 'Bonus multipliers'],
      minStake: '50',
      maxStake: '50000',
      contractAddress: CONTRACTS.YieldManager.address
    },
    {
      id: 'premium-vault',
      name: 'Premium Vault',
      token: 'USDT',
      apy: '35.0',
      tvl: '850,000',
      risk: 'High',
      lockPeriod: '90 days',
      description: 'Maximum yield for committed investors',
      icon: '💎',
      color: 'from-yellow-400 to-yellow-600',
      features: ['Maximum APY', 'Exclusive NFTs', 'VIP benefits'],
      minStake: '100',
      maxStake: '25000',
      contractAddress: CONTRACTS.YieldManager.address
    }
  ], [])

  // Calculate user statistics
  const userStats = useMemo(() => {
    // In production, these would be calculated from actual staking positions
    return {
      totalStaked: '1,250.00',
      totalEarned: '157.25',
      activePositions: userPositions.length || 3,
      claimableRewards: '23.45',
      totalValue: '1,407.25' // totalStaked + totalEarned
    }
  }, [userPositions])

  // Portfolio allocation across different risk levels
  const portfolioAllocation = useMemo(() => {
    const total = parseFloat(userStats.totalStaked)
    return {
      low: { amount: total * 0.4, percentage: 40 },
      medium: { amount: total * 0.35, percentage: 35 },
      high: { amount: total * 0.25, percentage: 25 }
    }
  }, [userStats.totalStaked])

  // Yield performance metrics
  const performanceMetrics = useMemo(() => {
    const totalStaked = parseFloat(userStats.totalStaked)
    const totalEarned = parseFloat(userStats.totalEarned)
    
    return {
      totalReturn: totalStaked > 0 ? ((totalEarned / totalStaked) * 100).toFixed(2) : '0.00',
      avgApy: '22.5', // Weighted average of all positions
      monthlyReturn: '156.50',
      yearProjection: '1,875.00'
    }
  }, [userStats])

  // Fetch user positions (mock for now)
  useEffect(() => {
    if (!address) {
      setUserPositions([])
      return
    }

    setIsLoading(true)
    
    // Simulate fetching user positions
    setTimeout(() => {
      const mockPositions = [
        {
          id: '1',
          poolId: 'usdt-vault',
          poolName: 'USDT Yield Vault',
          stakedAmount: '500.00',
          earnedAmount: '62.50',
          apy: '18.5',
          startDate: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
          lockPeriod: 0,
          canWithdraw: true
        },
        {
          id: '2',
          poolId: 'high-yield',
          poolName: 'High Yield Pool',
          stakedAmount: '400.00',
          earnedAmount: '55.00',
          apy: '25.0',
          startDate: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
          lockPeriod: 30,
          canWithdraw: false
        },
        {
          id: '3',
          poolId: 'premium-vault',
          poolName: 'Premium Vault',
          stakedAmount: '350.00',
          earnedAmount: '39.75',
          apy: '35.0',
          startDate: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
          lockPeriod: 90,
          canWithdraw: false
        }
      ]
      
      setUserPositions(mockPositions)
      setIsLoading(false)
    }, 1000)
  }, [address])

  const refetchAll = () => {
    refetchBalance()
    refetchAllowance()
    // Would also refetch positions in production
  }

  return {
    // User data
    userStats,
    userPositions,
    portfolioAllocation,
    performanceMetrics,
    
    // Contract data
    usdtBalance: usdtBalance ? parseFloat(formatUnits(usdtBalance as bigint, DECIMALS)) : 0,
    allowance: allowance ? parseFloat(formatUnits(allowance as bigint, DECIMALS)) : 0,
    
    // Pool data
    yieldPools,
    
    // State
    isLoading,
    
    // Actions
    refetchAll
  }
}
