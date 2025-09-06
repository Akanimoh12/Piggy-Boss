/**
 * FaucetPage - Dedicated page for MockUSDT faucet
 * 
 * Provides a full-page experience for claiming test tokens
 */

import React from 'react'
import { motion } from 'framer-motion'
import Faucet from '@components/common/Faucet'

const FaucetPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl">💧</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold gradient-text mb-2"
            >
              Token Faucet
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-secondary-600"
            >
              Get test MockUSDT tokens for the Piggy Boss platform
            </motion.p>
          </div>

          {/* Faucet Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Faucet showTitle={false} />
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 space-y-4"
          >
            <div className="bg-white rounded-xl p-4 shadow-sm border border-surface-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-accent text-sm">ℹ️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900 text-sm mb-1">
                    How it works
                  </h4>
                  <p className="text-secondary-600 text-xs">
                    Connect your wallet and claim 50 MockUSDT every 24 hours. These tokens are for testing the savings platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-surface-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-sm">🔒</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900 text-sm mb-1">
                    Rate Limiting
                  </h4>
                  <p className="text-secondary-600 text-xs">
                    Each wallet can claim tokens once every 24 hours. The countdown is stored locally and persists across sessions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-surface-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-success-600 text-sm">🚀</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900 text-sm mb-1">
                    Ready to save?
                  </h4>
                  <p className="text-secondary-600 text-xs">
                    Once you have tokens, visit the Dashboard to start creating savings plans and earning yield!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-8"
          >
            <p className="text-secondary-400 text-xs">
              Need help? Check the documentation or contact support
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default FaucetPage
