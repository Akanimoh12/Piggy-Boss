import React from 'react'
import { motion } from 'framer-motion'
import {
  FiTrendingUp,
  FiDollarSign,
  FiPieChart,
  FiZap,
  FiArrowUpRight,
  FiArrowDownRight
} from 'react-icons/fi'
import { useAccount } from 'wagmi'
import {
  useUSDTBalance,
  useTotalDeposited,
  useTotalRewards,
  useVaultStats
} from '../../hooks/useContract'

const ModernDashboard: React.FC = () => {
    const { address } = useAccount()
  const { balance: usdtBalance } = useUSDTBalance()
  const { totalDeposited } = useTotalDeposited()
  const { totalRewards } = useTotalRewards()
  const { totalDeposits: globalDeposits, totalRewards: globalRewards } = useVaultStats()

  
  const stats = [
        {
            title: 'Total Balance',
            value: `$${(parseFloat(usdtBalance) + parseFloat(totalDeposited)).toFixed(2)}`,
            change: '+12.5%',
            changeType: 'positive' as 'positive' | 'negative' | 'neutral',
            icon: FiDollarSign,
            color: 'bg-blue-500',
            isLoading: false,
        },
        {
            title: 'Active Deposits',
            value: `$${parseFloat(totalDeposited).toFixed(2)}`,
            change: '+$247.52',
            changeType: 'positive' as 'positive' | 'negative' | 'neutral',
            icon: FiPieChart,
            color: 'bg-green-500',
            isLoading: false,
        },
        {
            title: 'Total Rewards',
            value: `$${parseFloat(totalRewards).toFixed(2)}`,
            change: '+8.2%',
            changeType: 'positive' as 'positive' | 'negative' | 'neutral',
            icon: FiTrendingUp,
            color: 'bg-purple-500',
            isLoading: false,
        },
        {
            title: 'Available USDT',
            value: `$${parseFloat(usdtBalance).toFixed(2)}`,
            change: 'Ready to deposit',
            changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
            icon: FiZap,
            color: 'bg-orange-500',
            isLoading: false,
        },
    ]

    const activities = [
        {
            type: 'deposit',
            amount: 1000,
            date: '2 hours ago',
            status: 'completed',
        },
        {
            type: 'reward',
            amount: 25.50,
            date: '1 day ago',
            status: 'completed',
        },
        {
            type: 'withdraw',
            amount: 500,
            date: '3 days ago',
            status: 'completed',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
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
                            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect your wallet'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm opacity-75">Total Portfolio</p>
                        <p className="text-3xl font-bold">
                            ${(parseFloat(totalDeposited) + parseFloat(totalRewards)).toFixed(2)}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
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
                                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900 mb-2">
                                            {stat.value}
                                        </p>
                                    )}
                                    <div className={`flex items-center text-sm ${stat.changeType === 'positive'
                                            ? 'text-green-600'
                                            : stat.changeType === 'negative'
                                                ? 'text-red-600'
                                                : 'text-gray-500'
                                        }`}>
                                        {stat.changeType === 'positive' && <FiArrowUpRight className="w-4 h-4 mr-1" />}
                                        {stat.changeType === 'negative' && <FiArrowDownRight className="w-4 h-4 mr-1" />}
                                        {stat.change}
                                    </div>
                                </div>
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>


            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Portfolio Overview */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Portfolio Performance</h2>
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                                7D
                            </button>
                            <button className="px-3 py-1 text-sm bg-pink-500 text-white rounded-lg">
                                30D
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                                90D
                            </button>
                        </div>
                    </div>

                    {/* Portfolio Chart Placeholder */}
                    <div className="h-64 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <FiTrendingUp className="w-12 h-12 text-pink-500 mx-auto mb-3" />
                            <p className="text-gray-600">Portfolio chart will be displayed here</p>
                            <p className="text-sm text-gray-500">Showing APY growth over time</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Current APY</p>
                            <p className="text-xl font-bold text-pink-600">15.2%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Avg APY</p>
                            <p className="text-xl font-bold text-green-600">12.8%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Best APY</p>
                            <p className="text-xl font-bold text-purple-600">18.5%</p>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'deposit'
                                        ? 'bg-green-100 text-green-600'
                                        : activity.type === 'reward'
                                            ? 'bg-purple-100 text-purple-600'
                                            : 'bg-orange-100 text-orange-600'
                                    }`}>
                                    {activity.type === 'deposit' && <FiArrowDownRight className="w-5 h-5" />}
                                    {activity.type === 'reward' && <FiZap className="w-5 h-5" />}
                                    {activity.type === 'withdraw' && <FiArrowUpRight className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 capitalize">
                                        {activity.type}
                                    </p>
                                    <p className="text-sm text-gray-500">{activity.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${activity.type === 'withdraw' ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                        {activity.type === 'withdraw' ? '-' : '+'}${activity.amount}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 py-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors font-medium">
                        View All Activity
                    </button>
                </motion.div>
            </div>

            {/* Global Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Statistics</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">${parseFloat(globalDeposits).toFixed(0)}</p>
                        <p className="text-sm text-gray-600">Total Value Locked</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">${parseFloat(globalRewards).toFixed(0)}</p>
                        <p className="text-sm text-gray-600">Total Rewards Distributed</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">10,247</p>
                        <p className="text-sm text-gray-600">Active Users</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">15.2%</p>
                        <p className="text-sm text-gray-600">Current Best APY</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default ModernDashboard
