import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseUnits } from 'viem'
import { 
  TrendingUp, 
  Coins, 
  Zap, 
  Clock, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Info,
  Shield,
  Target,
  Award
} from 'lucide-react'
import { CONTRACTS, APP_CONFIG } from '../../config/contracts'
import { toast } from '../../utils/toast'
import { useYieldData } from '../../hooks/useYieldData'

const DECIMALS = APP_CONFIG.decimals

const YieldPage: React.FC = () => {
  const { address, isConnected } = useAccount()
  const [selectedPool, setSelectedPool] = useState<any>(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false)

  // Use the yield data hook
  const {
    userStats,
    userPositions,
    portfolioAllocation,
    performanceMetrics,
    usdtBalance,
    allowance,
    yieldPools,
    isLoading: dataLoading,
    refetchAll
  } = useYieldData()

  // Approval transaction
  const { 
    write: writeApproval, 
    isLoading: isApproving,
    data: approvalTxHash 
  } = useContractWrite({
    ...CONTRACTS.MockUSDT,
    functionName: 'approve',
  })

  const { isLoading: isApprovalConfirming } = useWaitForTransaction({
    hash: approvalTxHash?.hash,
    onSuccess: () => {
      toast.success('Approval successful!')
      refetchAll()
    },
  })

  // Stake transaction
  const { 
    write: writeStake, 
    isLoading: isStaking,
    data: stakeTxHash 
  } = useContractWrite({
    ...CONTRACTS.YieldManager,
    functionName: 'stake',
  })

  const { isLoading: isStakeConfirming } = useWaitForTransaction({
    hash: stakeTxHash?.hash,
    onSuccess: () => {
      toast.success('Staking successful!')
      refetchAll()
      setIsStakeModalOpen(false)
      setStakeAmount('')
    },
  })

  const handleStake = (pool: any) => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }
    setSelectedPool(pool)
    setIsStakeModalOpen(true)
  }

  const handleApprove = () => {
    if (!stakeAmount || !selectedPool) return
    
    const amount = parseUnits(stakeAmount, DECIMALS)
    writeApproval({
      args: [CONTRACTS.YieldManager.address as `0x${string}`, amount],
    })
  }

  const handleStakeSubmit = () => {
    if (!stakeAmount || !selectedPool) return
    
    const amount = parseUnits(stakeAmount, DECIMALS)
    writeStake({
      args: [amount],
    })
  }

  const needsApproval = () => {
    if (!stakeAmount || allowance === 0) return true
    const amount = parseFloat(stakeAmount)
    return allowance < amount
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'High': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md w-full"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access yield farming features</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Yield Farming</h1>
            <p className="text-gray-600">Earn rewards by staking your USDT tokens</p>
          </div>
          <button
            onClick={refetchAll}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Total Staked</p>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">${userStats.totalStaked}</p>
            <p className="text-green-600 text-sm">+12.5% this month</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Total Earned</p>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">${userStats.totalEarned}</p>
            <p className="text-purple-600 text-sm">All time rewards</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Active Positions</p>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{userStats.activePositions}</p>
            <p className="text-blue-600 text-sm">Across {yieldPools.length} pools</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Claimable</p>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">${userStats.claimableRewards}</p>
            <button className="text-yellow-600 text-sm font-medium hover:text-yellow-700">
              Claim Rewards
            </button>
          </div>
        </motion.div>

        {/* Yield Pools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Yield Pools</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {yieldPools.map((pool, index) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${pool.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{pool.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold">{pool.name}</h3>
                        <p className="text-white/80 text-sm">{pool.token}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(pool.risk)} text-gray-800`}>
                      {pool.risk} Risk
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">APY</p>
                      <p className="text-2xl font-bold">{pool.apy}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm">TVL</p>
                      <p className="text-lg font-semibold">${pool.tvl}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">{pool.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lock Period:</span>
                      <span className="font-medium">{pool.lockPeriod}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Min Stake:</span>
                      <span className="font-medium">${pool.minStake}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Max Stake:</span>
                      <span className="font-medium">${pool.maxStake}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {pool.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleStake(pool)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors bg-gradient-to-r ${pool.color} text-white hover:opacity-90`}
                  >
                    Stake Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Staking Modal */}
        {isStakeModalOpen && selectedPool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Stake in {selectedPool.name}
                </h3>
                <button
                  onClick={() => setIsStakeModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Available Balance:</span>
                  <span className="font-medium">
                    {usdtBalance.toFixed(2)} USDT
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setStakeAmount(usdtBalance.toString())}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 text-sm font-medium"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">APY:</span>
                  <span className="font-medium text-green-600">{selectedPool.apy}%</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Lock Period:</span>
                  <span className="font-medium">{selectedPool.lockPeriod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated Daily Rewards:</span>
                  <span className="font-medium text-purple-600">
                    {stakeAmount ? ((parseFloat(stakeAmount) * parseFloat(selectedPool.apy)) / 365 / 100).toFixed(4) : '0.0000'} USDT
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {needsApproval() ? (
                  <button
                    onClick={handleApprove}
                    disabled={isApproving || isApprovalConfirming || !stakeAmount}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApproving || isApprovalConfirming ? 'Approving...' : 'Approve USDT'}
                  </button>
                ) : (
                  <button
                    onClick={handleStakeSubmit}
                    disabled={isStaking || isStakeConfirming || !stakeAmount}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r ${selectedPool.color} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isStaking || isStakeConfirming ? 'Staking...' : 'Stake USDT'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Loading Overlay */}
        {(isApproving || isApprovalConfirming || isStaking || isStakeConfirming) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-900 font-medium">
                {isApproving || isApprovalConfirming ? 'Processing approval...' : 'Processing stake...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default YieldPage
