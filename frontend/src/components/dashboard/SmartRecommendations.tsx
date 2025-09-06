/**
 * Smart Recommendations Component
 * 
 * Provides AI-powered recommendations during the deposit flow
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, Lightbulb, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@utils/formatters'
import { aiService, YieldOptimization, DepositTiming, RiskAssessment } from '@services/aiService'

interface SmartRecommendationsProps {
  amount: number
  selectedPeriod: { days: number; apy: number } | null
  onRecommendationApply?: (recommendation: any) => void
  className?: string
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  amount,
  selectedPeriod,
  onRecommendationApply,
  className = ''
}) => {
  const [yieldOptimization, setYieldOptimization] = useState<YieldOptimization | null>(null)
  const [depositTiming, setDepositTiming] = useState<DepositTiming | null>(null)
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (amount > 0 && selectedPeriod) {
      loadRecommendations()
    }
  }, [amount, selectedPeriod])

  const loadRecommendations = async () => {
    if (!selectedPeriod) return
    
    setIsLoading(true)
    try {
      const [optimization, timing, risk] = await Promise.all([
        aiService.getYieldOptimization([], amount),
        aiService.getDepositTiming(),
        aiService.assessRisk(amount, selectedPeriod.days)
      ])

      setYieldOptimization(optimization)
      setDepositTiming(timing)
      setRiskAssessment(risk)
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTimingIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'now': return '🚀'
      case 'wait': return '⏰'
      case 'partial_now': return '⚡'
      default: return '🤔'
    }
  }

  const getTimingColor = (recommendation: string) => {
    switch (recommendation) {
      case 'now': return 'text-green-600'
      case 'wait': return 'text-yellow-600'
      case 'partial_now': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (!amount || !selectedPeriod) {
    return (
      <div className={`bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 ${className}`}>
        <div className="flex items-center space-x-3">
          <Brain className="w-5 h-5 text-purple-600" />
          <div>
            <h3 className="font-semibold text-purple-900">Smart Recommendations</h3>
            <p className="text-sm text-purple-600">Complete your selection to see AI insights</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h3 className="font-semibold text-purple-900">Analyzing your deposit...</h3>
            <p className="text-sm text-purple-600">AI is processing recommendations</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-purple-900">Smart Recommendations</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Yield Optimization */}
        {yieldOptimization && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 border border-surface-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-secondary-900 mb-1">Yield Boost</h4>
                <p className="text-xs text-secondary-600 mb-2">{yieldOptimization.suggestion}</p>
                <div className="text-xs font-semibold text-green-600">
                  +{yieldOptimization.potentialIncrease}% APY possible
                </div>
                <div className="text-xs text-secondary-500">
                  {yieldOptimization.confidence}% confidence
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Deposit Timing */}
        {depositTiming && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-4 border border-surface-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              <div className="text-lg">{getTimingIcon(depositTiming.recommendation)}</div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-secondary-900 mb-1">
                  Timing: {depositTiming.recommendation.replace('_', ' ').toUpperCase()}
                </h4>
                <p className="text-xs text-secondary-600 mb-2">{depositTiming.reason}</p>
                <div className={`text-xs font-semibold ${getTimingColor(depositTiming.recommendation)}`}>
                  +{depositTiming.expectedBenefit}% rate improvement
                </div>
                <div className="text-xs text-secondary-500">
                  {depositTiming.confidence}% confidence
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Risk Assessment */}
        {riskAssessment && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-4 border border-surface-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-secondary-900 mb-1">
                  Risk: {riskAssessment.level.toUpperCase()}
                </h4>
                <p className="text-xs text-secondary-600 mb-2">{riskAssessment.recommendation}</p>
                <div className={`text-xs font-semibold ${getRiskColor(riskAssessment.level)}`}>
                  Score: {riskAssessment.score}/100
                </div>
                <div className="text-xs text-secondary-500">
                  {Math.round(riskAssessment.volatilityPrediction * 100)}% volatility expected
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Smart Action Suggestions */}
      {yieldOptimization?.recommendedAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
        >
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-2">Smart Suggestion</h4>
              
              {yieldOptimization.recommendedAction === 'increase_amount' && (
                <div>
                  <p className="text-sm text-blue-800 mb-3">
                    Consider depositing {formatCurrency(Math.max(1000, amount * 1.5))} instead to unlock premium rates.
                  </p>
                  <button
                    onClick={() => onRecommendationApply?.({ 
                      action: 'increase_amount', 
                      suggestedAmount: Math.max(1000, amount * 1.5) 
                    })}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Suggestion
                  </button>
                </div>
              )}

              {yieldOptimization.recommendedAction === 'change_duration' && (
                <div>
                  <p className="text-sm text-blue-800 mb-3">
                    Switch to 90-day plan for {yieldOptimization.potentialIncrease}% higher APY.
                  </p>
                  <button
                    onClick={() => onRecommendationApply?.({ 
                      action: 'change_duration', 
                      suggestedDuration: 90 
                    })}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Suggestion
                  </button>
                </div>
              )}

              {yieldOptimization.recommendedAction === 'diversify' && (
                <div>
                  <p className="text-sm text-blue-800 mb-3">
                    Split deposit across multiple plans to optimize risk-adjusted returns.
                  </p>
                  <button
                    onClick={() => onRecommendationApply?.({ 
                      action: 'diversify',
                      suggestion: 'Split your deposit across different lock periods'
                    })}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SmartRecommendations
