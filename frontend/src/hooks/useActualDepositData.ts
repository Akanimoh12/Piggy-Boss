import { useState, useEffect } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { readContract } from '@wagmi/core'
import { formatUnits } from 'viem'
import { CONTRACTS, APP_CONFIG } from '../config/contracts'

const DECIMALS = APP_CONFIG.decimals

export const useActualDepositData = () => {
  const { address } = useAccount()
  const [deposits, setDeposits] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalEarnings, setTotalEarnings] = useState('0')
  const [totalDeposited, setTotalDeposited] = useState('0')

  // Get user's deposit IDs
  const { data: userDepositIds, refetch: refetchDepositIds } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'userDeposits',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Fetch actual deposit data from contracts
  useEffect(() => {
    if (!userDepositIds || !address || (userDepositIds as bigint[]).length === 0) {
      setDeposits([])
      setTotalEarnings('0')
      setTotalDeposited('0')
      return
    }

    const fetchRealDepositData = async () => {
      setIsLoading(true)
      const depositList = []
      let totalEarned = 0
      let totalAmount = 0

      try {
        for (const depositId of userDepositIds as bigint[]) {
          try {
            // Fetch actual deposit data from contract
            const depositData = await readContract({
              address: CONTRACTS.PiggyVault.address as `0x${string}`,
              abi: CONTRACTS.PiggyVault.abi,
              functionName: 'getDeposit',
              args: [depositId],
            }) as any

            // Fetch current pending rewards
            const pendingRewards = await readContract({
              address: CONTRACTS.PiggyVault.address as `0x${string}`,
              abi: CONTRACTS.PiggyVault.abi,
              functionName: 'getPendingRewards',
              args: [depositId],
            }) as bigint

            if (depositData) {
              // Determine category based on plan days
              let category = 'starter'
              const planDays = Number(depositData.planDays)
              if (planDays >= 365) category = 'champion'
              else if (planDays >= 180) category = 'investor'
              else if (planDays >= 90) category = 'saver'
              
              // Calculate interest rate based on plan
              let interestRate = '12' // default
              if (planDays === 30) interestRate = '12'
              else if (planDays === 90) interestRate = '15'
              else if (planDays === 180) interestRate = '18'
              else if (planDays === 365) interestRate = '20'
              
              const amount = parseFloat(formatUnits(depositData.amount as bigint, DECIMALS))
              const accruedInterest = parseFloat(formatUnits(depositData.accruedInterest as bigint, DECIMALS))
              const currentPendingRewards = parseFloat(formatUnits(pendingRewards, DECIMALS))
              const currentTime = Date.now()
              const maturityTime = Number(depositData.maturityTime) * 1000 // Convert to milliseconds
              const createdAt = Number(depositData.createdAt) * 1000
              
              // Use the higher of stored accrued interest or current pending rewards
              const totalCurrentRewards = Math.max(accruedInterest, currentPendingRewards)
              
              const formattedDeposit = {
                id: Number(depositId).toString(),
                user: depositData.user,
                amount: amount.toString(),
                planDays: Number(depositData.planDays),
                createdAt,
                maturityTime,
                isWithdrawn: depositData.isWithdrawn,
                accruedInterest: totalCurrentRewards.toString(),
                // Additional properties for UI
                category,
                formattedAmount: amount.toFixed(2),
                interestRate,
                duration: Number(depositData.planDays),
                maturityDate: maturityTime,
                formattedCurrentValue: (amount + totalCurrentRewards).toFixed(2),
                isActive: !depositData.isWithdrawn && currentTime < maturityTime,
                canWithdraw: currentTime >= maturityTime && !depositData.isWithdrawn,
                daysRemaining: Math.max(0, Math.ceil((maturityTime - currentTime) / (24 * 60 * 60 * 1000)))
              }

              depositList.push(formattedDeposit)
              totalEarned += totalCurrentRewards
              totalAmount += amount
            }
          } catch (error) {
            console.error(`Error fetching deposit ${depositId}:`, error)
          }
        }

        setDeposits(depositList)
        setTotalEarnings(totalEarned.toFixed(2))
        setTotalDeposited(totalAmount.toFixed(2))
      } catch (error) {
        console.error('Error fetching deposit details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRealDepositData()
  }, [userDepositIds, address])

  const refetchAll = () => {
    refetchDepositIds()
  }

  return {
    deposits,
    isLoading,
    totalEarnings,
    totalDeposited,
    refetchAll
  }
}
