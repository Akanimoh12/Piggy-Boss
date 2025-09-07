import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  Clock, 
  Award, 
  Plus, 
  Eye, 
  ArrowUpRight,
  PieChart,
  Target,
  Wallet,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useSavingsData } from '../../hooks/useSavingsData'
import { formatCurrency } from '../../utils/formatters'
import SavingsModal from './SavingsModal'

interface DepositCardProps {
  deposit: {
    id: number
    user: string
    amount: string
    planDays: number
    createdAt: number
    maturityTime: number
    isWithdrawn: boolean
    accruedInterest: string
  }
  onWithdraw: (id: number) => void
  onEmergencyWithdraw: (id: number) => void
}

const DepositCard: React.FC<DepositCardProps> = ({ deposit, onWithdraw, onEmergencyWithdraw }) => {
  const [showDetails, setShowDetails] = useState(false)

  const isMatured = new Date(deposit.maturityTime) <= new Date()
  const daysRemaining = Math.max(0, Math.ceil((deposit.maturityTime - Date.now()) / (1000 * 60 * 60 * 24)))
  const progress = Math.min(100, ((Date.now() - deposit.createdAt) / (deposit.maturityTime - deposit.createdAt)) * 100)

  const getStatusColor = () => {
    if (deposit.isWithdrawn) return 'text-gray-500'
    if (isMatured) return 'text-green-500'
    return 'text-blue-500'
  }

  const getStatusText = () => {
    if (deposit.isWithdrawn) return 'Withdrawn'
    if (isMatured) return 'Matured'
    return `${daysRemaining} days left`
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200"
      whileHover={{ y: -2 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {deposit.planDays}-Day Savings Plan
            </h3>
            <p className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              ${parseFloat(deposit.amount).toFixed(2)}
            </p>
            <p className="text-sm text-green-600">
              +${parseFloat(deposit.accruedInterest).toFixed(2)} earned
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isMatured ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700 mb-4"
        >
          <Eye className="w-4 h-4 mr-1" />
          {showDetails ? 'Hide' : 'Show'} Details
        </button>

        {/* Expandable Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-4 mb-4 space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Deposit ID</span>
              <span className="font-medium">#{deposit.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Created</span>
              <span className="font-medium">
                {new Date(deposit.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Maturity Date</span>
              <span className="font-medium">
                {new Date(deposit.maturityTime).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium flex items-center ${getStatusColor()}`}>
                {deposit.isWithdrawn ? (
                  <XCircle className="w-3 h-3 mr-1" />
                ) : isMatured ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <Clock className="w-3 h-3 mr-1" />
                )}
                {getStatusText()}
              </span>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        {!deposit.isWithdrawn && (
          <div className="flex space-x-2">
            {isMatured ? (
              <button
                onClick={() => onWithdraw(deposit.id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <ArrowUpRight className="w-4 h-4 mr-1" />
                Withdraw
              </button>
            ) : (
              <button
                onClick={() => onEmergencyWithdraw(deposit.id)}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                Emergency Withdraw
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const SavingsPage: React.FC = () => {
  const { isConnected } = useAccount()
  const { 
    portfolioSummary, 
    userDeposits, 
    savingsPlans,
    isLoadingDeposits,
    withdrawHook,
    refetchAll 
  } = useSavingsData()

  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { withdrawDeposit, emergencyWithdraw, isWithdrawing, isEmergencyWithdrawing } = withdrawHook

  const handleCreateSavings = (plan: any) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  const handleModalSuccess = () => {
    refetchAll()
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-400 to-blue-600',
      green: 'from-green-400 to-green-600',
      purple: 'from-purple-400 to-purple-600',
      orange: 'from-orange-400 to-orange-600',
      pink: 'from-pink-400 to-pink-600'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md w-full"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to access savings plans and start earning rewards
          </p>
          <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-colors">
            Connect Wallet
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Savings Dashboard</h1>
              <p className="text-gray-600">Manage your savings plans and track your earnings</p>
            </div>
            <button
              onClick={refetchAll}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Portfolio Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center md:text-left">
              <p className="text-pink-100 text-sm">Total Balance</p>
              <p className="text-3xl font-bold">${portfolioSummary.totalBalance.toFixed(2)}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-pink-100 text-sm">Active Deposits</p>
              <p className="text-2xl font-bold">${portfolioSummary.totalDeposited.toFixed(2)}</p>
              <p className="text-pink-200 text-xs">{portfolioSummary.activeDeposits} plans</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-pink-100 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold">${portfolioSummary.totalInterestEarned.toFixed(2)}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-pink-100 text-sm">NFT Rewards</p>
              <p className="text-2xl font-bold flex items-center justify-center md:justify-start">
                <Award className="w-6 h-6 mr-2" />
                {portfolioSummary.userNFTCount}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Available Savings Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Savings Plans</h2>
            <div className="text-sm text-gray-600">
              Available Balance: ${portfolioSummary.availableBalance.toFixed(2)} USDT
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {savingsPlans.map((plan, index) => (
              <motion.div
                key={plan.days}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-gradient-to-br ${getColorClasses(plan.color)} rounded-xl p-6 text-white relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => handleCreateSavings(plan)}
              >
                {plan.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </span>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{plan.apy.toFixed(1)}%</p>
                      <p className="text-xs opacity-80">APY</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{plan.days} Days</h3>
                  <p className="text-sm opacity-90 mb-4">{plan.description}</p>

                  <div className="text-xs opacity-80 mb-4">
                    <p>Min: ${plan.minAmount}</p>
                    <p>Max: ${formatCurrency(plan.maxAmount)}</p>
                    <p>Risk: {plan.risk}</p>
                  </div>

                  <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Plan
                  </button>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active Deposits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Active Savings</h2>

          {isLoadingDeposits ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : userDeposits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userDeposits.map((deposit, index) => (
                <motion.div
                  key={deposit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <DepositCard
                    deposit={deposit}
                    onWithdraw={withdrawDeposit}
                    onEmergencyWithdraw={emergencyWithdraw}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <PieChart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Savings</h3>
              <p className="text-gray-600 mb-6">Start your first savings plan to begin earning rewards</p>
              <button
                onClick={() => handleCreateSavings(savingsPlans[1])} // Default to popular plan
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-colors"
              >
                Create Your First Savings Plan
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Savings Modal */}
      <SavingsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPlan(null)
        }}
        selectedPlan={selectedPlan}
        onSuccess={handleModalSuccess}
      />

      {/* Loading Overlay */}
      {(isWithdrawing || isEmergencyWithdrawing) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-900 font-medium">
              {isWithdrawing ? 'Processing withdrawal...' : 'Processing emergency withdrawal...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SavingsPage
