import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { CONTRACTS, APP_CONFIG } from '../config/contracts'
import { useMemo } from 'react'
import { showSuccessToast, showErrorToast, showTransactionPendingToast } from '../utils/toast'

const DECIMALS = APP_CONFIG.decimals

// Individual savings/deposit hooks
export const useSavingsBalance = () => {
  const { address } = useAccount()

  const { data: usdtBalance, refetch: refetchUSDT } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const { data: allowanceData, refetch: refetchAllowance } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'allowance',
    args: [address as `0x${string}`, CONTRACTS.PiggyVault.address],
    enabled: !!address,
  })

  return {
    usdtBalance: usdtBalance ? formatUnits(usdtBalance as bigint, DECIMALS) : '0',
    allowance: allowanceData ? formatUnits(allowanceData as bigint, DECIMALS) : '0',
    refetch: () => {
      refetchUSDT()
      refetchAllowance()
    }
  }
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

  // For now, return empty array until we create deposits
  // After creating deposits, we can enhance this to fetch actual deposit details
  return {
    userDeposits: [] as any[],
    isLoading: false,
    totalDeposited: '0',
    refetch: refetchDepositIds
  }
}

export const useSavingsPlans = () => {
  // Get current APY from YieldManager
  const { data: currentAPY } = useContractRead({
    ...CONTRACTS.YieldManager,
    functionName: 'getCurrentAPY',
  })

  // Get savings plan details from contract for each supported plan
  const { data: plan30 } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'savingsPlans',
    args: [BigInt(30)],
  })

  const { data: plan90 } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'savingsPlans',
    args: [BigInt(90)],
  })

  const { data: plan180 } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'savingsPlans',
    args: [BigInt(180)],
  })

  const { data: plan365 } = useContractRead({
    ...CONTRACTS.PiggyVault,
    functionName: 'savingsPlans',
    args: [BigInt(365)],
  })

  const planData = [
    { days: 30, data: plan30 },
    { days: 90, data: plan90 },
    { days: 180, data: plan180 },
    { days: 365, data: plan365 }
  ]

  const savingsPlans = planData.map(({ days, data }) => {
    if (!data) {
      return {
        id: days,
        name: `${days} Days`,
        duration: days,
        apy: 3.0,
        minAmount: 10,
        maxAmount: 1000,
        description: `Lock your savings for ${days} days`,
        minAmountWei: parseUnits('10', DECIMALS), // Now using USDT decimals (6)
        maxAmountWei: parseUnits('1000', DECIMALS) // Now using USDT decimals (6)
      }
    }

    // Handle the contract response structure
    const planData = data as any
    
    // Now that the PiggyVault contract is fixed to use 6 decimals (matching USDT)
    // we can use the standard DECIMALS for everything
    const apyBasisPoints = planData.apyBasisPoints || BigInt(300)
    const minAmountWei = planData.minAmount || parseUnits('10', DECIMALS)
    const maxAmountWei = planData.maxAmount || parseUnits('1000', DECIMALS)
    const isActive = planData.isActive !== false

    const apy = Number(apyBasisPoints) / 100 // Convert basis points to percentage
    const minAmount = Number(formatUnits(minAmountWei, DECIMALS))
    const maxAmount = Number(formatUnits(maxAmountWei, DECIMALS))

    return {
      id: days,
      name: `${days} Days`,
      duration: days,
      apy,
      minAmount,
      maxAmount,
      minAmountWei,
      maxAmountWei,
      description: `Lock your savings for ${days} days and earn ${apy.toFixed(1)}% APY`,
      isActive
    }
  })

  return {
    savingsPlans: savingsPlans.filter(plan => plan.isActive !== false),
    isLoading: !plan30 || !plan90 || !plan180 || !plan365
  }
}

