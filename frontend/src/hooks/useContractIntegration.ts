import { useState, useEffect, useCallback } from 'react'
import { 
  useAccount, 
  useContractRead, 
  useContractWrite, 
  useWaitForTransaction,
  useBalance 
} from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { CONTRACTS, APP_CONFIG } from '../config/contracts'

const DECIMALS = APP_CONFIG.decimals // USDT decimals

// ========== USDT Contract Hooks ==========
export function useMockUSDT() {
  const { address } = useAccount()
  const [usdtBalance, setUsdtBalance] = useState<string>("0")
  const [loading, setLoading] = useState(false)

  // Read balance
  const { data: balanceData, refetch: refetchBalance } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Read allowance
  const { data: allowanceData, refetch: refetchAllowance } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'allowance',
    args: [address as `0x${string}`, CONTRACTS.PiggyVault.address],
    enabled: !!address,
  })

  // Update balance state when data changes
  useEffect(() => {
    if (balanceData) {
      setUsdtBalance(formatUnits(balanceData as bigint, DECIMALS))
    }
  }, [balanceData])

  // Approve spending
  const { data: approveData, write: writeApprove, isPending: isPendingApprove } = useContractWrite({
    ...CONTRACTS.MockUSDT,
    functionName: 'approve',
  })

  // Wait for approval transaction
  const { isLoading: isApproving } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => {
      refetchAllowance()
    },
  })

  // Claim tokens from faucet
  const { data: claimData, write: writeClaim, isPending: isPendingClaim } = useContractWrite({
    ...CONTRACTS.MockUSDT,
    functionName: 'claimTokens',
  })

  // Wait for claim transaction
  const { isLoading: isClaiming } = useWaitForTransaction({
    hash: claimData?.hash,
    onSuccess: () => {
      refetchBalance()
    },
  })

  // Approve function
  const approve = useCallback((amount?: string) => {
    if (!amount || !address) return Promise.reject("Invalid amount or address")
    
    try {
      const amountBigInt = parseUnits(amount, DECIMALS)
      return writeApprove({ args: [CONTRACTS.PiggyVault.address, amountBigInt] })
    } catch (error) {
      return Promise.reject(error)
    }
  }, [address, writeApprove])

  // Claim tokens function
  const claimTokens = useCallback(() => {
    if (!address) return Promise.reject("No address")
    
    try {
      return writeClaim()
    } catch (error) {
      return Promise.reject(error)
    }
  }, [address, writeClaim])

  return {
    balance: usdtBalance,
    usdtBalance,
    allowance: allowanceData ? formatUnits(allowanceData as bigint, DECIMALS) : "0",
    approve,
    isApproving: isPendingApprove || isApproving,
    claimTokens,
    isClaiming: isPendingClaim || isClaiming,
    refetchBalance
  }
}

