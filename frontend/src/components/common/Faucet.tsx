/**
 * Faucet Component - MockUSDT Token Faucet with Contract Integration
 * 
 * Features:
 * - Real contract integration with MockUSDT
 * - 24-hour countdown between claims
 * - Live balance updates
 * - Transaction states with loading
 * - Pink/Blue gradient theme
 * - Real-time faucet statistics
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useMockUSDT } from '../../hooks/useContracts';

interface FaucetProps {
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
  onSuccessfulClaim?: () => void;
}

const CLAIM_AMOUNT = 50; // 50 MockUSDT

const Faucet: React.FC<FaucetProps> = ({ 
  className = '', 
  showTitle = true, 
  compact = false,
  onSuccessfulClaim
}) => {
  const { address, isConnected } = useAccount();
  const { 
    usdtBalance, 
    canClaimFaucet, 
    timeUntilNextClaim, 
    userStats, 
    faucetStats,
    claimFaucet, 
    isClaimingFaucet 
  } = useMockUSDT();

  const [timeLeft, setTimeLeft] = useState(timeUntilNextClaim);

  useEffect(() => {
    setTimeLeft(timeUntilNextClaim);
  }, [timeUntilNextClaim]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClaim = async () => {
    try {
      await claimFaucet();
      onSuccessfulClaim?.();
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  const progressPercentage = timeLeft > 0 ? ((86400 - timeLeft) / 86400) * 100 : 100;

  // Progress circle component with pink/blue theme
  const ProgressCircle: React.FC<{ percentage: number; size: number }> = ({ percentage, size }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
            className="text-pink-100"
          />
          {/* Progress circle */}
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
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {canClaimFaucet ? (
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
    );
  };

  if (!isConnected) {
    return (
      <div className={`bg-gradient-to-br from-pink-50 to-blue-50 border border-pink-200 rounded-xl p-6 text-center ${className}`}>
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
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <ProgressCircle percentage={progressPercentage} size={40} />
        <div className="flex-1">
          <motion.button
            onClick={handleClaim}
            disabled={!canClaimFaucet || isClaimingFaucet}
            whileHover={canClaimFaucet ? { scale: 1.02 } : {}}
            whileTap={canClaimFaucet ? { scale: 0.98 } : {}}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${canClaimFaucet && !isClaimingFaucet
                ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:from-pink-600 hover:to-blue-600 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isClaimingFaucet ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Claiming...</span>
              </div>
            ) : canClaimFaucet ? (
              `Claim ${CLAIM_AMOUNT} USDT`
            ) : (
              'Claimed'
            )}
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-pink-50 to-blue-50 border border-pink-200 rounded-xl p-6 shadow-lg ${className}`}>
      <AnimatePresence>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                  MockUSDT Faucet
                </h3>
                <p className="text-gray-600">Claim 50 USDT every 24 hours</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Balance */}
      <div className="mb-6 p-4 bg-white/50 rounded-lg border border-pink-100">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Your USDT Balance</span>
          <span className="text-xl font-bold text-gray-800">{parseFloat(usdtBalance).toFixed(2)} USDT</span>
        </div>
      </div>

      {/* User Stats */}
      {userStats && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/50 rounded-lg border border-pink-100 text-center">
            <div className="text-sm text-gray-600">Total Received</div>
            <div className="text-lg font-bold text-pink-600">{parseFloat(userStats.totalReceived).toFixed(0)} USDT</div>
          </div>
          <div className="p-3 bg-white/50 rounded-lg border border-pink-100 text-center">
            <div className="text-sm text-gray-600">Claims Made</div>
            <div className="text-lg font-bold text-blue-600">{userStats.claimCount}</div>
          </div>
        </div>
      )}

      {/* Faucet Stats */}
      {faucetStats && (
        <div className="mb-6 p-4 bg-white/50 rounded-lg border border-pink-100">
          <h4 className="font-semibold text-gray-800 mb-3">Faucet Statistics</h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-gray-600">Total Distributed</div>
              <div className="text-sm font-bold text-pink-600">{parseFloat(faucetStats.totalDistributed).toFixed(0)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Remaining Supply</div>
              <div className="text-sm font-bold text-blue-600">{parseFloat(faucetStats.remainingSupply).toFixed(0)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Unique Users</div>
              <div className="text-sm font-bold text-purple-600">{faucetStats.uniqueUsers}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center mb-6">
        <ProgressCircle percentage={progressPercentage} size={120} />
      </div>

      <div className="text-center mb-6">
        <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-1">
          {CLAIM_AMOUNT} USDT
        </div>
        <div className="text-gray-600 text-sm">
          {canClaimFaucet ? 'Ready to claim' : `Next claim in ${formatTime(timeLeft)}`}
        </div>
      </div>

      <motion.button
        onClick={handleClaim}
        disabled={!canClaimFaucet || isClaimingFaucet}
        whileHover={canClaimFaucet ? { scale: 1.02 } : {}}
        whileTap={canClaimFaucet ? { scale: 0.98 } : {}}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200
          ${canClaimFaucet && !isClaimingFaucet
            ? 'bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
          ) : canClaimFaucet ? (
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
              <li>• Claim 50 USDT every 24 hours</li>
              <li>• One claim per wallet address</li>
              <li>• Tokens are for testing purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faucet;
export { Faucet };
