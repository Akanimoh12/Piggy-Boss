import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Shield, 
  Gift, 
  AlertTriangle,
  Calculator,
  Sparkles,
  Target
} from 'lucide-react'
import { useSavingsData, useSavingsPlans } from '../../hooks/useSavingsData'
import { formatCurrency } from '../../utils/formatters'

interface SavingsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlan?: {
    days: number
    apy: number
    minAmount: number
    maxAmount: number
    risk: string
    color: string
    description: string
    features: string[]
    popular?: boolean
  } | null
  onSuccess?: () => void
}

const SavingsModal: React.FC<SavingsModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedPlan, 
  onSuccess 
}) => {
  const { portfolioSummary, createDepositHook } = useSavingsData()
  const { savingsPlans } = useSavingsPlans()
  const [amount, setAmount] = useState('')
  const [currentStep, setCurrentStep] = useState<'input' | 'approve' | 'deposit' | 'success'>('input')
  const [validationError, setValidationError] = useState('')

  const { approveUSDT, createDeposit, validateAmount, isApproving, isCreating } = createDepositHook

  // Get the contract plan data for validation
  const contractPlan = savingsPlans.find(p => p.id === selectedPlan?.days)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount('')
      setCurrentStep('input')
      setValidationError('')
    }
  }, [isOpen])

  // Validate amount whenever it changes
  useEffect(() => {
    if (amount && selectedPlan) {
      try {
        validateAmount(amount, selectedPlan.days)
        setValidationError('')
      } catch (error) {
        setValidationError(error instanceof Error ? error.message : 'Invalid amount')
      }
    } else {
      setValidationError('')
    }
  }, [amount, selectedPlan, validateAmount])

  // Auto-proceed after approval completes
  useEffect(() => {
    if (currentStep === 'approve' && !isApproving && !isCreating) {
      // Small delay to ensure approval is processed
      const timer = setTimeout(() => {
        setCurrentStep('deposit')
        handleDeposit()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isApproving, currentStep, isCreating])

  if (!selectedPlan || !contractPlan) return null

  const amountNum = parseFloat(amount) || 0
  const isAmountValid = !validationError && amountNum > 0
  const hasInsufficientBalance = amountNum > portfolioSummary.availableBalance
  const needsApproval = amountNum > portfolioSummary.allowance

  // Use contract data for calculations
  const projectedEarnings = amountNum * (contractPlan.apy / 100 / 365) * selectedPlan.days
  const totalReturn = amountNum + projectedEarnings

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-600',
        button: 'bg-blue-500 hover:bg-blue-600',
        accent: 'text-blue-500'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-600',
        button: 'bg-green-500 hover:bg-green-600',
        accent: 'text-green-500'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-600',
        button: 'bg-purple-500 hover:bg-purple-600',
        accent: 'text-purple-500'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-600',
        button: 'bg-orange-500 hover:bg-orange-600',
        accent: 'text-orange-500'
      },
      pink: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        text: 'text-pink-600',
        button: 'bg-pink-500 hover:bg-pink-600',
        accent: 'text-pink-500'
      }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  const colors = getColorClasses(selectedPlan.color)

  const handleApprove = async () => {
    try {
      setCurrentStep('approve')
      await approveUSDT(amount, selectedPlan.days)
      // Don't immediately proceed - let the useEffect handle the transition
    } catch (error) {
      console.error('Approval failed:', error)
      setCurrentStep('input')
    }
  }

  const handleDeposit = async () => {
    try {
      setCurrentStep('deposit')
      await createDeposit(amount, selectedPlan.days)
      setCurrentStep('success')
      // Auto-close after success
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Deposit failed:', error)
      setCurrentStep('input')
    }
  }

  const handleProceed = () => {
    if (currentStep === 'deposit') {
      handleDeposit()
    } else if (needsApproval) {
      handleApprove()
    } else {
      handleDeposit()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className={`${colors.bg} ${colors.border} border-b px-6 py-4 rounded-t-2xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${colors.button} rounded-lg flex items-center justify-center`}>
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedPlan.days}-Day Savings Plan
                    </h3>
                    <p className={`text-sm ${colors.text}`}>
                      {selectedPlan.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Popular badge */}
              {selectedPlan.popular && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Plan Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${colors.accent}`}>
                    {selectedPlan.apy.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">APY</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${colors.accent}`}>
                    {selectedPlan.days}
                  </div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Plan Features</h4>
                <div className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 ${colors.button} rounded-full mr-2`}></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount (USDT)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Min: ${contractPlan.minAmount} USDT`}
                    className={`w-full px-4 py-3 border rounded-lg text-lg font-medium focus:ring-2 focus:ring-offset-2 focus:ring-${selectedPlan.color}-500 focus:border-transparent ${
                      validationError && amount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min={contractPlan.minAmount}
                    max={contractPlan.maxAmount}
                    step="0.01"
                  />
                  <DollarSign className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>

                {/* Validation Messages */}
                {validationError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {validationError}
                  </p>
                )}

                {hasInsufficientBalance && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Insufficient USDT balance (Available: ${portfolioSummary.availableBalance.toFixed(2)})
                  </p>
                )}

                <div className="mt-2 text-sm text-gray-500">
                  Range: {contractPlan.minAmount} - {formatCurrency(contractPlan.maxAmount)} USDT
                </div>
              </div>

              {/* Projections */}
              {isAmountValid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`${colors.bg} rounded-lg p-4 mb-6`}
                >
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Calculator className="w-4 h-4 mr-2" />
                    Projected Returns
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Initial Deposit</span>
                      <span className="font-medium">${amountNum.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estimated Earnings</span>
                      <span className={`font-medium ${colors.text}`}>
                        +${projectedEarnings.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900">Total Return</span>
                      <span className={`font-bold ${colors.text}`}>
                        ${totalReturn.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Current Step Indicator */}
              {currentStep !== 'input' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${currentStep === 'approve' ? colors.text : 'text-gray-400'}`}>
                      Step 1: Approve USDT
                    </span>
                    <span className={`${currentStep === 'deposit' ? colors.text : 'text-gray-400'}`}>
                      Step 2: Create Deposit
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 ${colors.button} rounded-full transition-all duration-300`}
                      style={{ width: currentStep === 'approve' ? '50%' : '100%' }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleProceed}
                  disabled={!isAmountValid || hasInsufficientBalance || isApproving || isCreating}
                  className={`w-full py-3 px-4 ${colors.button} text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                >
                  {isApproving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Approving USDT...
                    </>
                  ) : isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Deposit...
                    </>
                  ) : currentStep === 'deposit' ? (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Create Savings Plan
                    </>
                  ) : needsApproval ? (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Approve USDT Spending
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Create Savings Plan
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Risk Disclaimer */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start text-xs text-yellow-800">
                  <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Risk Level: {selectedPlan.risk}</p>
                    <p className="mt-1">
                      Savings plans are locked for the specified period. Early withdrawal may incur penalties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SavingsModal
