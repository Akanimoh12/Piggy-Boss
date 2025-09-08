import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { formatUnits } from 'viem'
import { CONTRACTS, APP_CONFIG } from '../../config/contracts'
import { showFaucetSuccessToast, showErrorToast, showTransactionPendingToast } from '../../utils/toast'

interface FaucetClaimProps {
  onSuccessfulClaim?: () => void
}

const DECIMALS = APP_CONFIG.decimals

const FaucetClaimWorking: React.FC<FaucetClaimProps> = ({ onSuccessfulClaim }) => {
  const { isConnected, address } = useAccount()
  
  // Contract reads
  const { data: balanceData, refetch: refetchBalance } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const { data: canClaimData, refetch: refetchCanClaim } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'canClaimFaucet',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const { data: timeUntilNextClaimData, refetch: refetchTimeUntilNextClaim } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'timeUntilNextClaim',
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const { data: faucetAmountData } = useContractRead({
    ...CONTRACTS.MockUSDT,
    functionName: 'FAUCET_AMOUNT',
    enabled: true,
  })

  // Contract write
  const { data: claimData, write: writeClaim, isLoading: isWriting } = useContractWrite({
    ...CONTRACTS.MockUSDT,
    functionName: 'claimFromFaucet',
  })

  const { isLoading: isConfirming } = useWaitForTransaction({
    hash: claimData?.hash,
    onSuccess: () => {
      showFaucetSuccessToast(parseFloat(faucetAmount))
      // Refresh data after successful claim
      setTimeout(() => {
        refetchBalance()
        refetchCanClaim()
        refetchTimeUntilNextClaim()
        onSuccessfulClaim?.()
      }, 1000)
    },
    onError: (error: any) => {
      console.error('Transaction failed:', error)
      showErrorToast('Transaction failed. Please try again.')
    }
  })

  // Parse contract data
  const balance = balanceData ? formatUnits(balanceData as bigint, DECIMALS) : '0'
  const canClaim = !!canClaimData
  const timeUntilNextClaim = timeUntilNextClaimData ? Number(timeUntilNextClaimData) : 0
  const faucetAmount = faucetAmountData ? formatUnits(faucetAmountData as bigint, DECIMALS) : '50'

  const [timeLeft, setTimeLeft] = useState(timeUntilNextClaim)
  const [isLoading, setIsLoading] = useState(false)

  // Update countdown timer
  useEffect(() => {
    setTimeLeft(timeUntilNextClaim)
  }, [timeUntilNextClaim])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev > 0 ? prev - 1 : 0
          if (newTime === 0) {
            refetchCanClaim()
            refetchTimeUntilNextClaim()
          }
          return newTime
        })
      }, 1000)
      return () => clearInterval(timer)
    }
    return undefined
  }, [timeLeft, refetchCanClaim, refetchTimeUntilNextClaim])

  // Track loading state
  useEffect(() => {
    setIsLoading(isWriting || isConfirming)
  }, [isWriting, isConfirming])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleClaim = async () => {
    if (!isConnected || !address) {
      showErrorToast('Please connect your wallet first')
      return
    }

    if (!canClaim) {
      showErrorToast('You cannot claim yet. Please wait for the cooldown period to end.')
      return
    }

    if (!writeClaim) {
      showErrorToast('Contract write function not available')
      return
    }

    try {
      showTransactionPendingToast('Submitting claim transaction...')
      writeClaim()
    } catch (error: any) {
      console.error('Claim failed:', error)
      showErrorToast(error?.message || 'Failed to claim tokens. Please try again.')
    }
  }

  const progressPercentage = timeLeft > 0 ? ((86400 - timeLeft) / 86400) * 100 : 100

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
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-pink-100"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {canClaim ? (
              <div className="text-green-500">
                <span className="text-lg">✓</span>
              </div>
            ) : (
              <div className="text-xs font-medium text-gray-600">
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-br from-pink-50 to-blue-50 border border-pink-200 rounded-xl p-6 text-center shadow-lg">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect Wallet to Access Faucet</h3>
          <p className="text-gray-600">Connect your wallet to claim free USDT tokens for testing.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 to-blue-50 border border-pink-200 rounded-xl p-6 shadow-lg">
      {/* Current Balance */}
      <div className="mb-6 p-4 bg-white/50 rounded-lg border border-pink-100">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Your USDT Balance</span>
          <span className="text-xl font-bold text-gray-800">{parseFloat(balance).toFixed(2)} USDT</span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <ProgressCircle percentage={progressPercentage} size={120} />
      </div>

      <div className="text-center mb-6">
        <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-1">
          {faucetAmount} USDT
        </div>
        <div className="text-gray-600 text-sm">
          {canClaim ? 'Ready to claim' : `Next claim in ${formatTime(timeLeft)}`}
        </div>
      </div>

      <motion.button
        onClick={handleClaim}
        disabled={!canClaim || isLoading}
        whileHover={canClaim && !isLoading ? { scale: 1.02 } : {}}
        whileTap={canClaim && !isLoading ? { scale: 0.98 } : {}}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200
          ${canClaim && !isLoading
            ? 'bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="claiming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center space-x-3"
            >
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>
                {isWriting ? 'Submitting...' : isConfirming ? 'Confirming...' : 'Processing...'}
              </span>
            </motion.div>
          ) : canClaim ? (
            <motion.span
              key="claim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Claim {faucetAmount} MockUSDT
            </motion.span>
          ) : (
            <motion.span
              key="wait"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Wait {formatTime(timeLeft)}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="mt-4 p-3 bg-white/30 rounded-lg border border-pink-100">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Faucet Rules:</p>
            <ul className="space-y-1 text-xs">
              <li>• Claim {faucetAmount} USDT every 24 hours</li>
              <li>• One claim per wallet address</li>
              <li>• Tokens are for testing purposes</li>
            </ul>
          </div>
        </div>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <p>Debug Info:</p>
          <p>Can Claim: {canClaim ? 'Yes' : 'No'}</p>
          <p>Time Left: {timeLeft}s</p>
          <p>Is Writing: {isWriting ? 'Yes' : 'No'}</p>
          <p>Is Confirming: {isConfirming ? 'Yes' : 'No'}</p>
          <p>Address: {address}</p>
        </div>
      )}
    </div>
  )
}

export default FaucetClaimWorking
