// Simplified contract hooks with mock data for UI development
// TODO: Implement real contract integration once contracts are deployed

export const useUSDTBalance = () => {
  return {
    balance: 1500.0,
    rawBalance: BigInt(1500000000), 
    isLoading: false,
    refetch: () => Promise.resolve(),
  }
}

export const useUSDTAllowance = () => {
  return {
    allowance: 0,
    rawAllowance: BigInt(0),
    isLoading: false,
    refetch: () => Promise.resolve(),
  }
}

export const useApproveUSDT = () => {
  return {
    approve: async (amount: number) => {
      console.log('Approving USDT:', amount)
      return Promise.resolve({ hash: '0x123' })
    },
    isLoading: false,
    error: null,
  }
}

export const useFaucet = () => {
  return {
    claimFaucet: async () => {
      console.log('Claiming faucet')
      return Promise.resolve({ hash: '0x123' })
    },
    isLoading: false,
    error: null,
  }
}

export const useLastFaucetTime = () => {
  return {
    lastFaucetTime: 0,
    canClaimFaucet: true,
    isLoading: false,
    refetch: () => Promise.resolve(),
  }
}

export const useTotalDeposited = () => {
  return {
    totalDeposited: 5000.0,
    rawTotalDeposited: BigInt(5000000000), // 5000 USDT with 6 decimals
    isLoading: false,
    refetch: () => Promise.resolve(),
  }
}

export const useTotalRewards = () => {
  return {
    totalRewards: 247.52,
    rawTotalRewards: BigInt(247520000), // 247.52 USDT with 6 decimals
    isLoading: false,
    refetch: () => Promise.resolve(),
  }
}

export const useUserDepositIds = () => {
  return {
    depositIds: [1, 2, 3],
    isLoading: false,
    refetch: () => Promise.resolve(),
  }
}

export const useDeposit = () => {
  return {
    deposit: async (amount: number, planId: number) => {
      console.log('Depositing:', amount, 'Plan:', planId)
      return Promise.resolve({ hash: '0x123' })
    },
    isLoading: false,
    error: null,
  }
}

export const useWithdraw = () => {
  return {
    withdraw: async (depositId: number) => {
      console.log('Withdrawing deposit:', depositId)
      return Promise.resolve({ hash: '0x123' })
    },
    isLoading: false,
    error: null,
  }
}

export const useVaultStats = () => {
  return {
    totalDeposits: 2500000.0, // $2.5M
    totalRewards: 125000.0, // $125K
    isLoading: false,
  }
}
