/**
 * Enhanced Savings Page Component - Manage Live Savings Plans
 * 
 * This component shows user's active deposits from the smart contract,
 * allows creating new deposits, and provides detailed deposit management.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { formatCurrency } from '@utils/formatters'
import { usePiggyVault, useMockUSDT, useNFTRewards, useDepositDetails } from '@hooks/useContracts'
import DepositModal from '../dashboard/DepositModal'
import { Calendar, TrendingUp, Clock, DollarSign, Award, Plus, Eye, ArrowUpRight } from 'lucide-react'

interface DepositCardProps {
  depositId: number
  onWithdraw: (id: number) => void
  onEmergencyWithdraw: (id: number) => void
}

const DepositCard: React.FC<DepositCardProps> = ({ depositId, onWithdraw, onEmergencyWithdraw }) => {
  const { depositDetails, currentInterest } = useDepositDetails(depositId)
  const [showDetails, setShowDetails] = useState(false)

  if (!depositDetails) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  const isMatured = new Date(depositDetails.maturityTime * 1000) <= new Date()
  const daysRemaining = Math.max(0, Math.ceil((depositDetails.maturityTime * 1000 - Date.now()) / (1000 * 60 * 60 * 24)))
  const progress = Math.min(100, ((Date.now() - depositDetails.createdAt * 1000) / (depositDetails.maturityTime * 1000 - depositDetails.createdAt * 1000)) * 100)

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
      whileHover={{ y: -2 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Deposit #{depositId}
            </h3>
            <p className="text-sm text-gray-600">
              {depositDetails.planDays} Day Plan
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isMatured 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {isMatured ? 'Matured' : 'Active'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(parseFloat(depositDetails.amount))}
            </div>
            <div className="text-sm text-gray-600">Principal</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              +{formatCurrency(parseFloat(currentInterest))}
            </div>
            <div className="text-sm text-gray-600">Current Interest</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {isMatured ? 'Ready to withdraw' : `${daysRemaining} days remaining`}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Details
          </button>
          
          {isMatured && (
            <button
              onClick={() => onWithdraw(depositId)}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              Withdraw
            </button>
          )}
          
          <button
            onClick={() => onEmergencyWithdraw(depositId)}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm"
          >
            Emergency
          </button>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Created:</span>
              <span>{new Date(depositDetails.createdAt * 1000).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Maturity:</span>
              <span>{new Date(depositDetails.maturityTime * 1000).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Accrued Interest:</span>
              <span className="text-green-600 font-medium">
                {formatCurrency(parseFloat(depositDetails.accruedInterest))}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

const SavingsPage: React.FC = () => {
  const { isConnected } = useAccount()
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  
  // Contract hooks
  const { userSummary, userDepositIds, withdrawDeposit, emergencyWithdraw, isWithdrawing, isEmergencyWithdrawing } = usePiggyVault()
  const { usdtBalance } = useMockUSDT()
  const { nftSummary, userTier } = useNFTRewards()

  const handleWithdraw = async (depositId: number) => {
    try {
      await withdrawDeposit(depositId)
    } catch (error) {
      console.error('Withdrawal failed:', error)
    }
  }

  const handleEmergencyWithdraw = async (depositId: number) => {
    if (window.confirm('Emergency withdrawal may incur penalties. Continue?')) {
      try {
        await emergencyWithdraw(depositId)
      } catch (error) {
        console.error('Emergency withdrawal failed:', error)
      }
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your wallet to access savings features
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Savings</h1>
            <p className="text-gray-600">
              Manage your DeFi savings deposits and track earnings
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Saved</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(parseFloat(userSummary.totalSaved))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Earned</p>
                  <p className="text-xl font-bold text-green-600">
                    +{formatCurrency(parseFloat(userSummary.totalEarned))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Deposits</p>
                  <p className="text-xl font-bold">{userSummary.activeDeposits}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{userTier.tierName} Tier</p>
                  <p className="text-xl font-bold">{nftSummary.nftCount} NFTs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3"
              >
                <Plus className="w-5 h-5" />
                Create New Deposit
              </button>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Available Balance</div>
                <div className="text-lg font-semibold">
                  {parseFloat(usdtBalance).toFixed(6)} USDT
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Value</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(
                    parseFloat(userSummary.totalSaved) + parseFloat(userSummary.totalEarned)
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Active Deposits */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Deposits</h2>
              {userDepositIds.length > 0 && (
                <div className="text-sm text-gray-600">
                  {userDepositIds.length} active deposits
                </div>
              )}
            </div>

            {userDepositIds.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">💰</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deposits yet</h3>
                <p className="text-gray-600 mb-6">
                  Start earning yield on your USDT by creating your first deposit
                </p>
                <button
                  onClick={() => setIsDepositModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create First Deposit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userDepositIds.map((depositId) => (
                  <DepositCard
                    key={depositId}
                    depositId={depositId}
                    onWithdraw={handleWithdraw}
                    onEmergencyWithdraw={handleEmergencyWithdraw}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Loading States */}
          {(isWithdrawing || isEmergencyWithdrawing) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 flex items-center gap-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>
                  {isWithdrawing ? 'Processing withdrawal...' : 'Processing emergency withdrawal...'}
                </span>
              </div>
            </div>
          )}

          {/* Deposit Modal */}
          {isDepositModalOpen && (
            <DepositModal
              isOpen={isDepositModalOpen}
              onClose={() => setIsDepositModalOpen(false)}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default SavingsPage
