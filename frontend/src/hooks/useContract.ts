// Mock Contract Hooks for Development

// Mock USDT Contract Hook
export function useMockUSDT() {
  return {
    balance: "1000.00",
    usdtBalance: "1000.00",
    allowance: "999999.00",
    approve: (_amount?: string) => Promise.resolve({ hash: '0x123' }),
    isApproving: false,
    claimTokens: () => Promise.resolve({ hash: '0x456' }),
    isClaiming: false
  };
}

// Mock PiggyVault Contract Hook
export function usePiggyVault() {
  return {
    userSummary: {
      totalDeposited: "500.00",
      totalWithdrawn: "0.00",
      currentBalance: "525.50",
      totalRewards: "25.50",
      depositCount: 3,
      totalSaved: "500.00",
      totalEarned: "25.50",
      activeDeposits: 3
    },
    userDeposits: [BigInt(0), BigInt(1), BigInt(2)],
    userDepositIds: [0, 1, 2],
    contractStats: {
      totalDeposits: "50000.00",
      totalUsers: 1250,
      totalRewardsPaid: "2500.00"
    },
    currentInterest: "5.25",
    deposit: () => Promise.resolve({ hash: '0x789' }),
    createDeposit: (_amount?: string, _days?: number) => Promise.resolve({ hash: '0x789' }),
    isCreatingDeposit: false,
    withdrawDeposit: (_depositId?: number) => Promise.resolve({ hash: '0xabc' }),
    emergencyWithdraw: (_depositId?: number) => Promise.resolve({ hash: '0xdef' }),
    isWithdrawing: false,
    isEmergencyWithdrawing: false
  };
}

// Mock NFT Rewards Contract Hook
export function useNFTRewards() {
  return {
    nftBalance: 5,
    nftSummary: {
      totalNFTs: 5,
      rareNFTs: 2,
      achievements: 8,
      nftCount: 5
    },
    userTier: {
      tier: 3,
      tierName: "Gold Saver"
    },
    achievementPoints: 1250,
    rareNFTs: 2
  };
}

// Mock User Activity Hook
export function useUserActivity() {
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
  };
}

// Mock Deposit Details Hook
export function useDepositDetails(_depositId?: number) {
  return {
    depositDetails: {
      id: 1,
      amount: "200.00",
      interestRate: 5.25,
      duration: 30,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      maturityDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      currentValue: "210.50",
      status: "active",
      planDays: 30,
      createdAt: Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000),
      maturityTime: Math.floor((Date.now() + 23 * 24 * 60 * 60 * 1000) / 1000),
      accruedInterest: "10.50"
    },
    currentInterest: "5.25"
  };
}

// Additional Mock Hooks for Components
export const useUSDTBalance = () => ({ 
  balance: "1000.00",
  isLoading: false 
});

export const useTotalDeposited = () => ({ 
  totalDeposited: "500.00",
  isLoading: false 
});

export const useTotalRewards = () => ({ 
  totalRewards: "25.50",
  isLoading: false 
});

export const useVaultStats = () => ({
  totalValue: "50000.00",
  totalDeposits: "50000.00",
  totalUsers: 1250,
  totalRewards: "2500.00"
});

// Faucet Mock Functions
export function useFaucet() {
  return {
    balance: "1000.00",
    usdtBalance: "1000.00",
    canClaimFaucet: true,
    timeUntilNextClaim: 0,
    userStats: {
      totalClaimed: "100.00",
      totalReceived: "100.00",
      claimCount: 5,
      lastClaimTime: Date.now() - 24 * 60 * 60 * 1000
    },
    faucetStats: {
      totalDistributed: "10000.00",
      totalUsers: 500,
      remainingSupply: "90000.00",
      uniqueUsers: 500,
      dailyLimit: "100.00"
    },
    claimFaucet: () => Promise.resolve({ hash: '0x123' }),
    isClaimingFaucet: false
  };
}
