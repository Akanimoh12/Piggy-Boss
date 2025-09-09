import React from 'react'
import { motion } from 'framer-motion'
import {
  FiTrendingUp,
  FiDollarSign,
  FiPieChart,
  FiZap,
  FiArrowUpRight,
  FiArrowDownRight,
  FiAward,
  FiUsers
} from 'react-icons/fi'
import { useAccount } from 'wagmi'
import { useDashboardData } from '../../hooks/useDashboardData'
import PortfolioPerformance from './PortfolioPerformance'
import RecentActivity from './RecentActivity'

const ContractDashboard: React.FC = () => {
  const { address } = useAccount()
  const {
    dashboardStats,
    performanceData,
    recentActivity,
    isConnected,
    refetchAll
  } = useDashboardData()

  // Loading state while fetching data
  const isLoading = !dashboardStats && isConnected

  const stats = [
    {
      title: 'Total Balance',
      value: `$${dashboardStats?.totalBalance.toFixed(2) || '0.00'}`,
      change: dashboardStats?.totalBalance > 0 ? '+12.5%' : 'Connect wallet',
      changeType: dashboardStats?.totalBalance > 0 ? 'positive' : 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: FiDollarSign,
      color: 'bg-blue-500',
      isLoading: isLoading,
      description: 'Available USDT + Active Deposits'
    },
    {
      title: 'Active Deposits',
      value: `$${dashboardStats?.totalDeposited.toFixed(2) || '0.00'}`,
      change: dashboardStats?.totalDeposited > 0 ? `+$${dashboardStats.totalDeposited.toFixed(2)}` : 'No deposits',
      changeType: dashboardStats?.totalDeposited > 0 ? 'positive' : 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: FiPieChart,
      color: 'bg-green-500',
      isLoading: isLoading,
      description: 'Currently earning interest'
    },
    {
      title: 'Total Rewards',
      value: `$${dashboardStats?.totalRewards.toFixed(2) || '0.00'}`,
      change: dashboardStats?.currentAPY ? `${dashboardStats.currentAPY.toFixed(1)}% APY` : 'Start earning',
      changeType: dashboardStats?.totalRewards > 0 ? 'positive' : 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      isLoading: isLoading,
      description: 'Interest earned from deposits'
    },
    {
      title: 'Available USDT',
      value: `$${dashboardStats?.usdtBalance.toFixed(2) || '0.00'}`,
      change: dashboardStats?.usdtBalance > 0 ? 'Ready to deposit' : 'Get test tokens',
      changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: FiZap,
      color: 'bg-orange-500',
      isLoading: isLoading,
      description: 'USDT available for new deposits'
    },
  ]

  // Global platform stats
  const globalStats = dashboardStats?.globalStats

  return (
    <div className="space-y-6">
      {/* Welcome Section with Contract Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back! 👋
            </h1>
            <p className="opacity-90">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect your wallet to start earning'}
            </p>
            {globalStats && (
              <div className="mt-3 flex items-center space-x-4 text-sm opacity-75">
                <div className="flex items-center">
                  <FiUsers className="w-4 h-4 mr-1" />
                  <span>{globalStats.totalUsers} users</span>
                </div>
                <div className="flex items-center">
                  <FiDollarSign className="w-4 h-4 mr-1" />
                  <span>${parseFloat(globalStats.totalDeposits).toFixed(0)} total deposits</span>
                </div>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Total Portfolio</p>
            <p className="text-3xl font-bold">
              {isConnected 
                ? `$${dashboardStats?.totalPortfolio.toFixed(2) || '0.00'}`
                : '$0.00'
              }
            </p>
            {dashboardStats?.userNFTs && (
              <div className="flex items-center justify-end mt-2 text-sm opacity-75">
                <FiAward className="w-4 h-4 mr-1" />
                <span>{dashboardStats.userNFTs} NFT Rewards</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid with Real Contract Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  {stat.isLoading ? (
                    <div className="space-y-2">
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        {stat.value}
                      </p>
                      <div className={`flex items-center text-sm ${
                        stat.changeType === 'positive'
                          ? 'text-green-600'
                          : stat.changeType === 'negative'
                            ? 'text-red-600'
                            : 'text-gray-500'
                      }`}>
                        {stat.changeType === 'positive' && <FiArrowUpRight className="w-4 h-4 mr-1" />}
                        {stat.changeType === 'negative' && <FiArrowDownRight className="w-4 h-4 mr-1" />}
                        {stat.change}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                    </>
                  )}
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Portfolio Performance and Activity Section */}
      {isConnected && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PortfolioPerformance
            data={performanceData}
            totalValue={dashboardStats?.totalPortfolio || 0}
            totalRewards={dashboardStats?.totalRewards || 0}
            totalDeposits={dashboardStats?.totalDeposited || 0}
          />
          <RecentActivity activities={recentActivity} maxItems={8} />
        </div>
      )}

      {/* Connection CTA for non-connected users */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <FiZap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Connect Your Wallet to Get Started
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Connect your wallet to view your portfolio, track earnings, and access all Piggy Boss features with real-time data from our smart contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Connect Wallet
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-colors">
              View Demo
            </button>
          </div>
        </motion.div>
      )}

      {/* Platform Stats */}
      {globalStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{globalStats.totalUsers}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">${parseFloat(globalStats.totalDeposits).toFixed(0)}</p>
              <p className="text-sm text-gray-600">Total Value Locked</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiTrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">${parseFloat(globalStats.totalRewards).toFixed(0)}</p>
              <p className="text-sm text-gray-600">Total Rewards Paid</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Refresh Button for Development */}
      {process.env.NODE_ENV === 'development' && isConnected && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={refetchAll}
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Refresh Data"
        >
          <FiZap className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  )
}

export default ContractDashboard
