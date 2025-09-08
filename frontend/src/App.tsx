import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'

import AppRoutes from './routes'
import Navigation from '@components/common/Navigation'
import FloatingDepositButton from '@components/common/FloatingDepositButton'

const App: React.FC = () => {
  const { isConnected } = useAccount()
  const isLoading = false

  return (
    <>
      <Helmet>
        <title>Piggy Boss - DeFi Savings Platform</title>
        <meta 
          name="description" 
          content="Earn high-yield interest on your crypto savings with Piggy Boss. Secure, transparent DeFi platform on Somnia Network with NFT rewards and AI-powered insights." 
        />
        <meta name="keywords" content="DeFi, savings, yield, crypto, Somnia Network, NFT rewards, blockchain" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Piggy Boss - DeFi Savings Platform" />
        <meta property="og:description" content="Earn high-yield interest on your crypto savings with Piggy Boss." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://piggyboss.finance" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Piggy Boss - DeFi Savings Platform" />
        <meta name="twitter:description" content="Earn high-yield interest on your crypto savings with Piggy Boss." />
        <meta name="twitter:image" content="/twitter-image.png" />
        
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        <meta name="theme-color" content="#0a120e" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <link rel="preconnect" href="https://dream-rpc.somnia.network" />
        <link rel="dns-prefetch" href="https://shannon-explorer.somnia.network" />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
        <BrowserRouter>
          <Navigation />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isConnected ? 'connected' : 'disconnected'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1] // Custom easing for smooth transitions
              }}
              className="relative"
            >
              {/* App Routes */}
              <AppRoutes />
              
              {/* Floating Deposit Button */}
              <FloatingDepositButton />
              
              {/* Loading Overlay for Web3 Operations */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-soft-lg max-w-sm mx-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <span className="text-primary-900 font-medium">
                          Processing transaction...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </BrowserRouter>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-900/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(10, 18, 14, 0.5) 1px, transparent 0)
            `,
            backgroundSize: '24px 24px'
          }}
        />
      </div>
    </>
  )
}

export default App
