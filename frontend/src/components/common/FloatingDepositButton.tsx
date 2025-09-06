import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { Plus, X } from 'lucide-react'
import DepositModal from '../dashboard/DepositModal'

const FloatingDepositButton: React.FC = () => {
  const { isConnected } = useAccount()
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  if (!isConnected) return null

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="mb-4 flex flex-col space-y-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsDepositModalOpen(true)
                  setIsExpanded(false)
                }}
                className="bg-white shadow-lg rounded-full p-4 flex items-center space-x-3 border border-surface-200 hover:border-accent transition-colors min-w-max"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-white">💰</span>
                </div>
                <span className="font-medium text-primary-900 pr-2">Create Savings Plan</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white shadow-lg rounded-full p-4 flex items-center space-x-3 border border-surface-200 hover:border-accent transition-colors min-w-max"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white">📤</span>
                </div>
                <span className="font-medium text-primary-900 pr-2">Withdraw Funds</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white shadow-lg rounded-full p-4 flex items-center space-x-3 border border-surface-200 hover:border-accent transition-colors min-w-max"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white">🎨</span>
                </div>
                <span className="font-medium text-primary-900 pr-2">View NFT Gallery</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </motion.div>
        </motion.button>
      </div>

      <DepositModal 
        isOpen={isDepositModalOpen} 
        onClose={() => setIsDepositModalOpen(false)} 
      />
    </>
  )
}

export default FloatingDepositButton
