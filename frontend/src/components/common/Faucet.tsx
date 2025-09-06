/**
 * Faucet Component - MockUSDT Token Faucet
 * 
 * Features:
 * - 24-hour countdown between claims
 * - Progress circle visualization
 * - Transaction pending states
 * - Success notifications
 * - LocalStorage persistence
 * - Smart contract integration
 */

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { showFaucetSuccessToast, showErrorToast, showLoadingToast, updateToast, dismissToast } from '@utils/toast'
import { useMockUSDT } from '@hooks/useContracts'
import type { Id } from 'react-toastify'

interface FaucetProps {
  className?: string
  showTitle?: boolean
  compact?: boolean
}

interface ClaimData {
  lastClaimTime: number
  nextClaimTime: number
  walletAddress: string
}

const CLAIM_COOLDOWN = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const CLAIM_AMOUNT = 50 // 50 MockUSDT

const Faucet: React.FC<FaucetProps> = ({ 
  className = '', 
  showTitle = true, 
  compact = false 
}) => {
  const { address, isConnected } = useAccount()
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<number>(0)
  const [canClaim, setCanClaim] = useState<boolean>(true)
  const [lastClaimTime, setLastClaimTime] = useState<number | null>(null)
  
  // Contract hooks
  const { claimFaucet, isClaimingFaucet, usdtBalance } = useMockUSDT()

  // Generate storage key based on wallet address
  const getStorageKey = useCallback((walletAddress: string) => {
    return `piggy_boss_faucet_${walletAddress.toLowerCase()}`
  }, [])

  // Load claim data from localStorage
  const loadClaimData = useCallback(() => {
    if (!address) return null

    const storageKey = getStorageKey(address)
    const stored = localStorage.getItem(storageKey)
    
    if (stored) {
      try {
        return JSON.parse(stored) as ClaimData
      } catch (error) {
        console.error('Error parsing faucet data:', error)
        localStorage.removeItem(storageKey)
      }
    }
    return null
  }, [address, getStorageKey])

  // Save claim data to localStorage
  const saveClaimData = useCallback((claimTime: number) => {
    if (!address) return

    const storageKey = getStorageKey(address)
    const claimData: ClaimData = {
      lastClaimTime: claimTime,
      nextClaimTime: claimTime + CLAIM_COOLDOWN,
      walletAddress: address.toLowerCase()
    }

    localStorage.setItem(storageKey, JSON.stringify(claimData))
    setLastClaimTime(claimTime)
  }, [address, getStorageKey])

  // Calculate time until next claim
  const updateClaimStatus = useCallback(() => {
    const claimData = loadClaimData()
    const now = Date.now()

    if (!claimData) {
      setCanClaim(true)
      setTimeUntilNextClaim(0)
      setLastClaimTime(null)
      return
    }

    const timeRemaining = claimData.nextClaimTime - now
    
    if (timeRemaining <= 0) {
      setCanClaim(true)
      setTimeUntilNextClaim(0)
    } else {
      setCanClaim(false)
      setTimeUntilNextClaim(timeRemaining)
    }

    setLastClaimTime(claimData.lastClaimTime)
  }, [loadClaimData])

  // Initialize and update countdown
  useEffect(() => {
    if (!isConnected || !address) {
      setCanClaim(false)
      setTimeUntilNextClaim(0)
      setLastClaimTime(null)
      return
    }

    updateClaimStatus()

    const interval = setInterval(() => {
      updateClaimStatus()
    }, 1000)

    return () => clearInterval(interval)
  }, [isConnected, address, updateClaimStatus])

  // Handle faucet claim
  const handleClaim = async () => {
    if (!address || !canClaim || isClaimingFaucet) return
    
    // Show loading toast
    const loadingToastId: Id = showLoadingToast('Claiming MockUSDT tokens...')

    try {
      // Call the actual faucet contract
      const tx = await claimFaucet()
      
      const claimTime = Date.now()
      saveClaimData(claimTime)
      
      // Update loading toast to success
      updateToast(loadingToastId, 'success', `${CLAIM_AMOUNT} MockUSDT claimed successfully! 💰`)
      
      updateClaimStatus()
    } catch (error: any) {
      console.error('Faucet claim error:', error)
      
      // Update loading toast to error
      updateToast(loadingToastId, 'error', error.message || 'Failed to claim tokens.')
      
      // Show retry toast after a delay
      setTimeout(() => {
        const retryHandler = () => handleClaim()
        showErrorToast('Claim failed. Please try again.', retryHandler)
      }, 500)
    }
  }

  // Format time remaining
  const formatTimeRemaining = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (canClaim) return 100
    if (timeUntilNextClaim <= 0) return 100
    
    const elapsed = CLAIM_COOLDOWN - timeUntilNextClaim
    return (elapsed / CLAIM_COOLDOWN) * 100
  }

  // Progress circle component
  const ProgressCircle: React.FC<{ percentage: number; size: number }> = ({ percentage, size }) => {
    const radius = (size - 8) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-surface-200"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ${
              canClaim ? 'text-success-500' : 'text-accent'
            }`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {canClaim ? (
              <div className="text-success-500">
                <span className="text-lg">✓</span>
              </div>
            ) : (
              <div className="text-xs font-medium text-secondary-600">
                {formatTimeRemaining(timeUntilNextClaim)}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-secondary-600">Connect your wallet to claim test tokens</p>
      </div>
    )
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <ProgressCircle percentage={getProgressPercentage()} size={40} />
        <div className="flex-1">
          <motion.button
            onClick={handleClaim}
            disabled={!canClaim || isClaimingFaucet}
            whileHover={canClaim ? { scale: 1.02 } : {}}
            whileTap={canClaim ? { scale: 0.98 } : {}}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${canClaim && !isClaimingFaucet
                ? 'bg-accent text-white hover:bg-accent/90 shadow-md'
                : 'bg-surface-100 text-secondary-400 cursor-not-allowed'
              }
            `}
          >
            {isClaimingFaucet ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Claiming...</span>
              </div>
            ) : canClaim ? (
              `Claim ${CLAIM_AMOUNT} USDT`
            ) : (
              'Claimed'
            )}
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-surface-200 ${className}`}>
      <AnimatePresence>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h3 className="text-xl font-bold text-secondary-900 mb-2">
              MockUSDT Faucet
            </h3>
            <p className="text-secondary-600 text-sm">
              Claim test tokens every 24 hours for testing
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center mb-6">
        <ProgressCircle percentage={getProgressPercentage()} size={120} />
      </div>

      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-secondary-900 mb-1">
          {CLAIM_AMOUNT} USDT
        </div>
        <div className="text-secondary-600 text-sm">
          {canClaim ? 'Ready to claim' : `Next claim in ${formatTimeRemaining(timeUntilNextClaim)}`}
        </div>
      </div>

      {lastClaimTime && (
        <div className="text-center mb-6 p-3 bg-surface-50 rounded-lg">
          <p className="text-xs text-secondary-500">
            Last claimed: {new Date(lastClaimTime).toLocaleString()}
          </p>
        </div>
      )}

      <motion.button
        onClick={handleClaim}
        disabled={!canClaim || isClaimingFaucet}
        whileHover={canClaim ? { scale: 1.02 } : {}}
        whileTap={canClaim ? { scale: 0.98 } : {}}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200
          ${canClaim && !isClaimingFaucet
            ? 'bg-gradient-to-r from-accent to-primary text-white hover:shadow-lg'
            : 'bg-surface-100 text-secondary-400 cursor-not-allowed'
          }
        `}
      >
        <AnimatePresence mode="wait">
          {isClaimingFaucet ? (
            <motion.div
              key="claiming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center space-x-3"
            >
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Claiming Tokens...</span>
            </motion.div>
          ) : canClaim ? (
            <motion.span
              key="claim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Claim {CLAIM_AMOUNT} MockUSDT
            </motion.span>
          ) : (
            <motion.span
              key="wait"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Wait {formatTimeRemaining(timeUntilNextClaim)}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="mt-4 text-center">
        <p className="text-xs text-secondary-500">
          For testing purposes only • One claim per wallet per 24 hours
        </p>
      </div>
    </div>
  )
}

export default Faucet
