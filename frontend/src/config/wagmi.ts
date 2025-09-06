/**
 * Wagmi Configuration for Piggy Boss
 * 
 * Configures Wagmi client with RainbowKit for wallet connections,
 * including Somnia Network configuration and auto-connect functionality.
 */

import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { defineChain } from 'viem'
import { mainnet, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'

// Define Somnia Network
export const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SOM',
    symbol: 'SOM',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://explorer.somnia.network',
    },
  },
  testnet: true,
})

// Define Somnia Mainnet (when available)
export const somniaMainnet = defineChain({
  id: 50311,
  name: 'Somnia Network',
  network: 'somnia-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SOM',
    symbol: 'SOM',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.somnia.network'],
    },
    public: {
      http: ['https://rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://explorer.somnia.network',
    },
  },
  testnet: false,
})

// Wallet configuration
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'your-project-id'

// Configure chains and providers
const { chains, publicClient } = configureChains(
  [somniaTestnet, somniaMainnet, sepolia, mainnet],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || '' }),
    infuraProvider({ apiKey: import.meta.env.VITE_INFURA_API_KEY || '' }),
    publicProvider()
  ]
)

// Configure wallets
const { connectors } = getDefaultWallets({
  appName: 'Piggy Boss',
  projectId,
  chains
})

// Create Wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

// Network switching utilities
export const switchToSomniaTestnet = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xC458' }], // 50312 in hex
    })
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xC458',
              chainName: 'Somnia Testnet',
              nativeCurrency: {
                name: 'SOM',
                symbol: 'SOM',
                decimals: 18,
              },
              rpcUrls: ['https://dream-rpc.somnia.network'],
              blockExplorerUrls: ['https://explorer.somnia.network'],
            },
          ],
        })
      } catch (addError) {
        console.error('Failed to add Somnia Testnet:', addError)
        throw addError
      }
    } else {
      console.error('Failed to switch to Somnia Testnet:', switchError)
      throw switchError
    }
  }
}

export const switchToSomniaMainnet = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xC457' }], // 50311 in hex
    })
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xC457',
              chainName: 'Somnia Network',
              nativeCurrency: {
                name: 'SOM',
                symbol: 'SOM',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.somnia.network'],
              blockExplorerUrls: ['https://explorer.somnia.network'],
            },
          ],
        })
      } catch (addError) {
        console.error('Failed to add Somnia Mainnet:', addError)
        throw addError
      }
    } else {
      console.error('Failed to switch to Somnia Mainnet:', switchError)
      throw switchError
    }
  }
}

// Export chains and config
export { chains }

// Default network detection
export const getPreferredNetwork = () => {
  const isProduction = import.meta.env.PROD
  return isProduction ? somniaMainnet : somniaTestnet
}

export default wagmiConfig
