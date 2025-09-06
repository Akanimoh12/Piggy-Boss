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

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your wallet to view your savings overview</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Real-time Clock */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Savings Overview</h1>
            <p className="text-gray-600 mt-1">
              {currentTime.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Connected to Somnia Network</div>
            <div className="text-sm font-medium text-green-600">
              SOM Balance: {parseFloat(somBalance).toFixed(4)} SOM
            </div>
          </div>
        </div>
      </div>

      {/* Live Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">Total Value Locked</h3>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(parseFloat(userSummary.totalSaved) + parseFloat(userSummary.totalEarned))}
              </p>
              <p className="text-sm opacity-75 mt-1">
                USDT Balance: {parseFloat(usdtBalance).toFixed(6)}
              </p>
            </div>
            <div className="text-3xl opacity-80">💰</div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">Total Earned</h3>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(parseFloat(userSummary.totalEarned))}
              </p>
              <p className="text-sm opacity-75 mt-1">
                +{((parseFloat(userSummary.totalEarned) / parseFloat(userSummary.totalSaved || '1')) * 100).toFixed(2)}% Yield
              </p>
            </div>
            <div className="text-3xl opacity-80">📈</div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">Active Positions</h3>
              <p className="text-2xl font-bold mt-1">{userSummary.activeDeposits}</p>
              <p className="text-sm opacity-75 mt-1">
                {userTier.tierName} Tier • {nftSummary.nftCount} NFTs
              </p>
            </div>
            <div className="text-3xl opacity-80">🏆</div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-100 transition-colors"
          >
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-medium text-gray-900">Create Deposit</h3>
            <p className="text-sm text-gray-600">Start earning yield on your USDT</p>
          </button>

          <Link
            to="/savings"
            className="bg-green-50 border border-green-200 rounded-lg p-4 text-left hover:bg-green-100 transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-medium text-gray-900">View Positions</h3>
            <p className="text-sm text-gray-600">Manage your active savings</p>
          </Link>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left">
            <div className="text-2xl mb-2">🎁</div>
            <h3 className="font-medium text-gray-900">Claim Faucet</h3>
            <div className="mt-2">
              <Faucet />
            </div>
          </div>
        </div>
      </div>

      {/* Contract Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Platform Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(parseFloat(contractStats.totalDeposits))}
            </div>
            <div className="text-sm text-gray-600">Total Deposits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(parseFloat(contractStats.totalRewards))}
            </div>
            <div className="text-sm text-gray-600">Total Rewards Paid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {contractStats.depositCounter.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {depositHistory.length > 0 && (
        <AIInsights depositHistory={depositHistory} />
      )}

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
        />
      )}
    </div>
  )
}

export default Overview
