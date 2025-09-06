/**
 * Savings Page Component - Manage Savings Plans
 * 
 * This component allows users to create and manage their savings plans,
 * view current plans, and track their progress towards goals.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import DepositModal from '../dashboard/DepositModal'

const SavingsPage: React.FC = () => {
  const { isConnected } = useAccount()
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-secondary-600">
            Please connect your wallet to access savings features
          </p>
        </div>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold mb-2">Savings Plans</h1>
            <p className="text-secondary-600">
              Create and manage your DeFi savings plans
            </p>
          </div>

          {/* Savings Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { duration: '7 days', apy: '5%', risk: 'Low', color: 'blue' },
              { duration: '14 days', apy: '8%', risk: 'Low', color: 'green' },
              { duration: '30 days', apy: '12%', risk: 'Medium', color: 'purple' },
              { duration: '90 days', apy: '18%', risk: 'High', color: 'orange' },
            ].map((plan, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDepositModalOpen(true)}
                className="card card-hover p-6 cursor-pointer"
              >
                <div className="text-center">
                  <div className={`text-4xl mb-3 text-${plan.color}-500`}>💰</div>
                  <h3 className="text-lg font-semibold mb-2">{plan.duration}</h3>
                  <div className="text-2xl font-bold text-accent mb-2">{plan.apy}</div>
                  <div className="text-sm text-secondary-600 mb-4">APY</div>
                  <div className={`inline-block px-3 py-1 text-xs rounded-full bg-${plan.color}-100 text-${plan.color}-800`}>
                    {plan.risk} Risk
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Active Plans */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Your Active Plans</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🐷</div>
              <p className="text-secondary-600 mb-4">
                No active savings plans yet
              </p>
              <button 
                onClick={() => setIsDepositModalOpen(true)}
                className="btn btn-primary"
              >
                Create Your First Plan
              </button>
            </div>
          </div>

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

export default SavingsPage
