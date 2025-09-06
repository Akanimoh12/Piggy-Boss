import React, { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { useNetwork } from 'wagmi'
import { somniaTestnet, somniaMainnet } from '@/config/wagmi'
import WalletModal from './WalletModalRK'

interface WalletConnectionProps {
  variant?: 'default' | 'compact' | 'minimal'
  className?: string
}


export const WalletConnection: React.FC<WalletConnectionProps> = ({
  variant = 'default',
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { chain } = useNetwork()

  // Check if on Somnia network
  const isOnSomnia = chain?.id === somniaTestnet.id || chain?.id === somniaMainnet.id

  return (
    <>
      {/* Primary Connect Button */}
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading'
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated')

          return (
            <div
              className={className}
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openConnectModal}
                      className="bg-gradient-to-r from-accent to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {variant === 'minimal' ? 'Connect' : 'Connect Wallet'}
                    </motion.button>
                  )
                }

                if (chain.unsupported) {
                  return (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openChainModal}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Wrong Network
                    </motion.button>
                  )
                }

                // Minimal variant
                if (variant === 'minimal') {
                  return (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openAccountModal}
                      className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span>{account.displayName}</span>
                      </div>
                    </motion.button>
                  )
                }

                // Compact variant
                if (variant === 'compact') {
                  return (
                    <div className="flex items-center space-x-2">
                      {/* Network Status */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openChainModal}
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                          isOnSomnia
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {isOnSomnia ? 'Somnia' : 'Switch Network'}
                      </motion.button>

                      {/* Account Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openAccountModal}
                        className="bg-white text-primary-900 px-3 py-1.5 rounded-lg text-sm font-medium shadow-md border border-secondary-200 hover:bg-secondary-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                          <span>{account.displayName}</span>
                          {account.displayBalance && (
                            <span className="text-secondary-600">
                              {account.displayBalance}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    </div>
                  )
                }

                // Default variant
                return (
                  <div className="flex items-center space-x-3">
                    {/* Network Status */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openChainModal}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isOnSomnia
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isOnSomnia ? 'bg-emerald-500' : 'bg-yellow-500'
                          }`}
                        />
                        <span>
                          {isOnSomnia 
                            ? (chain.name?.includes('Testnet') ? 'Somnia Testnet' : 'Somnia Network')
                            : 'Wrong Network'
                          }
                        </span>
                      </div>
                    </motion.button>

                    {/* Account Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openAccountModal}
                      className="bg-white text-primary-900 px-4 py-2 rounded-xl font-medium shadow-lg border border-secondary-200 hover:bg-secondary-50 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">{account.displayName}</p>
                          {account.displayBalance && (
                            <p className="text-xs text-secondary-600">
                              {account.displayBalance}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  </div>
                )
              })()}
            </div>
          )
        }}
      </ConnectButton.Custom>

      {/* Custom Wallet Modal */}
      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}

export default WalletConnection
