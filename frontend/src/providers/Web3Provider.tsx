import React from 'react'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import wagmiConfig, { chains } from '@/config/wagmi'

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css'

interface Web3ProviderProps {
  children: React.ReactNode
}

// Create a React Query client
const queryClient = new QueryClient()

/**
 * Web3Provider Component
 * 
 * Provides Web3 functionality to the entire application using:
 * - Wagmi for Web3 state management
 * - RainbowKit for wallet connection UI
 * - React Query for data fetching
 */
export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider 
          chains={chains} 
          theme={darkTheme({
            accentColor: '#10b981', // emerald-500 to match the app theme
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          showRecentTransactions={true}
          appInfo={{
            appName: 'Piggy Boss',
            learnMoreUrl: 'https://piggyboss.finance',
          }}
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}

export default Web3Provider