export const useCreateDeposit = () => {
  const { address } = useAccount()
  const { savingsPlans } = useSavingsPlans()

  // Approve USDT spending
  const { data: approveData, write: writeApprove, isLoading: isApproving } = useContractWrite({
    ...CONTRACTS.MockUSDT,
    functionName: 'approve',
  })

  const { isLoading: isApprovingTx } = useWaitForTransaction({
    hash: approveData?.hash,
    enabled: !!approveData?.hash,
    onSuccess: () => {
      showSuccessToast('USDT spending approved!')
    },
    onError: (error) => {
      console.error('Approval failed:', error)
      showErrorToast('Approval failed. Please try again.')
    }
  })

  // Create deposit
  const { data: depositData, write: writeDeposit, isLoading: isCreating } = useContractWrite({
    ...CONTRACTS.PiggyVault,
    functionName: 'createDeposit',
  })

  const { isLoading: isCreatingTx } = useWaitForTransaction({
    hash: depositData?.hash,
    enabled: !!depositData?.hash,
    onSuccess: () => {
      showSuccessToast('Deposit created successfully! Refreshing data...')
      // Trigger refetch of all savings data after a short delay
      setTimeout(() => {
        window.location.reload() // Force page refresh to ensure all contract data is updated
      }, 1500)
    },
    onError: (error) => {
      console.error('Deposit creation failed:', error)
      showErrorToast('Deposit creation failed. Please try again.')
    }
  })

  const validateAmount = (amount: string, planDays: number) => {
    const plan = savingsPlans.find(p => p.id === planDays)
    if (!plan) {
      throw new Error('Invalid savings plan selected')
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error('Please enter a valid amount')
    }

    // Use the properly converted amounts (already in USDT format)
    if (amountNum < plan.minAmount) {
      throw new Error(`Minimum deposit for ${planDays} days plan is ${plan.minAmount} USDT`)
    }

    if (amountNum > plan.maxAmount) {
      throw new Error(`Maximum deposit for ${planDays} days plan is ${plan.maxAmount.toLocaleString()} USDT`)
    }

    return true
  }

  const approveUSDT = async (amount: string, planDays: number) => {
    if (!writeApprove || !address) throw new Error('Not connected')
    
    try {
      validateAmount(amount, planDays)
      // Approve the actual USDT amount that will be transferred (6 decimals)
      const amountInWei = parseUnits(amount, DECIMALS)
      showTransactionPendingToast('Approving USDT spending...')
      writeApprove({
        args: [CONTRACTS.PiggyVault.address, amountInWei]
      })
    } catch (error) {
      console.error('Approve error:', error)
      throw error
    }
  }

  const createDeposit = async (amount: string, planDays: number) => {
    if (!writeDeposit || !address) throw new Error('Not connected')
    
    try {
      validateAmount(amount, planDays)
      // Now that PiggyVault is fixed to use 6 decimals, we can use DECIMALS consistently
      const amountInWei = parseUnits(amount, DECIMALS)
      
      showTransactionPendingToast('Creating your savings deposit...')
      writeDeposit({
        args: [amountInWei, BigInt(planDays)]
      })
    } catch (error) {
      console.error('Create deposit error:', error)
      throw error
    }
  }

  return {
    approveUSDT,
    createDeposit,
    validateAmount,
    isApproving: isApproving || isApprovingTx,
    isCreating: isCreating || isCreatingTx,
  }
}

export const useWithdrawDeposit = () => {
  const { address } = useAccount()

  // Normal withdrawal
  const { data: withdrawData, write: writeWithdraw, isLoading: isWithdrawing } = useContractWrite({
    ...CONTRACTS.PiggyVault,
    functionName: 'withdrawDeposit',
  })

  const { isLoading: isWithdrawingTx } = useWaitForTransaction({
    hash: withdrawData?.hash,
    enabled: !!withdrawData?.hash,
    onSuccess: () => {
      showSuccessToast('Deposit withdrawn successfully!')
    },
    onError: (error) => {
      console.error('Withdrawal failed:', error)
      showErrorToast('Withdrawal failed. Please try again.')
    }
  })

  // Emergency withdrawal
  const { data: emergencyData, write: writeEmergencyWithdraw, isLoading: isEmergencyWithdrawing } = useContractWrite({
    ...CONTRACTS.PiggyVault,
    functionName: 'emergencyWithdraw',
  })

  const { isLoading: isEmergencyWithdrawingTx } = useWaitForTransaction({
    hash: emergencyData?.hash,
    enabled: !!emergencyData?.hash,
    onSuccess: () => {
      showSuccessToast('Emergency withdrawal completed!')
    },
    onError: (error) => {
      console.error('Emergency withdrawal failed:', error)
      showErrorToast('Emergency withdrawal failed. Please try again.')
    }
  })

  const withdrawDeposit = async (depositId: number) => {
    if (!writeWithdraw || !address) throw new Error('Not connected')
    
    try {
      showTransactionPendingToast('Processing withdrawal...')
      writeWithdraw({
        args: [BigInt(depositId)]
      })
    } catch (error) {
      console.error('Withdraw error:', error)
      throw error
    }
  }

  const emergencyWithdraw = async (depositId: number) => {
    if (!writeEmergencyWithdraw || !address) throw new Error('Not connected')
    
    try {
      showTransactionPendingToast('Processing emergency withdrawal...')
      writeEmergencyWithdraw({
        args: [BigInt(depositId)]
      })
    } catch (error) {
      console.error('Emergency withdraw error:', error)
      throw error
    }
  }

  return {
    withdrawDeposit,
    emergencyWithdraw,
    isWithdrawing: isWithdrawing || isWithdrawingTx,
    isEmergencyWithdrawing: isEmergencyWithdrawing || isEmergencyWithdrawingTx,
  }
}

