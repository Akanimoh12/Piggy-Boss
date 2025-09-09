import React from 'react'
import { motion } from 'framer-motion'
import { useUserFaucetStats } from '../../hooks/useFaucetContract'
import { formatCurrency } from '../../utils/formatters'

const UserFaucetStats: React.FC = () => {
  const { userStats, isLoading } = useUserFaucetStats()

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm border border-blue-200 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Your Faucet Activity
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!userStats) {
    return (
      <div className="bg-white/70 backdrop-blur-sm border border-blue-200 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
          👤 Your Faucet Activity
        </h3>
        <div className="text-center py-4">
          <div className="text-gray-400 text-6xl mb-2">🚰</div>
          <p className="text-gray-600">No faucet activity yet</p>
          <p className="text-gray-500 text-sm">Claim your first tokens to see your stats!</p>
        </div>
      </div>
    )
  }

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return 'Never'
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const formatTime = (timestamp: number) => {
    if (timestamp === 0) return 'Never'
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-sm border border-blue-200 rounded-xl p-6 shadow-lg"
    >
      <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
        👤 Your Faucet Activity
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-white/50 rounded-lg border border-green-200">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💰</span>
            </div>
          </div>
          <div className="text-xl font-bold text-green-600">
            {formatCurrency(parseFloat(userStats.totalReceived))}
          </div>
          <div className="text-sm text-gray-600">Total Received</div>
        </div>
        
        <div className="text-center p-4 bg-white/50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🎯</span>
            </div>
          </div>
          <div className="text-xl font-bold text-blue-600">
            {userStats.claimCount}
          </div>
          <div className="text-sm text-gray-600">Claims Made</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg border border-purple-100">
          <span className="text-sm text-gray-600">First Claim:</span>
          <span className="text-sm font-medium text-gray-800">
            {formatDate(userStats.firstClaimTime)}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg border border-purple-100">
          <span className="text-sm text-gray-600">Last Activity:</span>
          <span className="text-sm font-medium text-gray-800">
            {formatTime(userStats.lastActivity)}
          </span>
        </div>
        
        {userStats.claimCount > 0 && (
          <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg border border-purple-100">
            <span className="text-sm text-gray-600">Average per Claim:</span>
            <span className="text-sm font-medium text-gray-800">
              {formatCurrency(parseFloat(userStats.totalReceived) / userStats.claimCount)}
            </span>
          </div>
        )}
      </div>
      
      {/* User achievement badges */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">🏆 Achievements</h4>
        <div className="flex flex-wrap gap-2">
          {userStats.claimCount >= 1 && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              First Claim ✅
            </span>
          )}
          {userStats.claimCount >= 5 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Regular User 🌟
            </span>
          )}
          {userStats.claimCount >= 10 && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              Power User 💪
            </span>
          )}
          {parseFloat(userStats.totalReceived) >= 1000 && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              1K+ Claimed 🎉
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default UserFaucetStats
