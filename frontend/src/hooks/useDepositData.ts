import { useContractRead } from 'wagmi'
import { formatUnits } from 'viem'
import { CONTRACTS, APP_CONFIG } from '../config/contracts'

const DECIMALS = APP_CONFIG.decimals

export const useDepositData = (depositId: bigint | undefined) => {
  const { data: depositData, isLoading, refetch } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'getDeposit',
    args: depositId ? [depositId] : undefined,
    enabled: !!depositId,
  } as any) // Type assertion to handle wagmi v1 types

  const formattedDeposit = depositData ? (() => {
    const deposit = depositData as any
    
    // Determine category based on plan days
    let category = 'starter'
    const planDays = Number(deposit.planDays)
    if (planDays >= 365) category = 'champion'
    else if (planDays >= 180) category = 'investor'
    else if (planDays >= 90) category = 'saver'
    
    // Calculate interest rate based on plan
    let interestRate = '12' // default
    if (planDays === 30) interestRate = '12'
    else if (planDays === 90) interestRate = '15'
    else if (planDays === 180) interestRate = '18'
    else if (planDays === 365) interestRate = '20'
    
    const amount = parseFloat(formatUnits(deposit.amount as bigint, DECIMALS))
    const accruedInterest = parseFloat(formatUnits(deposit.accruedInterest as bigint, DECIMALS))
    const currentTime = Date.now()
    const maturityTime = Number(deposit.maturityTime) * 1000 // Convert to milliseconds
    const createdAt = Number(deposit.createdAt) * 1000
    
    return {
      id: Number(depositId).toString(),
      user: deposit.user,
      amount: amount.toString(),
      planDays: Number(deposit.planDays),
      createdAt,
      maturityTime,
      isWithdrawn: deposit.isWithdrawn,
      accruedInterest: accruedInterest.toString(),
      // Additional properties for UI
      category,
      formattedAmount: amount.toFixed(2),
      interestRate,
      duration: Number(deposit.planDays),
      maturityDate: maturityTime,
      formattedCurrentValue: (amount + accruedInterest).toFixed(2),
      isActive: !deposit.isWithdrawn && currentTime < maturityTime,
      canWithdraw: currentTime >= maturityTime && !deposit.isWithdrawn,
      daysRemaining: Math.max(0, Math.ceil((maturityTime - currentTime) / (24 * 60 * 60 * 1000)))
    }
  })() : null

  return {
    depositData: formattedDeposit,
    isLoading,
    refetch
  }
}
