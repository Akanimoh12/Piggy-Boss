import { useAccount, useContractRead } from 'wagmi'
import { formatUnits } from 'viem'
import { CONTRACTS, APP_CONFIG } from '../config/contracts'
import { useMemo, useEffect, useState } from 'react'

const DECIMALS = APP_CONFIG.decimals

// Individual contract hooks for dashboard
export const useUserBalances = () => {
  const { address } = useAccount()

  const { data: usdtBalance, refetch: refetchUSDT } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const { data: totalDepositedData, refetch: refetchDeposited } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'userDeposits',
    args: [address as `0x${string}`, BigInt(0)], // Get the total for user
    enabled: !!address,
  })

  return {
    usdtBalance: usdtBalance ? formatUnits(usdtBalance as bigint, DECIMALS) : '0',
    totalDeposited: totalDepositedData ? formatUnits(totalDepositedData as bigint, DECIMALS) : '0',
    refetch: () => {
      refetchUSDT()
      refetchDeposited()
    }
  }
}

export const useUserStatistics = () => {
  const { address } = useAccount()

  const { data: userStatsData, refetch } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'getContractStats',
    enabled: !!address,
  })

  const userStats = useMemo(() => {
    if (!userStatsData) return null
    
    const [totalDeposits, totalUsers, totalRewards] = userStatsData as [bigint, bigint, bigint]
    
    return {
      totalDeposits: formatUnits(totalDeposits, DECIMALS),
      totalUsers: Number(totalUsers),
      totalRewards: formatUnits(totalRewards, DECIMALS)
    }
  }, [userStatsData])

  return { userStats, refetch }
}

export const useUserDeposits = () => {
  const { address } = useAccount()

  // Get user deposit IDs using the correct contract function
  const { data: userDepositIds, refetch: refetchDepositIds } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'getUserDeposits',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const userDeposits = useMemo(() => {
    if (!userDepositIds || (userDepositIds as bigint[]).length === 0) return []
    
    // Convert deposit IDs to readable format
    return (userDepositIds as bigint[]).map((id, index) => ({
      id: Number(id),
      amount: '100.00', // This would need to be fetched from individual deposit details
      planDays: 30,
      timestamp: Date.now() - index * 24 * 60 * 60 * 1000,
      type: 'deposit',
      status: 'active'
    }))
  }, [userDepositIds])

  return { 
    userDeposits, 
    isLoading: false, 
    refetch: refetchDepositIds 
  }
}

export const usePortfolioPerformance = () => {
  const { address } = useAccount()
  const [performanceData, setPerformanceData] = useState<any[]>([])

  useEffect(() => {
    // Mock portfolio performance data
    // In production, this would fetch historical data from events or subgraph
    const generatePerformanceData = () => {
      const data = []
      const today = new Date()
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        // Mock performance calculation
        const baseValue = 1000
        const growth = Math.sin(i * 0.2) * 100 + Math.random() * 50
        
        data.push({
          date: date.toISOString().split('T')[0],
          value: baseValue + growth,
          deposits: baseValue,
          rewards: Math.max(0, growth)
        })
      }
      
      return data
    }

    if (address) {
      setPerformanceData(generatePerformanceData())
    }
  }, [address])

  return performanceData
}

export const useRecentActivity = () => {
  const { address } = useAccount()
  const { userDeposits } = useUserDeposits()
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    if (!address) return

    // Transform deposits into activity format
    const activityList = [
      ...userDeposits.map(deposit => ({
        id: `deposit-${deposit.id}`,
        type: 'deposit',
        amount: parseFloat(deposit.amount),
        date: new Date(deposit.timestamp).toLocaleDateString(),
        time: new Date(deposit.timestamp).toLocaleTimeString(),
        status: 'completed',
        hash: `0x${Math.random().toString(16).substr(2, 40)}`, // Mock hash
      })),
      // Add mock reward activities
      {
        id: 'reward-1',
        type: 'reward',
        amount: 12.50,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: 'completed',
        hash: `0x${Math.random().toString(16).substr(2, 40)}`,
      },
      {
        id: 'reward-2', 
        type: 'reward',
        amount: 8.75,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(),
        time: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleTimeString(),
        status: 'completed',
        hash: `0x${Math.random().toString(16).substr(2, 40)}`,
      }
    ]

    // Sort by timestamp (most recent first)
    activityList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    setActivities(activityList.slice(0, 10)) // Last 10 activities
  }, [userDeposits, address])

  return activities
}

export const useYieldManagerStats = () => {
  // Get distributed rewards
  const { data: totalRewardsData } = useContractRead({
    ...CONTRACTS.YieldManager,
    functionName: 'distributedRewards',
  })

  // Get APY for 30-day plan
  const { data: apyData } = useContractRead({
    ...CONTRACTS.YieldManager,
    functionName: 'getAPYForPlan',
    args: [BigInt(30)],
  })

  return {
    currentAPY: apyData ? Number(apyData) / 100 : 0, // Convert from basis points
    totalRewards: totalRewardsData ? formatUnits(totalRewardsData as bigint, DECIMALS) : '0',
  }
}

export const useNFTRewardsStats = () => {
  const { address } = useAccount()

  const { data: userNFTsData } = useContractRead({
    ...CONTRACTS.NFTRewards,
    functionName: 'getUserNFTSummary',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const { data: totalSupplyData } = useContractRead({
    ...CONTRACTS.NFTRewards,
    functionName: 'getTotalSupply',
  })

  return {
    userNFTs: userNFTsData ? Number(userNFTsData) : 0,
    totalNFTs: totalSupplyData ? Number(totalSupplyData) : 0,
  }
}

// Main dashboard hook that combines all data
export const useDashboardData = () => {
  const { address } = useAccount()
  const { usdtBalance, totalDeposited, refetch: refetchBalances } = useUserBalances()
  const { userStats, refetch: refetchStats } = useUserStatistics()
  const { currentAPY, totalRewards } = useYieldManagerStats()
  const { userNFTs, totalNFTs } = useNFTRewardsStats()
  const performanceData = usePortfolioPerformance()
  const recentActivity = useRecentActivity()

  const dashboardStats = useMemo(() => {
    const totalBalance = parseFloat(usdtBalance) + parseFloat(totalDeposited)
    const totalPortfolio = parseFloat(totalDeposited) + parseFloat(totalRewards)
    
    return {
      totalBalance,
      usdtBalance: parseFloat(usdtBalance),
      totalDeposited: parseFloat(totalDeposited),
      totalRewards: parseFloat(totalRewards),
      totalPortfolio,
      currentAPY,
      userNFTs,
      totalNFTs,
      globalStats: userStats
    }
  }, [usdtBalance, totalDeposited, totalRewards, currentAPY, userNFTs, totalNFTs, userStats])

  const refetchAll = () => {
    refetchBalances()
    refetchStats()
  }

  return {
    dashboardStats,
    performanceData,
    recentActivity,
    isConnected: !!address,
    address,
    refetchAll
  }
}
