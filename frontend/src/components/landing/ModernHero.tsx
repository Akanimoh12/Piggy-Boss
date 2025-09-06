import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  FiArrowRight, 
  FiShield, 
  FiZap, 
  FiTrendingUp,
  FiStar,
  FiUsers
} from 'react-icons/fi'
import WalletConnection from '@components/wallet/WalletConnectionRK'

const ModernHero: React.FC = () => {
  const { isConnected } = useAccount()

  const stats = [
    { icon: FiTrendingUp, label: 'Max APY', value: '15%', color: 'text-green-600' },
    { icon: FiUsers, label: 'Active Users', value: '10K+', color: 'text-blue-600' },
    { icon: FiShield, label: 'Total Secured', value: '$2M+', color: 'text-purple-600' },
    { icon: FiZap, label: 'Avg Transaction', value: '<1s', color: 'text-orange-600' },
  ]

  const features = [
    {
      icon: FiShield,
      title: 'Secure & Audited',
      description: 'Smart contracts audited by top security firms'
    },
    {
      icon: FiZap,
      title: 'Lightning Fast',
      description: 'Built on Somnia Network for instant transactions'
    },
    {
      icon: FiTrendingUp,
      title: 'High Yields',
      description: 'Earn up to 15% APY on your savings'
    }
  ]

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-pink-50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-50 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium"
            >
              <FiStar className="w-4 h-4" />
              <span>DeFi Savings Platform</span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                Save Smart,{' '}
                <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Earn More
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Unlock high-yield savings with our secure DeFi platform. 
                Earn up to <span className="font-bold text-green-600">15% APY</span> and 
                collect NFT rewards on Somnia Network.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {isConnected ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                  <FiArrowRight className="ml-2 w-5 h-5" />
                </Link>
              ) : (
                <div className="inline-block">
                  <WalletConnection />
                </div>
              )}

              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                Watch Demo
                <FiArrowRight className="ml-2 w-5 h-5" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className={`flex justify-center mb-2 ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Savings Overview</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                {/* Balance */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Total Balance</p>
                  <p className="text-3xl font-bold text-gray-900">$12,847.52</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <FiTrendingUp className="w-4 h-4 mr-1" />
                    +$247.52 this month
                  </p>
                </div>

                {/* APY Display */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Current APY</p>
                      <p className="text-2xl font-bold text-pink-600">15.2%</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FiTrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-pink-500 text-white rounded-xl py-3 font-medium hover:bg-pink-600 transition-colors">
                    Deposit
                  </button>
                  <button className="border border-gray-300 text-gray-700 rounded-xl py-3 font-medium hover:bg-gray-50 transition-colors">
                    Withdraw
                  </button>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-400 rounded-full"></div>
            </div>

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiShield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Security</p>
                  <p className="text-sm font-semibold text-gray-900">100% Secured</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiZap className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Network</p>
                  <p className="text-sm font-semibold text-gray-900">Somnia</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-20 pt-16 border-t border-gray-200"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Piggy Boss?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of DeFi savings with our cutting-edge platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                  className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ModernHero
