/**
 * Toast Demo Component
 * 
 * A demonstration component showing all available toast types
 * and their functionality. This can be used for testing and
 * showcasing the custom toast system.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { 
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
  showLoadingToast,
  showDepositSuccessToast,
  showFaucetSuccessToast,
  showTransactionPendingToast,
  showTransactionSuccessToast,
  showTransactionErrorToast,
  updateToast
} from '@utils/toast'
import type { Id } from 'react-toastify'

const ToastDemo: React.FC = () => {
  const [pendingToastId, setPendingToastId] = React.useState<Id | null>(null)

  const handleBasicToasts = () => {
    showSuccessToast('This is a success message!')
    setTimeout(() => showInfoToast('This is an info message!'), 500)
    setTimeout(() => showWarningToast('This is a warning message!'), 1000)
    setTimeout(() => showErrorToast('This is an error message!'), 1500)
  }

  const handleSpecialToasts = () => {
    showDepositSuccessToast(100, 30)
    setTimeout(() => showFaucetSuccessToast(50), 1000)
  }

  const handleTransactionFlow = () => {
    // Start with pending
    const id = showTransactionPendingToast('Processing transaction...')
    setPendingToastId(id)
    
    // Simulate transaction completion after 3 seconds
    setTimeout(() => {
      showTransactionSuccessToast('Transaction completed successfully!')
      setPendingToastId(null)
    }, 3000)
  }

  const handleTransactionError = () => {
    showTransactionPendingToast('Processing transaction...')
    
    // Simulate transaction error after 2 seconds
    setTimeout(() => {
      showTransactionErrorToast('Transaction failed. Please try again.', undefined, () => {
        showInfoToast('Retry function called!')
      })
    }, 2000)
  }

  const handleLoadingToast = () => {
    const id = showLoadingToast('Loading data...')
    
    // Update to success after 3 seconds
    setTimeout(() => {
      updateToast(id, 'success', 'Data loaded successfully!')
    }, 3000)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-bold gradient-text mb-6 text-center">
          🍞 Toast Demo
        </h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Basic Toasts</h3>
            <p className="text-secondary-600 text-sm">
              Success, info, warning, and error messages
            </p>
            <button
              onClick={handleBasicToasts}
              className="btn btn-primary w-full"
            >
              Show Basic Toasts
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Special Toasts</h3>
            <p className="text-secondary-600 text-sm">
              Piggy Boss specific success messages
            </p>
            <button
              onClick={handleSpecialToasts}
              className="btn btn-accent w-full"
            >
              Show Special Toasts
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Transaction Flow</h3>
            <p className="text-secondary-600 text-sm">
              Pending → Success transaction flow
            </p>
            <button
              onClick={handleTransactionFlow}
              className="btn btn-secondary w-full"
              disabled={!!pendingToastId}
            >
              {pendingToastId ? 'Transaction Pending...' : 'Start Transaction'}
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Transaction Error with Retry</h3>
            <p className="text-secondary-600 text-sm">
              Pending → Error with retry functionality
            </p>
            <button
              onClick={handleTransactionError}
              className="btn btn-outline w-full"
            >
              Simulate Transaction Error
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Loading with Update</h3>
            <p className="text-secondary-600 text-sm">
              Loading toast that updates to success
            </p>
            <button
              onClick={handleLoadingToast}
              className="btn btn-ghost w-full"
            >
              Show Loading Toast
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-accent/10 rounded-lg">
          <h4 className="font-semibold text-accent mb-2">Features:</h4>
          <ul className="text-sm space-y-1 text-secondary-600">
            <li>• Custom Piggy Boss branding and colors</li>
            <li>• Glassmorphism styling matching the app</li>
            <li>• Interactive retry functionality</li>
            <li>• Transaction flow management</li>
            <li>• Loading state transitions</li>
            <li>• Auto-dismiss with custom timing</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

export default ToastDemo
