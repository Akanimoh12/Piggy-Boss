/**
 * SavingsCard Component - Individual Savings Display
 * 
 * Features:
 * - Countdown timer to maturity
 * - Current value with live interest updates
 * - Progress bar animation
 * - Early withdrawal option with penalty display
 * - Claim button when matured
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@utils/formatters'

interface SavingsCardProps {
  id: string
  plan: string
  amount: number
  apy: number
  duration: number // in days
  startDate: Date
  maturityDate: Date
  currentValue: number
  isMatured: boolean
  delay?: number
  onClaim?: (id: string) => void
  onEarlyWithdraw?: (id: string) => void
}

const SavingsCard: React.FC<SavingsCardProps> = ({
  id,
  plan,
  amount,
  apy,
  duration,
  startDate,
  maturityDate,
  currentValue: initialValue,
  isMatured: initialMatured,
  delay = 0,
  onClaim,
  onEarlyWithdraw
}) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentValue, setCurrentValue] = useState(initialValue)
  const [isMatured, setIsMatured] = useState(initialMatured)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Calculate real-time interest
  useEffect(() => {
    if (!isMatured) {
      const timeElapsed = (currentTime.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) // days
      const yearlyRate = apy / 100
      const dailyRate = yearlyRate / 365
      const newValue = amount * (1 + (dailyRate * timeElapsed))
      setCurrentValue(newValue)
      
      // Check if matured
      if (currentTime >= maturityDate) {
        setIsMatured(true)
      }
    }
  }, [currentTime, amount, apy, startDate, maturityDate, isMatured])

  // Calculate countdown
  const getTimeRemaining = () => {
    if (isMatured) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    
    const timeLeft = maturityDate.getTime() - currentTime.getTime()
    if (timeLeft <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
    
    return { days, hours, minutes, seconds }
  }

  // Calculate progress percentage
  const getProgress = () => {
    const totalDuration = maturityDate.getTime() - startDate.getTime()
    const elapsed = currentTime.getTime() - startDate.getTime()
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
  }

  // Calculate early withdrawal penalty
  const getEarlyWithdrawAmount = () => {
    const penalty = 0.05 // 5% penalty
    return currentValue * (1 - penalty)
  }

  const timeRemaining = getTimeRemaining()
  const progress = getProgress()
  const earnedAmount = currentValue - amount

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`card p-6 hover:shadow-soft-lg transition-all duration-300 ${
          isMatured ? 'ring-2 ring-success-300 bg-success-50' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-900">{plan}</h3>
            <p className="text-sm text-secondary-600">
              {apy}% APY • {duration} days
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-900">
              {formatCurrency(currentValue)}
            </div>
            <div className={`text-sm font-medium ${
              earnedAmount > 0 ? 'text-success-600' : 'text-secondary-500'
            }`}>
              {earnedAmount > 0 ? '+' : ''}{formatCurrency(earnedAmount)}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isMatured 
              ? 'bg-success-100 text-success-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {isMatured ? '✅ Matured' : '⏳ Active'}
          </div>
          <div className="text-xs text-secondary-500">
            Principal: {formatCurrency(amount)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-secondary-600 mb-2">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-all duration-500 ${
                isMatured 
                  ? 'bg-gradient-to-r from-success-400 to-success-600'
                  : 'bg-gradient-to-r from-accent-400 to-primary-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Countdown Timer */}
        {!isMatured && (
          <div className="bg-surface-50 rounded-xl p-4 mb-4">
            <div className="text-center">
              <div className="text-xs text-secondary-600 mb-2">Time Remaining</div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-primary-900">
                    {timeRemaining.days}
                  </div>
                  <div className="text-xs text-secondary-500">Days</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary-900">
                    {timeRemaining.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-secondary-500">Hours</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary-900">
                    {timeRemaining.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-secondary-500">Min</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary-900">
                    {timeRemaining.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-secondary-500">Sec</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Maturity Information */}
        {isMatured && (
          <div className="bg-success-50 border border-success-200 rounded-xl p-4 mb-4">
            <div className="flex items-center text-success-800">
              <span className="text-lg mr-2">🎉</span>
              <div>
                <div className="font-semibold">Congratulations!</div>
                <div className="text-sm">Your savings plan has matured</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isMatured ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onClaim?.(id)}
              className="flex-1 btn btn-primary"
            >
              <span className="mr-2">🎁</span>
              Claim {formatCurrency(currentValue)}
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowWithdrawModal(true)}
                className="flex-1 btn btn-outline"
              >
                Early Withdraw
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-surface-100 hover:bg-surface-200 rounded-xl transition-colors"
                title="View Details"
              >
                📊
              </motion.button>
            </>
          )}
        </div>

        {/* Dates */}
        <div className="flex justify-between text-xs text-secondary-500 mt-4 pt-4 border-t border-surface-200">
          <span>Started: {startDate.toLocaleDateString()}</span>
          <span>Matures: {maturityDate.toLocaleDateString()}</span>
        </div>
      </motion.div>

      {/* Early Withdrawal Modal */}
      {showWithdrawModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowWithdrawModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">
                Early Withdrawal
              </h3>
              <p className="text-secondary-600 text-sm">
                Withdrawing early will result in a 5% penalty fee
              </p>
            </div>

            <div className="bg-surface-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-secondary-600">Current Value:</span>
                <span className="font-semibold">{formatCurrency(currentValue)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-secondary-600">Penalty (5%):</span>
                <span className="text-error-600 font-semibold">
                  -{formatCurrency(currentValue * 0.05)}
                </span>
              </div>
              <hr className="my-2 border-surface-200" />
              <div className="flex justify-between items-center">
                <span className="font-semibold">You'll Receive:</span>
                <span className="font-bold text-primary-900">
                  {formatCurrency(getEarlyWithdrawAmount())}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onEarlyWithdraw?.(id)
                  setShowWithdrawModal(false)
                }}
                className="flex-1 btn btn-primary bg-error-600 hover:bg-error-700"
              >
                Confirm Withdrawal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default SavingsCard
