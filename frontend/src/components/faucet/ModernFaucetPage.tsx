import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FiDroplet, 
  FiClock, 
  FiCheck, 
  FiZap,
  FiRefreshCw
} from 'react-icons/fi'
import { useAccount } from 'wagmi'
import { 
  useUSDTBalance, 
  useFaucet, 
  useLastFaucetTime 
} from '../../hooks/useContract'
import { APP_CONFIG } from '../../config/contracts'

const ModernFaucetPage: React.FC = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const { balance, refetch: refetchBalance } = useUSDTBalance()
  const { claimFaucet, isLoading: faucetLoading } = useFaucet()
  const { canClaimFaucet, lastFaucetTime, refetch: refetchFaucetTime } = useLastFaucetTime()

  const handleClaimFaucet = async () => {
    if (!canClaimFaucet || isLoading) return
    
    try {
      setIsLoading(true)
      await claimFaucet()
      setShowSuccess(true)
      
      // Refetch balances
      await refetchBalance()
      await refetchFaucetTime()
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Faucet claim failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getNextClaimTime = () => {
    if (!lastFaucetTime) return null
    const nextClaim = (lastFaucetTime + APP_CONFIG.faucetCooldown) * 1000
    return new Date(nextClaim)
  }

  const formatTimeRemaining = () => {
    const nextClaim = getNextClaimTime()
    if (!nextClaim) return null
    
    const now = new Date()
    const diff = nextClaim.getTime() - now.getTime()
    
    if (diff <= 0) return null
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiDroplet className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">USDT Faucet</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get free USDT tokens to test the platform. You can claim {APP_CONFIG.faucetAmount} USDT every 24 hours.
        </p>
      </motion.div>

      {/* Main Faucet Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Free USDT Tokens</h2>
              <p className="opacity-90">For testing and development</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">Claim Amount</p>
              <p className="text-3xl font-bold">{APP_CONFIG.faucetAmount} USDT</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Balance */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiZap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Your Current Balance</p>
                  <p className="text-2xl font-bold text-gray-900">{balance.toFixed(2)} USDT</p>
                </div>
              </div>
              <button
                onClick={() => refetchBalance()}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiRefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Faucet Status */}
          <div className="space-y-4">
            {canClaimFaucet ? (
              <div className="flex items-center space-x-3 text-green-600">
                <FiCheck className="w-5 h-5" />
                <span className="font-medium">Ready to claim</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-orange-600">
                <FiClock className="w-5 h-5" />
                <span className="font-medium">
                  Next claim available in {formatTimeRemaining()}
                </span>
              </div>
            )}

            {/* Claim Button */}
            <button
              onClick={handleClaimFaucet}
              disabled={!canClaimFaucet || isLoading || faucetLoading}
              className={`
                w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200
                ${canClaimFaucet && !isLoading && !faucetLoading
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 transform hover:scale-[1.02] shadow-lg'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isLoading || faucetLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Claiming...</span>
                </div>
              ) : canClaimFaucet ? (
                <div className="flex items-center justify-center space-x-2">
                  <FiDroplet className="w-5 h-5" />
                  <span>Claim {APP_CONFIG.faucetAmount} USDT</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <FiClock className="w-5 h-5" />
                  <span>Come back later</span>
                </div>
              )}
            </button>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-xl p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Success!</p>
                  <p className="text-sm text-green-600">
                    {APP_CONFIG.faucetAmount} USDT has been added to your wallet
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to use the faucet:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Connect your wallet to this application</li>
              <li>• Click "Claim {APP_CONFIG.faucetAmount} USDT" when available</li>
              <li>• Wait 24 hours between claims</li>
              <li>• Use the tokens to test savings and yield features</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiZap className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Next Steps</h3>
          </div>
          <p className="text-gray-600 text-sm">
            After claiming USDT, head to the Savings page to start earning yields on your tokens.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Cooldown Period</h3>
          </div>
          <p className="text-gray-600 text-sm">
            The faucet has a 24-hour cooldown to prevent abuse. Plan your testing accordingly.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default ModernFaucetPage
