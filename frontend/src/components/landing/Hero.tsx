import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { ArrowRight, Brain, Zap, TrendingUp, Target, Sparkles, Bot } from 'lucide-react'
import WalletConnection from '@components/wallet/WalletConnectionRK'

export const Hero: React.FC = () => {
  const { isConnected } = useAccount()

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background with scattered icons and pink splashes */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
        {/* Pink splashes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-100 rounded-full blur-xl opacity-30"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-pink-200 rounded-full blur-2xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-100 rounded-full blur-xl opacity-25"></div>
        <div className="absolute top-10 right-10 w-28 h-28 bg-pink-150 rounded-full blur-xl opacity-35"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-purple-200 rounded-full blur-2xl opacity-25"></div>
        <div className="absolute top-2/3 right-1/4 w-20 h-20 bg-pink-200 rounded-full blur-lg opacity-40"></div>
        
        {/* Scattered Icons - More Visible */}
        <Brain className="absolute top-32 right-1/4 w-8 h-8 text-pink-400 opacity-70 animate-pulse" />
        <Zap className="absolute bottom-1/3 left-20 w-7 h-7 text-purple-400 opacity-80 animate-bounce" />
        <TrendingUp className="absolute top-1/4 left-1/3 w-9 h-9 text-pink-300 opacity-60" />
        <Target className="absolute bottom-20 right-1/3 w-8 h-8 text-purple-300 opacity-70 animate-pulse" />
        <Sparkles className="absolute top-40 left-1/2 w-7 h-7 text-pink-400 opacity-65 animate-bounce" />
        <Bot className="absolute bottom-1/4 left-1/2 w-8 h-8 text-purple-400 opacity-75" />
        <Brain className="absolute top-60 left-16 w-6 h-6 text-purple-300 opacity-60" />
        <Zap className="absolute top-1/3 right-16 w-7 h-7 text-pink-300 opacity-70 animate-pulse" />
        <TrendingUp className="absolute bottom-40 left-40 w-6 h-6 text-purple-400 opacity-65 animate-bounce" />
      </div>

      {/* Split Layout Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Piggy Boss Logo" 
                className="w-12 h-12"
              />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Save like a <span className="text-pink-600">Boss</span>
              <br />
              Earn like a <span className="text-purple-600">Champion</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 leading-relaxed">
              AI-powered DeFi platform that automatically optimizes your crypto savings for maximum yields on Somnia Network.
            </p>

            {/* Key Stats */}
            <div className="flex items-center space-x-8">
              <div>
                <div className="text-3xl font-bold text-green-600">35%</div>
                <div className="text-sm text-gray-500">Max APY</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-500">AI Monitoring</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">∞</div>
                <div className="text-sm text-gray-500">NFT Rewards</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isConnected ? (
                <Link
                  to="/dashboard"
                  className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-flex items-center group"
                >
                  Launch Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <WalletConnection />
              )}
              
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Right Side - Animated Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Animated AI Dashboard Preview */}
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4"
              animate={{ 
                y: [0, -10, 0],
                rotateY: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">AI Insights Dashboard</h3>
                <motion.div 
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              {/* Animated Chart */}
              <div className="h-32 bg-gradient-to-r from-green-100 to-purple-100 rounded-lg flex items-end justify-center space-x-2 p-4">
                {[40, 65, 55, 80, 70, 90, 85].map((height, i) => (
                  <motion.div
                    key={i}
                    className="bg-gradient-to-t from-pink-500 to-purple-600 rounded-sm"
                    style={{ width: '12px' }}
                    initial={{ height: '20%' }}
                    animate={{ height: `${height}%` }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
              
              {/* Animated Stats */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="bg-gray-50 rounded-lg p-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="text-2xl font-bold text-green-600"
                    animate={{ 
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    $12,450
                  </motion.div>
                  <div className="text-sm text-gray-500">Total Saved</div>
                </motion.div>
                <motion.div 
                  className="bg-gray-50 rounded-lg p-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="text-2xl font-bold text-purple-600"
                    animate={{ 
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    +28%
                  </motion.div>
                  <div className="text-sm text-gray-500">This Month</div>
                </motion.div>
              </div>

              {/* AI Activity Indicator */}
              <div className="flex items-center space-x-2 bg-blue-50 rounded-lg p-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Bot className="w-5 h-5 text-blue-600" />
                </motion.div>
                <div>
                  <div className="text-sm font-medium text-blue-800">AI Optimizing...</div>
                  <motion.div 
                    className="text-xs text-blue-600"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Finding best yield opportunities
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Floating Animated Elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-2xl">🎯</span>
            </motion.div>
            <motion.div 
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center"
              animate={{ 
                x: [0, 15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.span 
                className="text-xl"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚡
              </motion.span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Hero
