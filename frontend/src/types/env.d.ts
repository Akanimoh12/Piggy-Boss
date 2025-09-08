/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOMNIA_RPC_URL: string
  readonly VITE_SOMNIA_CHAIN_ID: string
  readonly VITE_SOMNIA_EXPLORER_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_PIGGY_VAULT_ADDRESS: string
  readonly VITE_YIELD_MANAGER_ADDRESS: string
  readonly VITE_NFT_REWARDS_ADDRESS: string
  readonly VITE_MOCK_USDT_ADDRESS: string
  readonly VITE_FACTORY_ADDRESS: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_SENTRY_DSN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export {}