// ========== PiggyVault Contract Hooks ==========
export function usePiggyVault() {
  const { address } = useAccount()
  const [userSummary, setUserSummary] = useState({
    totalDeposited: "0",
    totalWithdrawn: "0",
    currentBalance: "0",
    totalRewards: "0",
    depositCount: 0,
    totalSaved: "0",
    totalEarned: "0",
    activeDeposits: 0
  })

  // Read user deposits
  const { data: userDepositsData, refetch: refetchUserDeposits } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'getUserDeposits',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Read total deposited
  const { data: totalDepositedData, refetch: refetchTotalDeposited } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'getTotalDeposited',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Read total rewards
  const { data: totalRewardsData, refetch: refetchTotalRewards } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'getTotalRewards',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Read contract stats
  const { data: contractStatsData } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'getVaultStats',
    enabled: true,
  })

  // Read current interest rate
  const { data: currentInterestData } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'getCurrentInterestRate',
    enabled: true,
  })

  // Create deposit
  const { data: createDepositData, write: writeCreateDeposit, isPending: isPendingCreateDeposit } = useContractWrite({
    ...CONTRACTS.PiggyVault,
    functionName: 'createDeposit',
  })

  // Wait for create deposit transaction
  const { isLoading: isCreatingDeposit } = useWaitForTransaction({
    hash: createDepositData?.hash,
    onSuccess: () => {
      refetchUserDeposits()
      refetchTotalDeposited()
      refetchTotalRewards()
    },
  })

  // Withdraw deposit
  const { data: withdrawDepositData, write: writeWithdrawDeposit, isPending: isPendingWithdraw } = useContractWrite({
    ...CONTRACTS.PiggyVault,
    functionName: 'withdrawDeposit',
  })

  // Wait for withdraw transaction
  const { isLoading: isWithdrawing } = useWaitForTransaction({
    hash: withdrawDepositData?.hash,
    onSuccess: () => {
      refetchUserDeposits()
      refetchTotalDeposited()
      refetchTotalRewards()
    },
  })

  // Emergency withdraw
  const { data: emergencyWithdrawData, write: writeEmergencyWithdraw, isPending: isPendingEmergencyWithdraw } = useContractWrite({
    ...CONTRACTS.PiggyVault,
    functionName: 'emergencyWithdraw',
  })

  // Wait for emergency withdraw transaction
  const { isLoading: isEmergencyWithdrawing } = useWaitForTransaction({
    hash: emergencyWithdrawData?.hash,
    onSuccess: () => {
      refetchUserDeposits()
      refetchTotalDeposited()
      refetchTotalRewards()
    },
  })

  // Update user summary state when data changes
  useEffect(() => {
    if (totalDepositedData && totalRewardsData && userDepositsData) {
      const totalDeposited = formatUnits(totalDepositedData as bigint, DECIMALS)
      const totalRewards = formatUnits(totalRewardsData as bigint, DECIMALS)
      const deposits = userDepositsData as bigint[]

      setUserSummary({
        totalDeposited,
        totalWithdrawn: "0", // Will need to add this function to contract
        currentBalance: totalDeposited,
        totalRewards,
        depositCount: deposits.length,
        totalSaved: totalDeposited,
        totalEarned: totalRewards,
        activeDeposits: deposits.length
      })
    }
  }, [totalDepositedData, totalRewardsData, userDepositsData])

  // Create deposit function
  const createDeposit = useCallback((amount?: string, days?: number) => {
    if (!amount || !days || !address) return Promise.reject("Invalid parameters")
    
    try {
      const amountBigInt = parseUnits(amount, DECIMALS)
      return writeCreateDeposit({ args: [amountBigInt, BigInt(days)] })
    } catch (error) {
      return Promise.reject(error)
    }
  }, [address, writeCreateDeposit])

  // Withdraw deposit function
  const withdrawDeposit = useCallback((depositId?: number) => {
    if (depositId === undefined || !address) return Promise.reject("Invalid depositId or address")
    
    try {
      return writeWithdrawDeposit({ args: [BigInt(depositId)] })
    } catch (error) {
      return Promise.reject(error)
    }
  }, [address, writeWithdrawDeposit])

  // Emergency withdraw function
  const emergencyWithdraw = useCallback((depositId?: number) => {
    if (depositId === undefined || !address) return Promise.reject("Invalid depositId or address")
    
    try {
      return writeEmergencyWithdraw({ args: [BigInt(depositId)] })
    } catch (error) {
      return Promise.reject(error)
    }
  }, [address, writeEmergencyWithdraw])

  return {
    userSummary,
    userDeposits: userDepositsData ? (userDepositsData as bigint[]) : [],
    userDepositIds: userDepositsData ? (userDepositsData as bigint[]).map(id => Number(id)) : [],
    contractStats: {
      totalDeposits: contractStatsData ? formatUnits(contractStatsData[0] as bigint, DECIMALS) : "0",
      totalUsers: contractStatsData ? Number(contractStatsData[1]) : 0,
      totalRewardsPaid: contractStatsData ? formatUnits(contractStatsData[2] as bigint, DECIMALS) : "0"
    },
    currentInterest: currentInterestData ? formatUnits(currentInterestData as bigint, 2) : "0", // Assuming 2 decimals for percentage
    deposit: createDeposit, // Legacy support
    createDeposit,
    isCreatingDeposit: isPendingCreateDeposit || isCreatingDeposit,
    withdrawDeposit,
    emergencyWithdraw,
    isWithdrawing: isPendingWithdraw || isWithdrawing,
    isEmergencyWithdrawing: isPendingEmergencyWithdraw || isEmergencyWithdrawing
  }
}

