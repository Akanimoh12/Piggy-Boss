import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '@utils/formatters'
import {
  showErrorToast,
  showTransactionSuccessToast,
  showTransactionErrorToast,
  showDepositSuccessToast,
  showTransactionPendingToast
} from '../../utils/toast'
import { useAccount } from 'wagmi'
import { usePiggyVault, useMockUSDT } from '@hooks/useContract'
import { X, TrendingUp, Lock, DollarSign, CheckCircle, Loader2, Sparkles } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

// Constants
const LOCK_PERIODS = [
  { days: 7, apy: 8.5, label: '7 Days', popular: false },
  { days: 14, apy: 10.2, label: '14 Days', popular: false },
  { days: 30, apy: 12.5, label: '30 Days', popular: true },
  { days: 90, apy: 15.0, label: '90 Days', popular: false }
]
const MIN_AMOUNT = 10
const MAX_AMOUNT = 100000

// Interface for deposit modal props
interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

// Animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 }
}

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

// Confetti component
const ConfettiEffect: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number }>>([])

  useEffect(() => {
    const colors = ['#F59E0B', '#EF4444', '#8B5CF6', '#10B981', '#3B82F6']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)] || '#F59E0B',
      size: Math.random() * 10 + 5
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 1, 0], 
            rotate: [0, 180, 360],
            y: [-20, -100, -200]
          }}
          transition={{ 
            duration: 3, 
            ease: "easeOut",
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  )
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { address, isConnected } = useAccount()
  
  // Contract hooks
  const { createDeposit, isCreatingDeposit } = usePiggyVault()
  const { usdtBalance, allowance, approve, isApproving } = useMockUSDT()
  
  const [step, setStep] = useState(1)
  const [selectedPeriod, setSelectedPeriod] = useState<typeof LOCK_PERIODS[0] | null>(null)
  const [amount, setAmount] = useState('')
  const [projectedEarnings, setProjectedEarnings] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)

  // Check if amount is approved
  useEffect(() => {
    if (!amount || !allowance) {
      setIsApproved(false)
      return
    }
    setIsApproved(parseFloat(allowance) >= parseFloat(amount))
  }, [amount, allowance])

  // Generate chart data for projected earnings
  const chartData = useMemo(() => {
    if (!selectedPeriod || !amount) return []
    
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return []
    
    const dailyRate = selectedPeriod.apy / 365 / 100
    const data = []
    
    for (let day = 0; day <= selectedPeriod.days; day++) {
      const value = numAmount * (1 + dailyRate * day)
      data.push({
        day,
        value: Number(value.toFixed(2)),
        earnings: Number((value - numAmount).toFixed(2))
      })
    }
    
    return data
  }, [selectedPeriod, amount])

  // Calculate projected earnings
  useEffect(() => {
    if (selectedPeriod && amount) {
      const numAmount = parseFloat(amount)
      if (!isNaN(numAmount)) {
        const earnings = numAmount * (selectedPeriod.apy / 100) * (selectedPeriod.days / 365)
        setProjectedEarnings(earnings)
      }
    }
  }, [selectedPeriod, amount])

  // Step handlers
  const handlePeriodSelect = (period: typeof LOCK_PERIODS[0]) => {
    setSelectedPeriod(period)
    setError(null)
    setStep(2)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    setError(null)
    
    // Real-time validation
    const numValue = parseFloat(value)
    if (value && (isNaN(numValue) || numValue < MIN_AMOUNT)) {
      setError(`Minimum deposit is ${MIN_AMOUNT} USDT`)
    } else if (numValue > MAX_AMOUNT) {
      setError(`Maximum deposit is ${formatCurrency(MAX_AMOUNT)} USDT`)
    }
  }

  const handleAmountNext = () => {
    const numAmount = parseFloat(amount)
    const balance = parseFloat(usdtBalance)
    
    if (isNaN(numAmount) || numAmount < MIN_AMOUNT) {
      setError(`Minimum deposit is ${MIN_AMOUNT} USDT`)
      return
    }
    if (numAmount > MAX_AMOUNT) {
      setError(`Maximum deposit is ${formatCurrency(MAX_AMOUNT)} USDT`)
      return
    }
    if (numAmount > balance) {
      setError(`Insufficient balance. You have ${parseFloat(usdtBalance).toFixed(6)} USDT`)
      return
    }
    setError(null)
    setStep(3)
  }

  const handleApprove = async () => {
    if (!selectedPeriod || !amount) return
    
    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      showErrorToast('Please connect your wallet first')
      return
    }
    
    setError(null)
    
    const toastId = showTransactionPendingToast('Approving USDT spending...')
    
    try {
      // Call the actual approve function from contract hook
      await approve(amount)
      setStep(4)
      showTransactionSuccessToast('USDT spending approved!')
    } catch (err: any) {
      setError('Approval failed. Please try again.')
      showTransactionErrorToast('Approval failed. Please try again.')
    }
  }

  const handleDeposit = async () => {
    if (!selectedPeriod || !amount) return
    
    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      showErrorToast('Please connect your wallet first')
      return
    }
    
    setError(null)
    
    const toastId = showTransactionPendingToast('Processing your deposit...')
    
    try {
      // Call the actual createDeposit function from contract hook
      await createDeposit(amount, selectedPeriod.days)
      setShowConfetti(true)
      setStep(5)
      showDepositSuccessToast(parseFloat(amount), selectedPeriod.apy)
    } catch (err: any) {
      setError('Deposit failed. Please try again.')
      showTransactionErrorToast('Deposit failed. Please try again.')
    }
  }

  const handleClose = () => {
    // Reset all state
    setStep(1)
    setSelectedPeriod(null)
    setAmount('')
    setProjectedEarnings(0)
    setError(null)
    setShowConfetti(false)
    setIsApproved(false)
    setIsDepositing(false)
    onClose()
  }

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1)
      setError(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div 
            className="glass bg-white/95 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* Confetti Effect */}
            {showConfetti && <ConfettiEffect />}
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary-900">Create Savings Plan</h2>
                  <p className="text-sm text-secondary-600">Step {step} of 5</p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="w-8 h-8 rounded-lg bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-secondary-600" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-3">
              <div className="w-full bg-surface-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                  initial={{ width: "20%" }}
                  animate={{ width: `${(step / 5) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Select Lock Period */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-primary-900 mb-2">
                        Choose Your Lock Period
                      </h3>
                      <p className="text-secondary-600 text-sm">
                        Longer periods earn higher APY rates
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {LOCK_PERIODS.map((period) => (
                        <motion.button
                          key={period.days}
                          onClick={() => handlePeriodSelect(period)}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            selectedPeriod?.days === period.days
                              ? 'border-accent bg-accent/10'
                              : 'border-surface-200 hover:border-accent/50 hover:bg-accent/5'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {period.popular && (
                            <div className="absolute -top-2 left-3 bg-gradient-to-r from-primary to-accent text-white text-xs px-2 py-1 rounded-full">
                              Popular
                            </div>
                          )}
                          <div className="flex items-center space-x-2 mb-2">
                            <Lock className="w-4 h-4 text-accent" />
                            <span className="font-semibold text-primary-900">{period.label}</span>
                          </div>
                          <div className="text-2xl font-bold text-accent mb-1">
                            {period.apy}%
                          </div>
                          <div className="text-xs text-secondary-600">APY</div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Enter Amount */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-primary-900 mb-2">
                        Enter Deposit Amount
                      </h3>
                      <div className="flex justify-between items-center">
                        <p className="text-secondary-600 text-sm">
                          Minimum {MIN_AMOUNT} USDT • Maximum {formatCurrency(MAX_AMOUNT)} USDT
                        </p>
                        <p className="text-sm text-blue-600 font-medium">
                          Balance: {parseFloat(usdtBalance).toFixed(6)} USDT
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={handleAmountChange}
                          placeholder="0.00"
                          className={`input text-xl font-semibold pr-16 ${
                            error ? 'input-error' : ''
                          }`}
                          min={MIN_AMOUNT}
                          max={MAX_AMOUNT}
                          step="0.01"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-600 font-medium">
                          USDT
                        </div>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-error text-sm flex items-center space-x-2"
                        >
                          <span>⚠️</span>
                          <span>{error}</span>
                        </motion.div>
                      )}

                      {/* Quick Amount Buttons */}
                      <div className="grid grid-cols-4 gap-2">
                        {[50, 100, 500, 1000].map((quickAmount) => (
                          <button
                            key={quickAmount}
                            onClick={() => setAmount(quickAmount.toString())}
                            className="btn btn-outline btn-sm"
                          >
                            ${quickAmount}
                          </button>
                        ))}
                      </div>

                      {/* Selected Period Summary */}
                      {selectedPeriod && (
                        <div className="bg-accent/5 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-secondary-600">Lock Period:</span>
                            <span className="font-semibold text-primary-900">
                              {selectedPeriod.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-secondary-600">APY:</span>
                            <span className="font-semibold text-accent">
                              {selectedPeriod.apy}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleBackStep}
                        className="btn btn-outline flex-1"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleAmountNext}
                        disabled={!amount || !!error || parseFloat(amount) < MIN_AMOUNT}
                        className="btn btn-primary flex-1"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Projected Earnings Chart */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-primary-900 mb-2">
                        Projected Earnings
                      </h3>
                      <p className="text-secondary-600 text-sm">
                        Watch your money grow over time
                      </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                        <div className="text-blue-600 text-sm font-medium mb-1">
                          Initial Deposit
                        </div>
                        <div className="text-xl font-bold text-blue-900">
                          {formatCurrency(parseFloat(amount) || 0)}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                        <div className="text-green-600 text-sm font-medium mb-1">
                          Total at Maturity
                        </div>
                        <div className="text-xl font-bold text-green-900">
                          {formatCurrency((parseFloat(amount) || 0) + projectedEarnings)}
                        </div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-surface-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-primary-900">Growth Projection</span>
                      </div>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <XAxis 
                              dataKey="day" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: '#6B7280' }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: '#6B7280' }}
                              tickFormatter={(value) => `$${value.toFixed(0)}`}
                            />
                            <Tooltip 
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length > 0 && payload[0]?.payload) {
                                  const data = payload[0].payload
                                  return (
                                    <div className="bg-white rounded-lg shadow-lg border p-3">
                                      <p className="text-secondary-600 text-sm">Day {label}</p>
                                      <p className="font-semibold text-primary-900">
                                        Balance: {formatCurrency(data.value)}
                                      </p>
                                      <p className="text-green-600 text-sm">
                                        Earnings: +{formatCurrency(data.earnings)}
                                      </p>
                                    </div>
                                  )
                                }
                                return null
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="#EC4899"
                              strokeWidth={2}
                              fill="url(#earningsGradient)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Earnings Breakdown */}
                    <div className="bg-accent/5 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-600">Projected Earnings:</span>
                        <span className="font-bold text-accent">
                          +{formatCurrency(projectedEarnings)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-600">Return Rate:</span>
                        <span className="font-semibold text-primary-900">
                          +{((projectedEarnings / (parseFloat(amount) || 1)) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleBackStep}
                        className="btn btn-outline flex-1"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleApprove}
                        className="btn btn-primary flex-1"
                      >
                        Approve USDT
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Approve USDT */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {isApproving ? (
                          <Loader2 className="w-8 h-8 text-accent animate-spin" />
                        ) : isApproved ? (
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        ) : (
                          <Lock className="w-8 h-8 text-accent" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-primary-900 mb-2">
                        {isApproving ? 'Approving USDT...' : isApproved ? 'USDT Approved!' : 'Approve USDT Spending'}
                      </h3>
                      <p className="text-secondary-600 text-sm max-w-sm mx-auto">
                        {isApproving 
                          ? 'Please confirm the approval transaction in your wallet'
                          : isApproved
                          ? 'You can now proceed with your deposit'
                          : 'Allow the contract to spend your USDT tokens for this deposit'
                        }
                      </p>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-error/10 border border-error/20 rounded-xl p-4 text-center"
                      >
                        <p className="text-error text-sm">{error}</p>
                      </motion.div>
                    )}

                    {isApproved && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-50 border border-green-200 rounded-xl p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-semibold text-green-900">Approval Successful</p>
                            <p className="text-green-700 text-sm">Ready to create your savings plan</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        onClick={handleBackStep}
                        disabled={isApproving}
                        className="btn btn-outline flex-1"
                      >
                        Back
                      </button>
                      {isApproved ? (
                        <button
                          onClick={handleDeposit}
                          className="btn btn-primary flex-1"
                        >
                          Confirm Deposit
                        </button>
                      ) : (
                        <button
                          onClick={handleApprove}
                          disabled={isApproving}
                          className="btn btn-primary flex-1"
                        >
                          {isApproving ? 'Approving...' : 'Approve USDT'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Confirm Deposit */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {isDepositing ? (
                          <Loader2 className="w-10 h-10 text-white animate-spin" />
                        ) : showConfetti ? (
                          <Sparkles className="w-10 h-10 text-white" />
                        ) : (
                          <DollarSign className="w-10 h-10 text-white" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-primary-900 mb-2">
                        {isDepositing ? 'Creating Your Savings Plan...' : showConfetti ? 'Congratulations!' : 'Confirm Deposit'}
                      </h3>
                      <p className="text-secondary-600 max-w-sm mx-auto">
                        {isDepositing 
                          ? 'Please confirm the deposit transaction in your wallet'
                          : showConfetti
                          ? 'Your savings plan has been created successfully! Your funds are now earning rewards.'
                          : 'Review your deposit details and confirm the transaction'
                        }
                      </p>
                    </div>

                    {!showConfetti && !isDepositing && (
                      <div className="bg-surface-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-secondary-600">Deposit Amount:</span>
                          <span className="font-bold text-primary-900">
                            {formatCurrency(parseFloat(amount))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-secondary-600">Lock Period:</span>
                          <span className="font-semibold text-primary-900">
                            {selectedPeriod?.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-secondary-600">APY:</span>
                          <span className="font-semibold text-accent">
                            {selectedPeriod?.apy}%
                          </span>
                        </div>
                        <div className="border-t border-surface-200 pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-secondary-600">Projected Earnings:</span>
                            <span className="font-bold text-green-600">
                              +{formatCurrency(projectedEarnings)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-error/10 border border-error/20 rounded-xl p-4 text-center"
                      >
                        <p className="text-error text-sm">{error}</p>
                      </motion.div>
                    )}

                    {showConfetti ? (
                      <div className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 text-center"
                        >
                          <p className="text-primary-900 font-semibold mb-2">
                            Your savings plan is active! 🎉
                          </p>
                          <p className="text-secondary-600 text-sm">
                            You'll start earning rewards immediately. Check your dashboard to track progress.
                          </p>
                        </motion.div>
                        <button
                          onClick={handleClose}
                          className="btn btn-primary w-full"
                        >
                          View Dashboard
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          onClick={handleBackStep}
                          disabled={isDepositing}
                          className="btn btn-outline flex-1"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleDeposit}
                          disabled={isDepositing}
                          className="btn btn-primary flex-1"
                        >
                          {isDepositing ? 'Processing...' : 'Confirm Deposit'}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DepositModal
