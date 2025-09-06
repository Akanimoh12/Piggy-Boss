import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { formatCurrency } from '@utils/formatters'
import DepositModal from './DepositModal'
import Faucet from '@components/common/Faucet'
import AIInsights from './AIInsights'
import { DepositHistory } from '@services/aiService'
import { usePiggyVault, useMockUSDT, useNFTRewards, useSomBalance } from '@hooks/useContracts'

interface SavingsPosition {
  id: string
  amount: number
  apy: number
  duration: number
  startDate: Date
  maturityDate: Date
  currentValue: number
  isMatured: boolean
  plan: string
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdraw' | 'claim' | 'nft_earned'
  amount: number
  timestamp: Date
  status: 'completed' | 'pending'
  hash?: string
}

interface NFTReward {
  id: string
  name: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  image: string
  earnedAt: Date
}

const Overview: React.FC = () => {
  const { isConnected } = useAccount()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [depositHistory, setDepositHistory] = useState<DepositHistory[]>([])

  // Contract hooks
  const { userSummary, contractStats, userDepositIds } = usePiggyVault()
  const { usdtBalance } = useMockUSDT()
  const { nftSummary, userTier } = useNFTRewards()
  const { balance: somBalance } = useSomBalance()

  // Real-time clock update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Create deposit history for AI insights from contract data
  useEffect(() => {
    if (isConnected && userDepositIds.length > 0) {
      // Convert contract data to AI-friendly format
      const contractDepositHistory: DepositHistory[] = userDepositIds.map((id, index) => ({
        id: id.toString(),
        amount: parseFloat(userSummary.totalSaved) / userDepositIds.length, // Approximate
        duration: 30, // Default to 30 days for now
        apy: 12, // Default APY
        timestamp: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000), // Approximate dates
        currentValue: parseFloat(userSummary.totalSaved) / userDepositIds.length + parseFloat(userSummary.totalEarned) / userDepositIds.length,
        isActive: true
      }))
      setDepositHistory(contractDepositHistory)
    }
  }, [isConnected, userDepositIds, userSummary])
    if (activeSavings.length === 0) return

    const interval = setInterval(() => {
      setActiveSavings(prev => prev.map(position => {
        const secondsElapsed = (Date.now() - position.startDate.getTime()) / 1000
        const dailyRate = position.apy / 365 / 100
        const growth = position.amount * dailyRate * (secondsElapsed / 86400)
        
        return {
          ...position,
          currentValue: position.amount + growth
        }
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [activeSavings.length, currentTime])

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-secondary-600">
          Connect your wallet to view your dashboard
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Real-time Clock */}
      <div className="text-right text-sm text-secondary-500">
        {currentTime.toLocaleString()}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-secondary-600">Total Value Locked</h3>
            <div className="text-green-500 text-xl">💰</div>
          </div>
          <div className="text-2xl font-bold text-primary-900">
            {formatCurrency(totalValueLocked)}
          </div>
          <div className="text-xs text-green-600 mt-1">
            +{formatCurrency(totalEarned)} earned
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-secondary-600">Active Savings</h3>
            <div className="text-blue-500 text-xl">📊</div>
          </div>
          <div className="text-2xl font-bold text-primary-900">
            {activeSavings.length}
          </div>
          <div className="text-xs text-secondary-500 mt-1">
            plans running
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-secondary-600">NFT Rewards</h3>
            <div className="text-purple-500 text-xl">🎨</div>
          </div>
          <div className="text-2xl font-bold text-primary-900">
            {nftRewards.length}
          </div>
          <div className="text-xs text-secondary-500 mt-1">
            collected
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-secondary-600">Avg APY</h3>
            <div className="text-accent text-xl">📈</div>
          </div>
          <div className="text-2xl font-bold text-primary-900">
            {activeSavings.length > 0 
              ? (activeSavings.reduce((sum, pos) => sum + pos.apy, 0) / activeSavings.length).toFixed(1)
              : '0'
            }%
          </div>
          <div className="text-xs text-green-600 mt-1">
            annual yield
          </div>
        </motion.div>
      </div>

      {/* AI Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AIInsights 
          depositHistory={depositHistory}
          currentBalance={totalValueLocked}
        />
      </motion.div>

      {/* Test Tokens Faucet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Test Tokens</h2>
        <Faucet compact={true} className="max-w-sm" />
        <div className="mt-4 text-center">
          <Link 
            to="/faucet"
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Need more tokens? Visit the full faucet →
          </Link>
        </div>
      </motion.div>

      {/* Active Savings Positions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Active Savings Plans</h2>
          <Link 
            to="/savings" 
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            View All →
          </Link>
        </div>

        {activeSavings.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🏦</div>
            <h3 className="text-lg font-semibold mb-2">No Active Savings</h3>
            <p className="text-secondary-600 mb-4">
              Start your first savings plan to begin earning yields
            </p>
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Create Your First Plan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeSavings.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-surface-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center text-white font-bold">
                    {position.duration}d
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">{position.plan}</h3>
                    <p className="text-sm text-secondary-600">
                      {formatCurrency(position.amount)} → {formatCurrency(position.currentValue)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    +{((position.currentValue - position.amount) / position.amount * 100).toFixed(2)}%
                  </div>
                  <div className="text-sm text-secondary-500">
                    {position.apy}% APY
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setIsDepositModalOpen(true)}
            className="flex items-center p-4 border border-surface-200 rounded-xl hover:shadow-soft hover:border-accent transition-all duration-200 group bg-gradient-to-r from-primary/5 to-accent/5"
          >
            <div className="text-3xl mr-4 group-hover:scale-110 transition-transform">💰</div>
            <div>
              <h3 className="font-semibold text-primary-900">Create Savings Plan</h3>
              <p className="text-sm text-secondary-600">Start earning high yields</p>
            </div>
          </button>

          <button className="flex items-center p-4 border border-surface-200 rounded-xl hover:shadow-soft hover:border-accent transition-all duration-200 group">
            <div className="text-3xl mr-4 group-hover:scale-110 transition-transform">📤</div>
            <div>
              <h3 className="font-semibold text-primary-900">Withdraw</h3>
              <p className="text-sm text-secondary-600">Withdraw from mature plans</p>
            </div>
          </button>

          <button className="flex items-center p-4 border border-surface-200 rounded-xl hover:shadow-soft hover:border-accent transition-all duration-200 group">
            <div className="text-3xl mr-4 group-hover:scale-110 transition-transform">🎨</div>
            <div>
              <h3 className="font-semibold text-primary-900">NFT Gallery</h3>
              <p className="text-sm text-secondary-600">View your NFT collection</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Deposit Modal */}
      <DepositModal 
        isOpen={isDepositModalOpen} 
        onClose={() => setIsDepositModalOpen(false)} 
      />
    </div>
  )
}

export default Overview