// ========== NFT Rewards Contract Hooks ==========
export function useNFTRewards() {
  const { address } = useAccount()
  const [nftSummary, setNftSummary] = useState({
    totalNFTs: 0,
    rareNFTs: 0,
    achievements: 0,
    nftCount: 0
  })
  const [userTier, setUserTier] = useState({
    tier: 0,
    tierName: "Bronze"
  })

  // Read user NFT balance
  const { data: balanceData } = useContractRead({
    ...CONTRACTS.NFTRewards,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Read user tier
  const { data: tierData } = useContractRead({
    ...CONTRACTS.NFTRewards,
    functionName: 'getUserTier',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Read rare NFTs count
  const { data: rareNftsData } = useContractRead({
    ...CONTRACTS.NFTRewards,
    functionName: 'getRareNFTCount',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Read achievement points
  const { data: achievementPointsData } = useContractRead({
    ...CONTRACTS.NFTRewards,
    functionName: 'getAchievementPoints',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Update states when data changes
  useEffect(() => {
    if (balanceData) {
      const nftBalance = Number(balanceData)
      setNftSummary(prev => ({
        ...prev,
        totalNFTs: nftBalance,
        nftCount: nftBalance
      }))
    }

    if (rareNftsData) {
      setNftSummary(prev => ({
        ...prev,
        rareNFTs: Number(rareNftsData)
      }))
    }

    if (tierData) {
      const tier = Number(tierData)
      let tierName = "Bronze"
      
      switch(tier) {
        case 1: tierName = "Bronze"; break;
        case 2: tierName = "Silver"; break;
        case 3: tierName = "Gold"; break;
        case 4: tierName = "Platinum"; break;
        case 5: tierName = "Diamond"; break;
        default: tierName = "Bronze";
      }
      
      setUserTier({
        tier,
        tierName
      })
    }
  }, [balanceData, rareNftsData, tierData])

  return {
    nftBalance: nftSummary.totalNFTs,
    nftSummary,
    userTier,
    achievementPoints: achievementPointsData ? Number(achievementPointsData) : 0,
    rareNFTs: nftSummary.rareNFTs
  }
}

// ========== Deposit Details Hook ==========
export function useDepositDetails(depositId?: number) {
  const { address } = useAccount()
  const [depositDetails, setDepositDetails] = useState<any>(null)

  // Read deposit details
  const { data: depositData, refetch: refetchDeposit } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'getDeposit',
    args: [depositId ? BigInt(depositId) : BigInt(0)],
    enabled: !!depositId && !!address,
  })

  // Read current interest for this deposit
  const { data: interestData } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'calculateCurrentInterest',
    args: [depositId ? BigInt(depositId) : BigInt(0)],
    enabled: !!depositId && !!address,
  })

  // Update state when data changes
  useEffect(() => {
    if (depositData) {
      const [
        amount,
        interestRate,
        duration,
        createdAt,
        maturityTime,
        status,
      ] = depositData as [bigint, bigint, bigint, bigint, bigint, number]

      setDepositDetails({
        id: depositId,
        amount: formatUnits(amount, DECIMALS),
        interestRate: Number(interestRate) / 100, // Assuming 2 decimals for percentage
        duration: Number(duration),
        startDate: new Date(Number(createdAt) * 1000),
        maturityDate: new Date(Number(maturityTime) * 1000),
        currentValue: formatUnits(amount, DECIMALS), // Will update with interest
        status: status === 1 ? "active" : status === 2 ? "matured" : "withdrawn",
        planDays: Number(duration),
        createdAt: Number(createdAt),
        maturityTime: Number(maturityTime),
        accruedInterest: interestData ? formatUnits(interestData as bigint, DECIMALS) : "0"
      })
    }
  }, [depositData, depositId, interestData])

  return {
    depositDetails,
    currentInterest: interestData ? formatUnits(interestData as bigint, DECIMALS) : "0",
    refetchDeposit
  }
}

// ========== Additional Hooks for Components ==========
export const useUSDTBalance = () => {
  const { data: balance, isLoading } = useMockUSDT()
  return { 
    balance: balance?.usdtBalance || "0",
    isLoading 
  }
}

export const useTotalDeposited = () => {
  const { userSummary, isLoading } = usePiggyVault()
  return { 
    totalDeposited: userSummary.totalDeposited || "0",
    isLoading
  }
}

export const useTotalRewards = () => {
  const { userSummary, isLoading } = usePiggyVault()
  return { 
    totalRewards: userSummary.totalRewards || "0",
    isLoading 
  }
}

export const useVaultStats = () => {
  const { contractStats } = usePiggyVault()
  return {
    totalValue: contractStats.totalDeposits,
    totalDeposits: contractStats.totalDeposits,
    totalUsers: contractStats.totalUsers,
    totalRewards: contractStats.totalRewardsPaid
  }
}

// ========== Faucet Mock Functions ==========
export function useFaucet() {
  const { address } = useAccount()
  const { usdtBalance, claimTokens, isClaiming, refetchBalance } = useMockUSDT()
  const [canClaimFaucet, setCanClaimFaucet] = useState(false)
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState(0)
  const [userStats, setUserStats] = useState({
    totalClaimed: "0",
    totalReceived: "0",
    claimCount: 0,
    lastClaimTime: 0
  })
  
  // Read faucet user info
  const { data: userFaucetData } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'getFaucetUserInfo',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Read faucet stats
  const { data: faucetStatsData } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'getFaucetStats',
    enabled: true,
  })

  // Check if user can claim
  const { data: canClaimData } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'canClaimFromFaucet',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Update states when data changes
  useEffect(() => {
    if (userFaucetData) {
      const [
        totalClaimed, 
        claimCount,
        lastClaimTime
      ] = userFaucetData as [bigint, number, bigint]
      
      setUserStats({
        totalClaimed: formatUnits(totalClaimed, DECIMALS),
        totalReceived: formatUnits(totalClaimed, DECIMALS),
        claimCount,
        lastClaimTime: Number(lastClaimTime)
      })
      
      // Calculate time until next claim
      const now = Math.floor(Date.now() / 1000)
      const cooldown = APP_CONFIG.faucetCooldown
      const nextClaimTime = Number(lastClaimTime) + cooldown
      
      if (nextClaimTime > now) {
        setTimeUntilNextClaim(nextClaimTime - now)
        setCanClaimFaucet(false)
      } else {
        setTimeUntilNextClaim(0)
        setCanClaimFaucet(true)
      }
    }
    
    if (canClaimData !== undefined) {
      setCanClaimFaucet(!!canClaimData)
    }
  }, [userFaucetData, canClaimData])

  // Claim function
  const claimFaucet = useCallback(async () => {
    if (!address) return Promise.reject("No address")
    
    try {
      const result = await claimTokens()
      refetchBalance()
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  }, [address, claimTokens, refetchBalance])

  return {
    balance: usdtBalance,
    usdtBalance,
    canClaimFaucet,
    timeUntilNextClaim,
    userStats,
    faucetStats: {
      totalDistributed: faucetStatsData ? formatUnits(faucetStatsData[0] as bigint, DECIMALS) : "0",
      totalUsers: faucetStatsData ? Number(faucetStatsData[1]) : 0,
      remainingSupply: faucetStatsData ? formatUnits(faucetStatsData[2] as bigint, DECIMALS) : "0",
      uniqueUsers: faucetStatsData ? Number(faucetStatsData[1]) : 0,
      dailyLimit: APP_CONFIG.faucetAmount.toString()
    },
    claimFaucet,
    isClaimingFaucet: isClaiming
  }
}

// ========== User Activity Hook ==========
export function useUserActivity() {
  const { address } = useAccount()
  const { userDeposits } = usePiggyVault()
  const [depositHistory, setDepositHistory] = useState([])
  const [transactionHistory, setTransactionHistory] = useState([])
  const [activities, setActivities] = useState([])

  // This would require event listeners from the contract
  // For now just using the deposits data to create mock history

  useEffect(() => {
    if (userDeposits && userDeposits.length > 0) {
      // This is a placeholder - actual implementation would fetch events from blockchain
      // or from a backend that indexes these events
      console.log("Would fetch deposit history for user deposits:", userDeposits)
    }
  }, [userDeposits, address])

  // Returning mock data for now - would be replaced with real data
  return {
    depositHistory: [
      {
        id: 0,
        amount: "100.00",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        type: "deposit" as const
      },
      {
        id: 1,
        amount: "200.00",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        type: "deposit" as const
      },
      {
        id: 2,
        amount: "200.00",
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        type: "deposit" as const
      }
    ],
    transactionHistory: [],
    activities: [
      {
        id: '1',
        type: 'deposit',
        amount: 100,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        id: '2',
        type: 'reward',
        amount: 5.25,
        date: new Date(Date.now() - 48 * 60 * 60 * 1000),
        status: 'completed'
      }
    ]
  }
}
