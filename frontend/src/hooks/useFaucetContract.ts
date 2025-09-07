import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { formatUnits } from 'viem'
import { CONTRACTS, APP_CONFIG } from '../config/contracts'

const DECIMALS = APP_CONFIG.decimals

// Hook to get faucet statistics
export function useFaucetStats() {
  const { data, isLoading, refetch } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'getFaucetStats',
    enabled: true,
  })

  const faucetStats = data ? {
    totalDistributed: formatUnits((data as [bigint, bigint, bigint])[0], DECIMALS),
    remainingSupply: formatUnits((data as [bigint, bigint, bigint])[1], DECIMALS),
    uniqueUsers: Number((data as [bigint, bigint, bigint])[2])
  } : null

  return { faucetStats, isLoading, refetch }
}

// Hook to get user faucet statistics
export function useUserFaucetStats() {
  const { address } = useAccount()
  
  const { data, isLoading, refetch } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'getUserStats',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const userStats = data ? {
    totalReceived: formatUnits((data as any).totalReceived, DECIMALS),
    claimCount: Number((data as any).claimCount),
    firstClaimTime: Number((data as any).firstClaimTime),
    lastActivity: Number((data as any).lastActivity)
  } : null

  return { userStats, isLoading, refetch }
}

// Hook to check if user can claim from faucet
export function useCanClaimFaucet() {
  const { address } = useAccount()
  
  const { data, isLoading, refetch } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'canClaimFaucet',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  return { canClaim: !!data, isLoading, refetch }
}

// Hook to get time until next claim
export function useTimeUntilNextClaim() {
  const { address } = useAccount()
  
  const { data, isLoading, refetch } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'timeUntilNextClaim',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  return { timeUntilNextClaim: data ? Number(data) : 0, isLoading, refetch }
}

// Hook to get user USDT balance
export function useUSDTBalance() {
  const { address } = useAccount()
  
  const { data, isLoading, refetch } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const balance = data ? formatUnits(data as bigint, DECIMALS) : '0'
  
  return { balance, isLoading, refetch }
}

// Hook to get faucet amount
export function useFaucetAmount() {
  const { data, isLoading } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'FAUCET_AMOUNT',
    enabled: true,
  })

  const faucetAmount = data ? formatUnits(data as bigint, DECIMALS) : '0'
  
  return { faucetAmount, isLoading }
}

// Hook to get faucet cooldown
export function useFaucetCooldown() {
  const { data, isLoading } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'FAUCET_COOLDOWN',
    enabled: true,
  })

  const cooldownSeconds = data ? Number(data) : 0
  
  return { cooldownSeconds, isLoading }
}

// Hook to claim from faucet
export function useClaimFaucet() {
  const { address } = useAccount()
  
  const { data, write, isLoading: isWriteLoading } = useContractWrite({
    ...CONTRACTS.MockUSDT,
    functionName: 'claimFromFaucet',
  })

  const { isLoading: isWaiting } = useWaitForTransaction({
    hash: data?.hash,
    enabled: !!data?.hash,
  })

  const claimFromFaucet = async () => {
    if (!address) throw new Error('No wallet connected')
    if (!write) throw new Error('Contract write function not available')
    
    try {
      const result = write()
      return result
    } catch (error) {
      console.error('Contract write error:', error)
      throw error
    }
  }

  return {
    claimFromFaucet,
    isPending: isWriteLoading,
    isWaiting,
    isLoading: isWriteLoading || isWaiting,
    txHash: data?.hash
  }
}
