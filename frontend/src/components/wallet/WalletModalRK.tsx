import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useBalance, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'
import { somniaTestnet, somniaMainnet } from '@/config/wagmi'
import { formatAddress, formatBalance } from '@/utils/formatters'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Enhanced WalletModal Component with RainbowKit Integration
 * 
 * Features:
 * - RainbowKit's ConnectButton for seamless wallet connection
 * - Support for MetaMask, WalletConnect, Coinbase Wallet, and more
 * - Auto-connect functionality for returning users
 * - Network switching to Somnia Testnet/Mainnet
 * - Display connected address and balance
 * - Disconnect functionality
 * - Beautiful UI with glassmorphism effects
 */
export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance(
    address ? { address } : undefined
  )
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()
  const { switchNetwork, isLoading: isSwitching } = useSwitchNetwork()

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect()
    onClose()
  }

  // Handle network switch to Somnia
  const switchToSomnia = async (targetChain: typeof somniaTestnet | typeof somniaMainnet) => {
    if (switchNetwork) {
      switchNetwork(targetChain.id)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-900">
                {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary-100 hover:bg-secondary-200 transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!isConnected ? (
              // Connection UI
              <div className="space-y-6">
                <p className="text-secondary-600 text-center">
                  Connect your wallet to start saving on Somnia Network and earn NFT rewards
                </p>
                
                {/* RainbowKit Connect Button */}
                <div className="flex justify-center">
                  <ConnectButton.Custom>
                    {({
                      account,
                      chain,
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
                          {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                              opacity: 0,
                              pointerEvents: 'none',
                              userSelect: 'none',
                            },
                          })}
                        >
                          {(() => {
                            if (!connected) {
                              return (
                                <button
                                  onClick={openConnectModal}
                                  className="w-full bg-gradient-to-r from-primary-900 to-primary-800 text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                >
                                  Connect Wallet
                                </button>
                              )
                            }
                            return null
                          })()}
                        </div>
                      )
                    }}
                  </ConnectButton.Custom>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-emerald-900">Secure</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-blue-900">Fast</p>
                  </div>
                </div>
              </div>
            ) : (
              // Connected Wallet UI
              <div className="space-y-6">
                {/* Account Info */}
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Connected Address</p>
                      <p className="font-mono text-primary-900 font-medium">
                        {formatAddress(address || '')}
                      </p>
                    </div>
                  </div>
                  
                  {balance && (
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                      <span className="text-sm text-secondary-600">Balance</span>
                      <span className="font-semibold text-primary-900">
                        {formatBalance(balance.formatted)} {balance.symbol}
                      </span>
                    </div>
                  )}
                </div>

                {/* Network Status */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary-900">Network</h3>
                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        chain?.id === somniaTestnet.id || chain?.id === somniaMainnet.id
                          ? 'bg-emerald-500' 
                          : 'bg-yellow-500'
                      }`} />
                      <span className="font-medium text-primary-900">
                        {chain?.name || 'Unknown Network'}
                      </span>
                    </div>
                    {chain?.id !== somniaTestnet.id && chain?.id !== somniaMainnet.id && (
                      <button
                        onClick={() => switchToSomnia(somniaTestnet)}
                        disabled={isSwitching}
                        className="text-sm bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50"
                      >
                        {isSwitching ? 'Switching...' : 'Switch to Somnia'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <ConnectButton.Custom>
                    {({ openAccountModal }) => (
                      <button
                        onClick={openAccountModal}
                        className="w-full bg-secondary-100 text-primary-900 py-3 px-6 rounded-xl font-medium hover:bg-secondary-200 transition-colors"
                      >
                        Account Details
                      </button>
                    )}
                  </ConnectButton.Custom>
                  
                  <button
                    onClick={handleDisconnect}
                    className="w-full bg-error-100 text-error-700 py-3 px-6 rounded-xl font-medium hover:bg-error-200 transition-colors"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WalletModal
