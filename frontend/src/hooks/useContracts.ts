import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { toast } from 'react-hot-toast';
import { parseUnits, formatUnits } from 'viem';
import { SOMNIA_CONTRACTS, MockUSDTABI } from '../abi';

// Helper function to safely format units
const safeFormatUnits = (value: unknown, decimals: number): string => {
  try {
    if (value === undefined || value === null) return '0';
    if (typeof value === 'bigint' || typeof value === 'number' || typeof value === 'string') {
      return formatUnits(BigInt(value.toString()), decimals);
    }
    return '0';
  } catch (error) {
    console.error('Error formatting units:', error);
    return '0';
  }
};

// Helper function to safely convert to number
const safeToNumber = (value: unknown): number => {
  try {
    if (value === undefined || value === null) return 0;
    if (typeof value === 'bigint' || typeof value === 'number' || typeof value === 'string') {
      return Number(value);
    }
    return 0;
  } catch (error) {
    console.error('Error converting to number:', error);
    return 0;
  }
};

// Hook for MockUSDT operations with real contract integration
export const useMockUSDT = () => {
  const { address } = useAccount();

  // Get USDT balance
  const { data: usdtBalance, refetch: refetchBalance } = useContractRead({
    address: SOMNIA_CONTRACTS.MOCK_USDT,
    abi: MockUSDTABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Get allowance for PiggyVault
  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address: SOMNIA_CONTRACTS.MOCK_USDT,
    abi: MockUSDTABI,
    functionName: 'allowance',
    args: address ? [address, SOMNIA_CONTRACTS.PIGGY_VAULT] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Check if user can claim faucet
  const { data: canClaimFaucet } = useContractRead({
    address: SOMNIA_CONTRACTS.MOCK_USDT,
    abi: MockUSDTABI,
    functionName: 'canClaimFaucet',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Get time until next claim
  const { data: timeUntilNextClaim } = useContractRead({
    address: SOMNIA_CONTRACTS.MOCK_USDT,
    abi: MockUSDTABI,
    functionName: 'timeUntilNextClaim',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Get user stats
  const { data: userStats } = useContractRead({
    address: SOMNIA_CONTRACTS.MOCK_USDT,
    abi: MockUSDTABI,
    functionName: 'getUserStats',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Get faucet stats
  const { data: faucetStats } = useContractRead({
    address: SOMNIA_CONTRACTS.MOCK_USDT,
    abi: MockUSDTABI,
    functionName: 'getFaucetStats',
    enabled: true,
    watch: true,
  });

  // Faucet claim
  const { writeAsync: claimFaucetWrite, isLoading: isClaimingFaucet } = useContractWrite({
    address: SOMNIA_CONTRACTS.MOCK_USDT,
    abi: MockUSDTABI,
    functionName: 'claimFromFaucet',
  });

  // Approve PiggyVault
  const { writeAsync: approveWrite, isLoading: isApproving } = useContractWrite({
    address: SOMNIA_CONTRACTS.MOCK_USDT,
    abi: MockUSDTABI,
    functionName: 'approve',
  });

  const handleClaimFaucet = async () => {
    try {
      if (!canClaimFaucet) {
        toast.error('Cannot claim faucet at this time');
        return;
      }

      const tx = await claimFaucetWrite();
      toast.success('Faucet claimed successfully!');
      
      // Refetch balances after successful claim
      refetchBalance();
      
      return tx;
    } catch (error: any) {
      console.error('Faucet claim error:', error);
      toast.error(error.message || 'Failed to claim faucet');
      throw error;
    }
  };

  const handleApprove = async (amount: string) => {
    try {
      const tx = await approveWrite({
        args: [SOMNIA_CONTRACTS.PIGGY_VAULT, parseUnits(amount, 6)], // USDT has 6 decimals
      });
      toast.success('Approval successful!');
      
      // Refetch allowance after successful approval
      refetchAllowance();
      
      return tx;
    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error(error.message || 'Failed to approve');
      throw error;
    }
  };

  return {
    usdtBalance: safeFormatUnits(usdtBalance, 6),
    allowance: safeFormatUnits(allowance, 6),
    canClaimFaucet: Boolean(canClaimFaucet),
    timeUntilNextClaim: safeToNumber(timeUntilNextClaim),
    userStats: userStats && Array.isArray(userStats) && userStats.length >= 4 ? {
      totalReceived: safeFormatUnits(userStats[0], 6),
      claimCount: safeToNumber(userStats[1]),
      firstClaimTime: safeToNumber(userStats[2]),
      lastActivity: safeToNumber(userStats[3]),
    } : null,
    faucetStats: faucetStats && Array.isArray(faucetStats) && faucetStats.length >= 3 ? {
      totalDistributed: safeFormatUnits(faucetStats[0], 6),
      remainingSupply: safeFormatUnits(faucetStats[1], 6),
      uniqueUsers: safeToNumber(faucetStats[2]),
    } : null,
    claimFaucet: handleClaimFaucet,
    approve: handleApprove,
    isClaimingFaucet,
    isApproving,
  };
};

// Hook for PiggyVault operations
export const usePiggyVault = () => {
  const { address } = useAccount();

  const handleCreateDeposit = async (amount: string, planDays: number) => {
    try {
      // TODO: Implement actual contract call
      toast.success('Deposit created successfully!');
      console.log('Creating deposit:', { amount, planDays, vault: SOMNIA_CONTRACTS.PIGGY_VAULT });
      return { hash: '0x123' };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create deposit');
      throw error;
    }
  };

  const handleWithdraw = async (depositId: number) => {
    try {
      // TODO: Implement actual contract call
      toast.success('Withdrawal successful!');
      console.log('Withdrawing deposit:', depositId);
      return { hash: '0x123' };
    } catch (error: any) {
      toast.error(error.message || 'Failed to withdraw');
      throw error;
    }
  };

  const handleEmergencyWithdraw = async (depositId: number) => {
    try {
      // TODO: Implement actual contract call
      toast.success('Emergency withdrawal successful!');
      console.log('Emergency withdrawing deposit:', depositId);
      return { hash: '0x123' };
    } catch (error: any) {
      toast.error(error.message || 'Failed to emergency withdraw');
      throw error;
    }
  };

  return {
    userDepositIds: [1, 2, 3], // Mock deposit IDs
    userSummary: {
      totalSaved: '5000.000000',
      activeDeposits: 3,
      totalEarned: '125.500000',
    },
    contractStats: {
      totalDeposits: '1250000.000000',
      totalRewards: '32500.000000',
      depositCounter: 1247,
    },
    createDeposit: handleCreateDeposit,
    withdrawDeposit: handleWithdraw,
    emergencyWithdraw: handleEmergencyWithdraw,
    isCreatingDeposit: false,
    isWithdrawing: false,
    isEmergencyWithdrawing: false,
  };
};

// Hook for individual deposit details
export const useDepositDetails = (depositId: number | null) => {
  const mockDeposit = depositId ? {
    user: '0x1234567890123456789012345678901234567890',
    amount: '1000.000000',
    planDays: 30,
    createdAt: Date.now() - 86400000 * 10, // 10 days ago
    maturityTime: Date.now() + 86400000 * 20, // 20 days from now
    isWithdrawn: false,
    accruedInterest: '12.350000',
  } : null;

  return {
    depositDetails: mockDeposit,
    currentInterest: depositId ? '15.280000' : '0',
  };
};

// Hook for NFT operations
export const useNFTRewards = () => {
  const { address } = useAccount();

  return {
    nftBalance: 3,
    nftSummary: {
      nftCount: 3,
      achievementPoints: 150,
      rareNFTs: 1,
    },
    userTier: {
      tier: 2,
      tierName: 'Silver Saver',
    },
  };
};

// Hook for SOM balance
export const useSomBalance = () => {
  const { address } = useAccount();
  
  return {
    balance: address ? '10.5' : '0',
    symbol: 'SOM',
  };
};
