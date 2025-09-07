import React from 'react'
import { motion } from 'framer-motion'
import { useFaucetStats } from '../../hooks/useFaucetContract'
import { formatCurrency } from '../../utils/formatters'

const FaucetStats: React.FC = () => {
  const { faucetStats, isLoading } = useFaucetStats()

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm border border-purple-200 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Global Faucet Statistics
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!faucetStats) {
    return (
      <div className="bg-white/70 backdrop-blur-sm border border-red-200 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-red-600 mb-4">
          Unable to Load Faucet Statistics
        </h3>
        <p className="text-gray-600 text-sm">
          Please check your connection to the Somnia network.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-sm border border-purple-200 rounded-xl p-6 shadow-lg"
    >
      <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
        🌍 Global Faucet Statistics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💰</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(parseFloat(faucetStats.totalDistributed))}
          </div>
          <div className="text-sm text-gray-600">Total Distributed</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🏦</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(parseFloat(faucetStats.remainingSupply))}
          </div>
          <div className="text-sm text-gray-600">Remaining Supply</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">👥</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {faucetStats.uniqueUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Unique Users</div>
        </div>
      </div>
      
      {/* Progress bar for supply */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Supply Distribution</span>
          <span className="text-sm font-medium">
            {(
              (parseFloat(faucetStats.totalDistributed) / 
              (parseFloat(faucetStats.totalDistributed) + parseFloat(faucetStats.remainingSupply))) * 100
            ).toFixed(1)}% distributed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-pink-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(
                (parseFloat(faucetStats.totalDistributed) / 
                (parseFloat(faucetStats.totalDistributed) + parseFloat(faucetStats.remainingSupply))) * 100
              )}%` 
            }}
          ></div>
        </div>
      </div>
    </motion.div>
  )
}

export default FaucetStats
