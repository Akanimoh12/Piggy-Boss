import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Shield, Zap, Gift } from 'lucide-react'
import DepositModal from '../dashboard/DepositModal'

const DepositPage: React.FC = () => {
  const { isConnected } = useAccount()
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-secondary-600">
            Please connect your wallet to create savings plans
          </p>
        </div>
      </div>
    )
  }

  const savingsPlans = [
    { 
      days: 7, 
      apy: 8.5, 
      minAmount: 10, 
      maxAmount: 10000,
      risk: 'Low',
      color: 'blue',
      description: 'Perfect for short-term goals'
    },
    { 
      days: 14, 
      apy: 10.2, 
      minAmount: 50, 
      maxAmount: 25000,
      risk: 'Low',
      color: 'green',
      description: 'Balanced growth with flexibility',
      popular: true
    },
    { 
      days: 30, 
      apy: 12.5, 
      minAmount: 100, 
      maxAmount: 50000,
      risk: 'Medium',
      color: 'purple',
      description: 'Higher returns for patient savers'
    },
    { 
      days: 90, 
      apy: 15.0, 
      minAmount: 500, 
      maxAmount: 100000,
      risk: 'High',
      color: 'orange',
      description: 'Maximum yield for long-term commitment'
    }
  ]

  const features = [
    {
      icon: TrendingUp,
      title: 'High Yield Returns',
      description: 'Earn up to 15% APY on your USDT deposits'
    },
    {
      icon: Shield,
      title: 'Secure & Audited',
      description: 'Smart contracts audited by leading security firms'
    },
    {
      icon: Zap,
      title: 'Instant Deposits',
      description: 'Your funds start earning immediately'
    },
    {
      icon: Gift,
      title: 'NFT Rewards',
      description: 'Earn exclusive NFTs based on your savings milestones'
    }
  ]

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-secondary-600 hover:text-primary-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              Create Your Savings Plan 🐷
            </h1>
            <p className="text-lg text-secondary-600 max-w-2xl">
              Choose from our flexible savings plans and start earning high yields on your USDT. 
              The longer you save, the higher your returns!
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-soft border border-surface-200"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-secondary-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Savings Plans */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {savingsPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDepositModalOpen(true)}
                  className="relative bg-white rounded-2xl p-6 shadow-soft border border-surface-200 hover:border-accent transition-all duration-200 cursor-pointer group"
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-4xl mb-4">💰</div>
                    <h3 className="text-xl font-bold mb-2">{plan.days} Days</h3>
                    <div className="text-3xl font-bold text-accent mb-2">{plan.apy}%</div>
                    <div className="text-sm text-secondary-600 mb-4">APY</div>
                    
                    <div className="space-y-2 text-sm text-secondary-600 mb-4">
                      <div>Min: ${plan.minAmount}</div>
                      <div>Max: ${plan.maxAmount.toLocaleString()}</div>
                      <div className={`inline-block px-2 py-1 rounded-full bg-${plan.color}-100 text-${plan.color}-800`}>
                        {plan.risk} Risk
                      </div>
                    </div>
                    
                    <p className="text-xs text-secondary-500 mb-4">{plan.description}</p>
                    
                    <button className="w-full btn btn-outline group-hover:btn-primary transition-all duration-200">
                      Select Plan
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Start Earning?</h3>
            <p className="text-lg opacity-90 mb-6">
              Join thousands of users already earning high yields with Piggy Boss
            </p>
            <button 
              onClick={() => setIsDepositModalOpen(true)}
              className="btn bg-white text-primary hover:bg-surface-50 font-semibold px-8 py-3"
            >
              Create Your First Savings Plan
            </button>
          </motion.div>

          {/* Deposit Modal */}
          <DepositModal 
            isOpen={isDepositModalOpen} 
            onClose={() => setIsDepositModalOpen(false)} 
          />
        </motion.div>
      </div>
    </div>
  )
}

export default DepositPage
