/**
 * Features Component - Landing Page Features Section
 * 
 * Displays the main features and benefits of Piggy Boss platform
 * including savings plans, NFT rewards, security, and AI insights.
 */

import React from 'react'
import { motion } from 'framer-motion'

const Features: React.FC = () => {
  const features = [
    {
      icon: '💰',
      title: 'High-Yield Savings',
      description: 'Earn up to 18% APY with our time-locked savings plans. Choose from 7, 14, 30, or 90-day options.',
      highlights: ['5% APY (7 days)', '8% APY (14 days)', '12% APY (30 days)', '18% APY (90 days)']
    },
    {
      icon: '🎨',
      title: 'NFT Rewards',
      description: 'Collect unique NFTs for reaching savings milestones. Build your collection while you save.',
      highlights: ['Milestone NFTs', 'Rarity Tiers', 'Achievement System', 'Collectible Gallery']
    },
    {
      icon: '🤖',
      title: 'AI Optimization',
      description: 'Get personalized yield optimization suggestions powered by advanced AI algorithms.',
      highlights: ['Smart Insights', 'Yield Forecasts', 'Risk Analysis', 'Portfolio Tips']
    },
    {
      icon: '🔒',
      title: 'Bank-Grade Security',
      description: 'Your funds are protected by audited smart contracts and industry-leading security practices.',
      highlights: ['Audited Contracts', 'Multi-sig Wallets', 'Insurance Fund', 'Emergency Pause']
    },
    {
      icon: '🚀',
      title: 'Lightning Fast',
      description: 'Built on Somnia Network for instant transactions and minimal fees.',
      highlights: ['Instant Deposits', 'Low Gas Fees', 'Fast Withdrawals', 'Real-time Updates']
    },
    {
      icon: '📱',
      title: 'Mobile Optimized',
      description: 'Access your savings anywhere with our fully responsive web application.',
      highlights: ['Mobile-First Design', 'Touch Optimized', 'Offline Support', 'Push Notifications']
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Why Choose <span className="gradient-text">Piggy Boss</span>?
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            The most advanced DeFi savings platform on Somnia Network. 
            Earn more, save smarter, and collect rewards while you grow your wealth.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card hover:shadow-xl transition-all duration-300 group"
            >
              <div className="p-8">
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-secondary-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Highlights */}
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center text-sm text-secondary-500">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary to-primary-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Earning?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users already earning high yields on their crypto savings. 
              Get started in less than 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-white btn-lg">
                <span>Connect Wallet</span>
                <span className="ml-2">👛</span>
              </button>
              <button className="btn btn-outline-white btn-lg">
                <span className="mr-2">💧</span>
                Get Test Tokens
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-primary mb-2">$10M+</div>
            <div className="text-secondary-600">Total Value Locked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">50K+</div>
            <div className="text-secondary-600">Active Savers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-success mb-2">18%</div>
            <div className="text-secondary-600">Max APY</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
            <div className="text-secondary-600">NFTs Minted</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
