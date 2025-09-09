import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'

export interface AIInsight {
  id: string
  type: 'optimization' | 'warning' | 'opportunity' | 'prediction'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  category: 'savings' | 'yield' | 'risk' | 'portfolio'
  action?: string
  data?: any
  timestamp: number
}

export interface MarketTrend {
  token: string
  price: number
  change24h: number
  prediction: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  volume24h?: number
  marketCap?: number
}

export interface AIPerformance {
  predictionAccuracy: number
  recommendationsApplied: number
  totalRecommendations: number
  portfolioImprovement: number
  lastAnalysis: number
}

export interface PortfolioScore {
  overall: number
  diversification: number
  riskManagement: number
  yieldOptimization: number
  savingsStrategy: number
}

export const useAIInsights = () => {
  const { address, isConnected } = useAccount()
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([])
  const [aiPerformance, setAiPerformance] = useState<AIPerformance>({
    predictionAccuracy: 87,
    recommendationsApplied: 12,
    totalRecommendations: 15,
    portfolioImprovement: 23,
    lastAnalysis: Date.now()
  })
  const [portfolioScore, setPortfolioScore] = useState<PortfolioScore>({
    overall: 8.4,
    diversification: 7.8,
    riskManagement: 8.9,
    yieldOptimization: 7.6,
    savingsStrategy: 8.2
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Generate AI insights based on user data
  const generateInsights = useCallback(async () => {
    if (!isConnected || !address) return

    setIsAnalyzing(true)

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newInsights: AIInsight[] = []
    const timestamp = Date.now()

    // Portfolio diversification analysis
    newInsights.push({
      id: `insight_${timestamp}_1`,
      type: 'optimization',
      title: 'Portfolio Diversification Opportunity',
      description: 'Your portfolio is heavily concentrated in USDT staking. Consider diversifying across different yield strategies for better risk-adjusted returns.',
      confidence: 85,
      impact: 'medium',
      category: 'portfolio',
      action: 'Explore diversification options',
      data: { concentration: 78, recommendedAllocation: { usdt: 60, other: 40 } },
      timestamp
    })

    // Yield optimization
    newInsights.push({
      id: `insight_${timestamp}_2`,
      type: 'opportunity',
      title: 'High-Yield Opportunity Detected',
      description: 'Premium Vault is currently offering 35% APY with lower-than-usual entry requirements. Consider allocating 15-20% of your portfolio.',
      confidence: 92,
      impact: 'high',
      category: 'yield',
      action: 'Stake in Premium Vault',
      data: { currentApy: 35, historicalAvg: 28, opportunity: 7 },
      timestamp
    })

    // Risk management
    newInsights.push({
      id: `insight_${timestamp}_3`,
      type: 'warning',
      title: 'Concentration Risk Alert',
      description: 'Over 60% of your portfolio is in high-risk positions. Market volatility could significantly impact your returns.',
      confidence: 88,
      impact: 'high',
      category: 'risk',
      action: 'Rebalance portfolio allocation',
      data: { highRiskPercentage: 65, recommendedMax: 40 },
      timestamp
    })

    // Savings strategy
    newInsights.push({
      id: `insight_${timestamp}_4`,
      type: 'optimization',
      title: 'Automated Savings Recommendation',
      description: 'Your deposit frequency suggests irregular saving patterns. Set up automated weekly deposits of $50 to maximize compound growth.',
      confidence: 76,
      impact: 'medium',
      category: 'savings',
      action: 'Setup auto-deposit',
      data: { currentFrequency: 'irregular', recommendedAmount: 50, frequency: 'weekly' },
      timestamp
    })

    // Market prediction
    newInsights.push({
      id: `insight_${timestamp}_5`,
      type: 'prediction',
      title: 'Market Outlook Prediction',
      description: 'AI models predict a 15% increase in DeFi yields over the next 30 days. Consider increasing your staking positions.',
      confidence: 72,
      impact: 'medium',
      category: 'yield',
      data: { predictedIncrease: 15, timeframe: 30, currentMarketSentiment: 'bullish' },
      timestamp
    })

    // Performance insight
    newInsights.push({
      id: `insight_${timestamp}_6`,
      type: 'optimization',
      title: 'Compound Interest Optimization',
      description: 'You could increase earnings by 12% annually by reinvesting rewards instead of claiming them immediately.',
      confidence: 89,
      impact: 'medium',
      category: 'yield',
      action: 'Enable auto-compound',
      data: { potentialIncrease: 12, currentStrategy: 'manual', recommended: 'auto-compound' },
      timestamp
    })

    setInsights(newInsights)
    setIsAnalyzing(false)
  }, [isConnected, address])

  // Update market trends
  const updateMarketTrends = useCallback(() => {
    const trends: MarketTrend[] = [
      {
        token: 'USDT',
        price: 1.000,
        change24h: 0.05,
        prediction: 'neutral',
        confidence: 95,
        volume24h: 48500000,
        marketCap: 83200000000
      },
      {
        token: 'ETH',
        price: 2485.32,
        change24h: 3.24,
        prediction: 'bullish',
        confidence: 78,
        volume24h: 12800000,
        marketCap: 298600000000
      },
      {
        token: 'BTC',
        price: 43250.89,
        change24h: -1.56,
        prediction: 'bearish',
        confidence: 67,
        volume24h: 28900000,
        marketCap: 843500000000
      },
      {
        token: 'SOMNIA',
        price: 0.245,
        change24h: 8.76,
        prediction: 'bullish',
        confidence: 82,
        volume24h: 2400000,
        marketCap: 125000000
      }
    ]

    setMarketTrends(trends)
  }, [])

  // Calculate portfolio score
  const calculatePortfolioScore = useCallback(() => {
    // Mock calculation based on various factors
    const scores = {
      overall: 8.4,
      diversification: Math.max(5, Math.min(10, 8.5 + (Math.random() - 0.5))),
      riskManagement: Math.max(5, Math.min(10, 8.2 + (Math.random() - 0.5))),
      yieldOptimization: Math.max(5, Math.min(10, 7.8 + (Math.random() - 0.5))),
      savingsStrategy: Math.max(5, Math.min(10, 8.1 + (Math.random() - 0.5)))
    }

    scores.overall = (scores.diversification + scores.riskManagement + scores.yieldOptimization + scores.savingsStrategy) / 4

    setPortfolioScore(scores)
  }, [])

  // Initialize data
  useEffect(() => {
    if (isConnected && address) {
      updateMarketTrends()
      calculatePortfolioScore()
      generateInsights()
    }
  }, [isConnected, address, updateMarketTrends, calculatePortfolioScore, generateInsights])

  // Refresh all data
  const refreshAll = useCallback(async () => {
    updateMarketTrends()
    calculatePortfolioScore()
    await generateInsights()
  }, [updateMarketTrends, calculatePortfolioScore, generateInsights])

  // Get insights by category
  const getInsightsByCategory = useCallback((category: string) => {
    if (category === 'all') return insights
    return insights.filter(insight => insight.category === category)
  }, [insights])

  // Get insights by type
  const getInsightsByType = useCallback((type: string) => {
    return insights.filter(insight => insight.type === type)
  }, [insights])

  // Calculate insight statistics
  const insightStats = {
    total: insights.length,
    highImpact: insights.filter(i => i.impact === 'high').length,
    mediumImpact: insights.filter(i => i.impact === 'medium').length,
    lowImpact: insights.filter(i => i.impact === 'low').length,
    avgConfidence: insights.length > 0 
      ? insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length 
      : 0,
    categories: {
      savings: insights.filter(i => i.category === 'savings').length,
      yield: insights.filter(i => i.category === 'yield').length,
      risk: insights.filter(i => i.category === 'risk').length,
      portfolio: insights.filter(i => i.category === 'portfolio').length
    }
  }

  return {
    // Data
    insights,
    marketTrends,
    aiPerformance,
    portfolioScore,
    insightStats,
    
    // State
    isAnalyzing,
    
    // Actions
    generateInsights,
    refreshAll,
    getInsightsByCategory,
    getInsightsByType,
    updateMarketTrends,
    calculatePortfolioScore
  }
}
