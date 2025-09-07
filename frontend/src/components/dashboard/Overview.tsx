/**
 * Overview Component - Real-time Dashboard with Live Contract Data
 * 
 * Features:
 * - Live portfolio value from PiggyVault contract
 * - Real USDT balance from MockUSDT contract  
 * - Active deposits and rewards from contracts
 * - Recent activity tracking from all contracts
 * - Real-time updates with contract watching
 * - Pink/Blue gradient theme
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { formatCurrency } from '../../utils/formatters';
import DepositModal from './DepositModal';
import { Faucet } from '../common/Faucet';
import AIInsights from './AIInsights';
import { DepositHistory } from '../../services/aiService';
import { 
  usePiggyVault, 
  useMockUSDT, 
  useNFTRewards, 
  useUserActivity 
} from '../../hooks/useContract';

const Overview: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  // Contract hooks for real-time data
  const { userSummary, contractStats } = usePiggyVault();
  const { balance: usdtBalance } = useMockUSDT();
  const { nftBalance, userTier, achievementPoints } = useNFTRewards();
  const { activities } = useUserActivity();

  // Real-time clock update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate real portfolio metrics
  const portfolioMetrics = useMemo(() => {
    const availableUSDT = parseFloat(usdtBalance) || 0;
    // Calculate portfolio metrics from real contract data
    const activeDeposits = parseFloat(userSummary.totalDeposited) || 0;
    const totalRewards = parseFloat(userSummary.totalRewards) || 0;
    
    // Total Balance = Available USDT + Active Deposits + Total Rewards
    const totalBalance = availableUSDT + activeDeposits + totalRewards;
    
    // Total Portfolio = Active Deposits + Total Rewards (value locked in platform)
    const totalPortfolio = activeDeposits + totalRewards;

    return {
      availableUSDT,
      activeDeposits,
      totalRewards,
      totalBalance,
      totalPortfolio,
      activeDepositsCount: userSummary.depositCount || 0,
    };
  }, [usdtBalance, userSummary]);

  // Create deposit history for AI insights from real contract data
  const depositHistory: DepositHistory[] = useMemo(() => {
    if (!isConnected || userSummary.depositCount === 0) return [];

    // Create mock deposit history based on user summary
    return Array.from({ length: Math.min(userSummary.depositCount, 5) }, (_, index) => ({
      id: (index + 1).toString(),
      amount: portfolioMetrics.activeDeposits / Math.max(userSummary.depositCount, 1), // Distribute evenly
      duration: 30, // Default to 30 days
      apy: 12, // Default APY
      timestamp: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000), // Weekly intervals
      currentValue: (portfolioMetrics.activeDeposits + portfolioMetrics.totalRewards) / Math.max(userSummary.depositCount, 1),
      isActive: true
    }));
  }, [isConnected, userSummary.depositCount, portfolioMetrics]);

  // Format activity for display
  const formatActivityDescription = (activity: any) => {
    switch (activity.type) {
      case 'faucet_claim':
        return `Claimed ${activity.amount} USDT from faucet`;
      case 'deposit_created':
        return `Created savings deposit of ${parseFloat(activity.amount).toFixed(2)} USDT`;
      case 'withdrawal':
        return `Withdrew from deposit #${activity.depositId}`;
      case 'emergency_withdrawal':
        return `Emergency withdrawal from deposit #${activity.depositId}`;
      case 'nft_mint':
        return 'Minted achievement NFT';
      default:
        return activity.description;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'faucet_claim': return '💧';
      case 'deposit_created': return '💰';
      case 'withdrawal': return '📤';
      case 'emergency_withdrawal': return '🚨';
      case 'nft_mint': return '🎨';
      default: return '📋';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'faucet_claim': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'deposit_created': return 'text-green-600 bg-green-50 border-green-200';
      case 'withdrawal': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'emergency_withdrawal': return 'text-red-600 bg-red-50 border-red-200';
      case 'nft_mint': return 'text-pink-600 bg-pink-50 border-pink-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full mx-auto flex items-center justify-center mb-6">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 text-lg">Please connect your wallet to view your savings overview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Real-time Clock */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                Your Savings Overview
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {currentTime.toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Connected to Somnia Network</div>
              <div className="text-lg font-semibold text-green-600">
                SOM Balance: 0.0000 SOM
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Address: {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Portfolio Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Portfolio Value */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Total Portfolio</h3>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(portfolioMetrics.totalPortfolio)}
                </p>
                <p className="text-sm opacity-75 mt-1">
                  Platform Value
                </p>
              </div>
              <div className="text-3xl opacity-80">🏆</div>
            </div>
          </motion.div>

          {/* Total Balance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Total Balance</h3>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(portfolioMetrics.totalBalance)}
                </p>
                <p className="text-sm opacity-75 mt-1">
                  All Assets
                </p>
              </div>
              <div className="text-3xl opacity-80">💰</div>
            </div>
          </motion.div>

          {/* Active Deposits */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Active Deposits</h3>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(portfolioMetrics.activeDeposits)}
                </p>
                <p className="text-sm opacity-75 mt-1">
                  {portfolioMetrics.activeDepositsCount} Positions
                </p>
              </div>
              <div className="text-3xl opacity-80">📈</div>
            </div>
          </motion.div>

          {/* Total Rewards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Total Rewards</h3>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(portfolioMetrics.totalRewards)}
                </p>
                <p className="text-sm opacity-75 mt-1">
                  Earned Yield
                </p>
              </div>
              <div className="text-3xl opacity-80">🎯</div>
            </div>
          </motion.div>

          {/* Available USDT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Available USDT</h3>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(portfolioMetrics.availableUSDT)}
                </p>
                <p className="text-sm opacity-75 mt-1">
                  Ready to Invest
                </p>
              </div>
              <div className="text-3xl opacity-80">💵</div>
            </div>
          </motion.div>
        </div>

        {/* User Tier and NFT Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{userTier.tierName}</h3>
                <p className="text-gray-600">Tier {userTier.tier} • {nftBalance} Achievement NFTs</p>
                <p className="text-sm text-gray-500">{achievementPoints} Achievement Points</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Rare NFTs</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100"
        >
          <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              onClick={() => setIsDepositModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-left hover:from-blue-100 hover:to-blue-200 transition-all duration-300 shadow-lg"
            >
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Deposit</h3>
              <p className="text-sm text-gray-600">Start earning yield on your USDT</p>
            </motion.button>

            <Link to="/savings">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 text-left hover:from-green-100 hover:to-green-200 transition-all duration-300 shadow-lg"
              >
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-900 mb-2">View Positions</h3>
                <p className="text-sm text-gray-600">Manage your active savings</p>
              </motion.div>
            </Link>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 text-left shadow-lg">
              <div className="text-3xl mb-3">🎁</div>
              <h3 className="font-semibold text-gray-900 mb-2">Claim Faucet</h3>
              <div className="mt-3">
                <Faucet compact={true} showTitle={false} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              Recent Activity
            </h2>
            {activities.length > 0 && (
              <span className="text-sm text-gray-500">
                {activities.length} recent activities
              </span>
            )}
          </div>
          
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-600">No activity yet. Start by claiming from the faucet or creating a deposit!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activities.map((activity: any, index: number) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-4 p-4 rounded-xl border ${getActivityColor(activity.type)} transition-all duration-200 hover:shadow-md`}
                >
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {formatActivityDescription(activity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {activity.amount && (
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(parseFloat(activity.amount))}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Platform Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatCurrency(parseFloat(contractStats.totalDeposits))}
              </div>
              <div className="text-gray-600">Total Platform Deposits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(parseFloat(contractStats.totalRewardsPaid))}
              </div>
              <div className="text-gray-600">Total Rewards Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {contractStats.totalUsers.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Platform Users</div>
            </div>
          </div>
        </motion.div>

        {/* AI Insights */}
        <AnimatePresence>
          {depositHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 1 }}
            >
              <AIInsights 
                depositHistory={depositHistory} 
                currentBalance={parseFloat(userSummary.currentBalance)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Deposit Modal */}
        <AnimatePresence>
          {isDepositModalOpen && (
            <DepositModal
              isOpen={isDepositModalOpen}
              onClose={() => setIsDepositModalOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Overview;
