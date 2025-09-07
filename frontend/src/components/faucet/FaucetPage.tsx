
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import FaucetClaimWorking from './FaucetClaimWorking';
import FaucetStats from './FaucetStats';
import UserFaucetStats from './UserFaucetStats';
import { toast } from 'react-toastify';

const FaucetPage: React.FC = () => {
  const { isConnected } = useAccount()

  const handleSuccessfulClaim = useCallback(() => {
    // Force refresh of all components by triggering a small delay
    setTimeout(() => {
      window.location.reload()
    }, 2000)
    console.log('Faucet claim successful!');
    toast.success("Faucet claim successful! 🎉")
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Page Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-pink-400 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <span className="text-2xl">💧</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4"
            >
              Test Token Faucet
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-gray-600 max-w-md mx-auto"
            >
              Get free USDT tokens for testing the Piggy Boss savings platform. All data is fetched live from our smart contracts on Somnia Network.
            </motion.p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Faucet Claim Component - Main Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="lg:col-span-2"
            >
              <FaucetClaimWorking onSuccessfulClaim={handleSuccessfulClaim} />
            </motion.div>

            {/* User Stats - Side Column */}
            {isConnected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <UserFaucetStats />
              </motion.div>
            )}
          </div>

          {/* Global Faucet Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="mb-8"
          >
            <FaucetStats />
          </motion.div>

          {/* Additional Information Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white/70 backdrop-blur-sm border border-pink-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Contract Integration</h3>
              </div>
              <p className="text-gray-600 text-sm">
                All data is fetched live from our MockUSDT smart contract on Somnia Network. Real blockchain interactions, real data.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-blue-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Fair Usage</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Smart contract enforced 24-hour cooldown ensures fair distribution. Cooldown timer syncs with blockchain state.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-purple-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Live Statistics</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Global and personal statistics are pulled directly from contract events and state variables.
              </p>
            </div>
          </motion.div>

          {/* How it Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="mt-8 bg-white/50 backdrop-blur-sm border border-purple-200 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              🚀 How It Works
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <p className="text-gray-600 text-sm">Connect your wallet to the Somnia testnet</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <p className="text-gray-600 text-sm">Smart contract validates your eligibility and cooldown period</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <p className="text-gray-600 text-sm">Claim tokens directly from the blockchain and start testing!</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation to Dashboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 mb-4">
              Once you have tokens, try out our savings features!
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Go to Dashboard
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-center mt-8"
          >
            <p className="text-gray-400 text-xs">
              Live contract integration • Somnia Testnet • Real blockchain data • No mock values
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FaucetPage;