export const useUserNFTRewards = () => {
  const { address } = useAccount()

  const { data: userNFTsData, refetch } = useContractRead({
    ...CONTRACTS.NFTRewards,
    functionName: 'getUserNFTSummary',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const { data: userAchievementsData } = useContractRead({
    ...CONTRACTS.NFTRewards,
    functionName: 'getUserAchievements',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const { data: balanceData } = useContractRead({
    ...CONTRACTS.NFTRewards,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  return {
    userNFTCount: userNFTsData ? Number(userNFTsData) : 0,
    userAchievements: userAchievementsData || [],
    nftBalance: balanceData ? Number(balanceData) : 0,
    refetch
  }
}

// Main hook combining all savings functionality
export const useSavingsData = () => {
  const { address } = useAccount()
  const { usdtBalance, allowance, refetch: refetchBalance } = useSavingsBalance()
  const { userDeposits, isLoading: isLoadingDeposits, totalDeposited, refetch: refetchDeposits } = useUserDeposits()
  const { savingsPlans: contractPlans, isLoading: isLoadingPlans } = useSavingsPlans()
  const { userNFTCount, userAchievements, nftBalance, refetch: refetchNFTs } = useUserNFTRewards()
  const createDepositHook = useCreateDeposit()
  const withdrawHook = useWithdrawDeposit()

  // Map contract plans to UI format
  const savingsPlans = useMemo(() => {
    const planConfigs = [
      { days: 30, color: 'blue', risk: 'Low', popular: false },
      { days: 90, color: 'green', risk: 'Low', popular: true },
      { days: 180, color: 'purple', risk: 'Medium', popular: false },
      { days: 365, color: 'orange', risk: 'High', popular: false }
    ]

    return contractPlans.map(contractPlan => {
      const config = planConfigs.find(c => c.days === contractPlan.id) || { days: contractPlan.id, color: 'blue', risk: 'Low', popular: false }
      return {
        ...contractPlan,
        days: contractPlan.id,
        color: config.color,
        risk: config.risk,
        popular: config.popular,
        features: [
          `${contractPlan.apy.toFixed(1)}% APY guaranteed`,
          `${contractPlan.id} days lock period`,
          `Min deposit: ${contractPlan.minAmount} USDT`,
          `Max deposit: ${contractPlan.maxAmount.toLocaleString()} USDT`,
          'Automated compound interest',
          'NFT rewards on completion'
        ]
      }
    })
  }, [contractPlans])

  const portfolioSummary = useMemo(() => {
    const totalBalance = parseFloat(usdtBalance) + parseFloat(totalDeposited)
    const activeDeposits = userDeposits.filter(d => !d.isWithdrawn).length
    const totalInterestEarned = userDeposits.reduce((sum, deposit) => sum + parseFloat(deposit.accruedInterest), 0)

    return {
      totalBalance,
      totalDeposited: parseFloat(totalDeposited),
      availableBalance: parseFloat(usdtBalance),
      totalInterestEarned,
      activeDeposits,
      userNFTCount,
      allowance: parseFloat(allowance)
    }
  }, [usdtBalance, totalDeposited, userDeposits, userNFTCount, allowance])

  const refetchAll = () => {
    refetchBalance()
    refetchDeposits()
    refetchNFTs()
  }

  return {
    portfolioSummary,
    userDeposits,
    savingsPlans,
    userAchievements,
    isLoadingDeposits,
    isConnected: !!address,
    createDepositHook,
    withdrawHook,
    refetchAll
  }
}
