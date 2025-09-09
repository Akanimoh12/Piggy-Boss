import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Shield, 
  Target, 
  Sparkles,
  ChevronRight,
  CheckCircle,
  Zap
} from 'lucide-react'
import { formatCurrency } from '@utils/formatters'
import { aiService, AIInsights, DepositHistory } from '@services/aiService'

interface AIInsightsComponentProps {
  depositHistory: DepositHistory[]
  currentBalance: number
  className?: string
}

const AIInsightsComponent: React.FC<AIInsightsComponentProps> = ({
  depositHistory,
  currentBalance,
  className = ''
}) => {
  const [insights, setInsights] = useState<AIInsights | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'optimization' | 'timing' | 'risk' | 'goals'>('optimization')

  // Load AI insights
  useEffect(() => {
    const loadInsights = async () => {
      if (depositHistory.length === 0 && currentBalance === 0) return
      
      setIsLoading(true)
      try {
        const aiInsights = await aiService.getAIInsights(depositHistory, currentBalance)
        setInsights(aiInsights)
      } catch (error) {
        console.error('Failed to load AI insights:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInsights()
  }, [depositHistory, currentBalance])

  const tabs = [
    { key: 'optimization', label: 'Yield Optimization', icon: TrendingUp },
    { key: 'timing', label: 'Best Timing', icon: Clock },
    { key: 'risk', label: 'Risk Assessment', icon: Shield },
    { key: 'goals', label: 'Savings Goals', icon: Target }
  ]

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-lg border border-surface-200 ${className}`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold gradient-text">AI Insights</h2>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary-600">Analyzing your data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!insights) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-lg border border-surface-200 ${className}`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold gradient-text">AI Insights</h2>
        </div>
        
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <p className="text-secondary-600">Start depositing to unlock AI-powered insights!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-surface-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-surface-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold gradient-text">AI Insights</h2>
            <p className="text-sm text-secondary-600">Powered by advanced analytics</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-surface-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-secondary-600 hover:text-secondary-900 hover:bg-surface-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'optimization' && (
            <motion.div
              key="optimization"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-secondary-900">Yield Optimization</h3>
                    <div className={`text-sm font-medium ${getConfidenceColor(insights.yieldOptimization.confidence)}`}>
                      {insights.yieldOptimization.confidence}% confidence
                    </div>
                  </div>
                  <p className="text-secondary-700 mb-3">{insights.yieldOptimization.suggestion}</p>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">Potential increase:</span>
                      <span className="font-bold text-green-800">+{insights.yieldOptimization.potentialIncrease}% APY</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">{insights.yieldOptimization.reason}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'timing' && (
            <motion.div
              key="timing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  insights.depositTiming.recommendation === 'now' ? 'bg-green-100' : 
                  insights.depositTiming.recommendation === 'wait' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {insights.depositTiming.recommendation === 'now' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : insights.depositTiming.recommendation === 'wait' ? (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <Zap className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-secondary-900">Deposit Timing</h3>
                    <div className={`text-sm font-medium ${getConfidenceColor(insights.depositTiming.confidence)}`}>
                      {insights.depositTiming.confidence}% confidence
                    </div>
                  </div>
                  <p className="text-secondary-700 mb-3">{insights.depositTiming.reason}</p>
                  {insights.depositTiming.optimalTime && (
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-yellow-700">Optimal time:</span>
                        <span className="font-medium text-yellow-800">
                          {insights.depositTiming.optimalTime.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="mt-3 text-sm text-secondary-600">
                    Expected benefit: +{insights.depositTiming.expectedBenefit}% improved rate
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'risk' && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  insights.riskAssessment.level === 'low' ? 'bg-green-100' :
                  insights.riskAssessment.level === 'medium' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Shield className={`w-5 h-5 ${getRiskColor(insights.riskAssessment.level)}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-secondary-900">Risk Assessment</h3>
                    <div className={`text-sm font-medium uppercase ${getRiskColor(insights.riskAssessment.level)}`}>
                      {insights.riskAssessment.level} Risk
                    </div>
                  </div>
                  <p className="text-secondary-700 mb-3">{insights.riskAssessment.recommendation}</p>
                  <div className="space-y-2">
                    {insights.riskAssessment.factors.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-secondary-400 rounded-full"></div>
                        <span className="text-secondary-600">{factor}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 bg-surface-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Risk Score:</span>
                      <span className="font-medium">{insights.riskAssessment.score}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {insights.personalizedGoals.map((goal) => (
                <div key={goal.id} className="border border-surface-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-secondary-900">{goal.name}</h4>
                    <div className="text-sm font-medium text-green-600">{goal.probability}% likely</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary-600">Target:</span>
                      <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    
                    <div className="w-full bg-surface-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary-600">Monthly deposit needed:</span>
                      <span className="font-medium text-accent">{formatCurrency(goal.recommendedMonthlyDeposit)}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-secondary-700">Strategies:</p>
                      {goal.strategies.slice(0, 2).map((strategy, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <ChevronRight className="w-3 h-3 text-accent" />
                          <span className="text-secondary-600">{strategy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Market Trends Footer */}
      <div className="px-6 py-4 bg-surface-50 border-t border-surface-200">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-secondary-700">
              <span className="font-medium">Market trend:</span> {insights.marketTrends.direction.toUpperCase()} 
              <span className="text-secondary-500"> • {insights.marketTrends.confidence}% confidence</span>
            </p>
            <p className="text-xs text-secondary-500">{insights.marketTrends.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIInsightsComponent
