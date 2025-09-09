import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Piggy Boss - DeFi Savings Platform',
        short_name: 'Piggy Boss',
        description: 'Decentralized savings platform with high-yield interest rates and NFT rewards',
        theme_color: '#0a120e',
        background_color: '#fbfbf9',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@services': path.resolve(__dirname, './src/services'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@abi': path.resolve(__dirname, './src/abi')
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['ethers', 'wagmi', 'viem']
  },
  build: {
    rollupOptions: {
      external: [
        '@safe-globalThis/safe-apps-provider',
        '@safe-globalThis/safe-apps-sdk',
        '@safe-global/safe-apps-provider',
        '@safe-global/safe-apps-sdk'
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          web3: ['wagmi', 'viem', 'ethers'],
          ui: ['framer-motion', 'lucide-react']
        },
        globals: {
          '@safe-globalThis/safe-apps-provider': 'SafeAppsProvider',
          '@safe-globalThis/safe-apps-sdk': 'SafeAppsSDK',
          '@safe-global/safe-apps-provider': 'SafeAppsProvider',
          '@safe-global/safe-apps-sdk': 'SafeAppsSDK'
        }
      }
    },
    target: 'esnext',
    minify: 'terser'
  },
  server: {
    host: true,
    port: 5173,
    open: true
  },
  preview: {
    host: true,
    port: 4173
  }
})
