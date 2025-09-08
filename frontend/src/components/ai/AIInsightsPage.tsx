import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Target,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Bot,
  Sparkles,
  Shield,
  Award,
  ChevronRight,
  Info
} from 'lucide-react'
import { useAIInsights } from '../../hooks/useAIInsights'

const AIInsightsPage: React.FC = () => {
  const { address, isConnected } = useAccount()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Use AI insights hook
  const {
    insights,
    marketTrends,
    aiPerformance,
    portfolioScore,
    insightStats,
    isAnalyzing,
    refreshAll,
    getInsightsByCategory
  } = useAIInsights()

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Target className="w-5 h-5" />
      case 'warning': return <AlertTriangle className="w-5 h-5" />
      case 'opportunity': return <Lightbulb className="w-5 h-5" />
      case 'prediction': return <Brain className="w-5 h-5" />
      default: return <Info className="w-5 h-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'border-blue-200 bg-blue-50 text-blue-700'
      case 'warning': return 'border-orange-200 bg-orange-50 text-orange-700'
      case 'opportunity': return 'border-green-200 bg-green-50 text-green-700'
      case 'prediction': return 'border-purple-200 bg-purple-50 text-purple-700'
      default: return 'border-gray-200 bg-gray-50 text-gray-700'
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredInsights = getInsightsByCategory(selectedCategory)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md w-full"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access AI insights and analysis</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Brain className="w-8 h-8 mr-3 text-purple-600" />
              AI Insights
            </h1>
            <p className="text-gray-600">Smart analysis and recommendations for your portfolio</p>
          </div>
          <button
            onClick={refreshAll}
            disabled={isAnalyzing}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </motion.div>

        {/* AI Analysis Status */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 mb-8 text-white"
          >
            <div className="flex items-center">
              <Bot className="w-8 h-8 mr-4 animate-pulse" />
              <div>
                <h3 className="text-xl font-bold mb-1">AI Analysis in Progress</h3>
                <p className="text-purple-100">Analyzing your portfolio and market conditions...</p>
              </div>
              <Sparkles className="w-6 h-6 ml-auto animate-pulse" />
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Portfolio Score</p>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{portfolioScore.overall.toFixed(1)}/10</p>
            <p className="text-green-600 text-sm">Excellent performance</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Risk Level</p>
              <Shield className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">Medium</p>
            <p className="text-yellow-600 text-sm">Balanced approach</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Optimization</p>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{portfolioScore.riskManagement.toFixed(0)}%</p>
            <p className="text-blue-600 text-sm">Room for improvement</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">AI Confidence</p>
              <Award className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{insightStats.avgConfidence.toFixed(0)}%</p>
            <p className="text-purple-600 text-sm">High accuracy</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Insights Panel */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Insight Categories</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'savings', 'yield', 'risk', 'portfolio'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Insights List */}
            <div className="space-y-4">
              {filteredInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-l-4 rounded-lg p-6 shadow-sm ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      {getInsightIcon(insight.type)}
                      <h4 className="text-lg font-semibold ml-2">{insight.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactBadge(insight.impact)}`}>
                        {insight.impact} impact
                      </span>
                      <span className="text-sm text-gray-600">{insight.confidence}% confidence</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{insight.description}</p>
                  {insight.action && (
                    <button className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700">
                      {insight.action}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Trends */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Market Trends
              </h3>
              <div className="space-y-4">
                {marketTrends.map((trend) => (
                  <div key={trend.token} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{trend.token}</p>
                      <p className="text-sm text-gray-600">${trend.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center ${trend.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.change24h >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">{Math.abs(trend.change24h)}%</span>
                      </div>
                      <p className="text-xs text-gray-500">{trend.confidence}% confidence</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prediction Accuracy</span>
                  <span className="font-medium">{aiPerformance.predictionAccuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recommendations Applied</span>
                  <span className="font-medium">{aiPerformance.recommendationsApplied}/{aiPerformance.totalRecommendations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Portfolio Improvement</span>
                  <span className="font-medium text-green-600">+{aiPerformance.portfolioImprovement}%</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                  <p className="font-medium text-purple-900">Optimize Portfolio</p>
                  <p className="text-sm text-purple-700">Rebalance based on AI recommendations</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <p className="font-medium text-blue-900">Risk Assessment</p>
                  <p className="text-sm text-blue-700">Analyze current risk exposure</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <p className="font-medium text-green-900">Yield Optimizer</p>
                  <p className="text-sm text-green-700">Find better earning opportunities</p>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIInsightsPage
