/**
 * Features Component - Landing Page Features Section
 * 
 * Modern AI-focused features section with pink/white theme
 * showcasing Piggy Boss platform capabilities and AI insights.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target,
  ArrowRight,
  Star,
  Lock,
  Smartphone,
  Award,
  BarChart3
} from 'lucide-react'

const Features: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Insights',
      description: 'Advanced machine learning algorithms analyze your portfolio and provide personalized optimization recommendations in real-time.',
      highlights: ['Smart Portfolio Analysis', 'Risk Assessment', 'Yield Predictions', 'Market Intelligence'],
      gradient: 'from-pink-500 to-purple-600',
      bgGradient: 'from-pink-50 to-purple-50'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Maximum Yield Optimization',
      description: 'Earn up to 35% APY through our intelligent yield farming strategies and automated compound interest systems.',
      highlights: ['18.5% Base APY', '25% High Yield Pools', '35% Premium Vaults', 'Auto-Compound'],
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Exclusive NFT Rewards',
      description: 'Unlock rare NFT collectibles as you reach savings milestones. Build your digital asset portfolio while earning yields.',
      highlights: ['Milestone NFTs', 'Rarity Collections', 'Achievement System', 'Trading Marketplace'],
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Fort Knox Security',
      description: 'Your investments are protected by multi-layered security protocols, audited smart contracts, and insurance coverage.',
      highlights: ['Audited Contracts', 'Multi-Signature Wallets', 'Insurance Fund', 'Emergency Protocols'],
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Performance',
      description: 'Built on Somnia Network for instantaneous transactions, minimal fees, and seamless user experience.',
      highlights: ['Instant Transactions', 'Near-Zero Fees', 'Real-time Updates', 'Optimal Performance'],
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-50'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Next-Gen Interface',
      description: 'Experience the future of DeFi with our intuitive, mobile-first design and advanced analytics dashboard.',
      highlights: ['Mobile Optimized', 'Intuitive Design', 'Advanced Analytics', 'Cross-Platform'],
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'from-indigo-50 to-purple-50'
    }
  ]

  return (
    <section className="relative py-24 px-4 bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="Piggy Boss Logo" 
              className="w-16 h-16 mr-4 animate-pulse"
            />
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              <Sparkles className="w-8 h-8 inline-block mr-2" />
            </div>
          </div>
          
          <motion.h2 
            className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-pink-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Why Choose <span className="relative">
              Piggy Boss
              <motion.div
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              />
            </span>?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            The most advanced AI-powered DeFi platform on Somnia Network. 
            Maximize your yields, minimize your risks, and unlock exclusive rewards 
            while our intelligent algorithms work for you 24/7.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} rounded-2xl transform transition-all duration-300 group-hover:scale-105 opacity-50`}></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-pink-100">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-pink-600 transition-colors">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Highlights */}
                <ul className="space-y-3">
                  {feature.highlights.map((highlight, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-center text-sm text-gray-700"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.1) + (i * 0.1) }}
                      viewport={{ once: true }}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} mr-3 flex-shrink-0`}></div>
                      <span className="font-medium">{highlight}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5 text-pink-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI-Powered Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative overflow-hidden"
        >
          <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-3xl p-1">
            <div className="bg-white rounded-3xl p-8 lg:p-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-4 mr-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full p-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Ready to Unlock AI-Powered Yields?
                </h3>
                
                <p className="text-xl mb-8 text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of smart investors already earning industry-leading returns with our 
                  AI-powered optimization engine. Start building your wealth today with just a few clicks.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <button className="group relative bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center">
                    <span>Launch App</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                  </button>
                  
                  <button className="group border-2 border-pink-500 text-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-pink-50 transition-all duration-300 flex items-center">
                    <Zap className="w-5 h-5 mr-2 group-hover:text-purple-600 transition-colors duration-300" />
                    <span className="group-hover:text-purple-600 transition-colors duration-300">Get Test Tokens</span>
                  </button>
                </div>
                
                <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Lock className="w-4 h-4" />
                  <span>Secured by audited smart contracts</span>
                  <span>•</span>
                  <span>No KYC required</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">
              Trusted by the DeFi Community
            </h4>
            <p className="text-gray-600">
              Real numbers from real users building wealth with Piggy Boss
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                value: '$10M+', 
                label: 'Total Value Locked', 
                icon: <BarChart3 className="w-6 h-6" />, 
                gradient: 'from-green-500 to-emerald-600' 
              },
              { 
                value: '50K+', 
                label: 'Active Investors', 
                icon: <Target className="w-6 h-6" />, 
                gradient: 'from-blue-500 to-cyan-600' 
              },
              { 
                value: '35%', 
                label: 'Maximum APY', 
                icon: <TrendingUp className="w-6 h-6" />, 
                gradient: 'from-purple-500 to-pink-600' 
              },
              { 
                value: '15K+', 
                label: 'NFTs Minted', 
                icon: <Award className="w-6 h-6" />, 
                gradient: 'from-orange-500 to-red-600' 
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="group text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.gradient} p-3 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features;