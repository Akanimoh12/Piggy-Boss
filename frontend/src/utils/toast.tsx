/**
 * Custom Toast Utilities
 * 
 * Provides styled toast notifications matching the Piggy Boss brand
 * with specific configurations for different types of notifications
 */

import { toast, ToastOptions, Id } from 'react-toastify'
import { CheckCircle, XCircle, AlertCircle, Info, ExternalLink, RotateCcw } from 'lucide-react'

// Base toast configuration
const baseToastConfig: ToastOptions = {
  position: 'top-right',
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
}

// Success toast (2s duration, green accent)
export const showSuccessToast = (
  message: string,
  options?: Partial<ToastOptions>
): Id => {
  return toast.success(
    <div className="flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      <span className="font-medium">{message}</span>
    </div>,
    {
      ...baseToastConfig,
      autoClose: 2000,
      className: 'toast-success',
      ...options,
    }
  )
}

// Error toast (2s duration, red accent, with retry option)
export const showErrorToast = (
  message: string,
  onRetry?: () => void,
  options?: Partial<ToastOptions>
): Id => {
  return toast.error(
    <div className="toast-transaction">
      <div className="toast-transaction-header">
        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="toast-retry-button"
        >
          <RotateCcw className="w-3 h-3 inline mr-1" />
          Retry
        </button>
      )}
    </div>,
    {
      ...baseToastConfig,
      autoClose: 2000,
      className: 'toast-error',
      ...options,
    }
  )
}

// Info toast (3s duration, blue accent)
export const showInfoToast = (
  message: string,
  options?: Partial<ToastOptions>
): Id => {
  return toast.info(
    <div className="flex items-center gap-3">
      <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
      <span className="font-medium">{message}</span>
    </div>,
    {
      ...baseToastConfig,
      autoClose: 3000,
      className: 'toast-info',
      ...options,
    }
  )
}

// Warning toast
export const showWarningToast = (
  message: string,
  options?: Partial<ToastOptions>
): Id => {
  return toast.warn(
    <div className="flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
      <span className="font-medium">{message}</span>
    </div>,
    {
      ...baseToastConfig,
      autoClose: 3000,
      className: 'toast-warning',
      ...options,
    }
  )
}

// Loading toast with spinner (doesn't auto-close)
export const showLoadingToast = (
  message: string,
  options?: Partial<ToastOptions>
): Id => {
  return toast.loading(
    <div className="toast-loading">
      <div className="toast-loading-spinner" />
      <span className="font-medium">{message}</span>
    </div>,
    {
      ...baseToastConfig,
      autoClose: false,
      closeButton: false,
      className: 'toast-loading',
      ...options,
    }
  )
}

// Transaction pending toast
export const showTransactionPendingToast = (
  message: string = 'Transaction pending...',
  txHash?: string,
  options?: Partial<ToastOptions>
): Id => {
  return toast.loading(
    <div className="toast-transaction">
      <div className="toast-transaction-header">
        <div className="toast-loading-spinner" />
        <span className="font-medium">{message}</span>
      </div>
      {txHash && (
        <div className="toast-transaction-details">
          <span className="text-xs">Transaction submitted</span>
          <a
            href={`https://shannon-explorer.somnia.network/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="toast-transaction-link"
          >
            View on Explorer
            <ExternalLink className="w-3 h-3 inline ml-1" />
          </a>
        </div>
      )}
    </div>,
    {
      ...baseToastConfig,
      autoClose: false,
      closeButton: false,
      className: 'toast-loading',
      ...options,
    }
  )
}

// Transaction success toast
export const showTransactionSuccessToast = (
  message: string,
  txHash?: string,
  options?: Partial<ToastOptions>
): Id => {
  return toast.success(
    <div className="toast-transaction">
      <div className="toast-transaction-header">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
      {txHash && (
        <div className="toast-transaction-details">
          <span className="text-xs">Transaction confirmed</span>
          <a
            href={`https://shannon-explorer.somnia.network/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="toast-transaction-link"
          >
            View on Explorer
            <ExternalLink className="w-3 h-3 inline ml-1" />
          </a>
        </div>
      )}
    </div>,
    {
      ...baseToastConfig,
      autoClose: 5000,
      className: 'toast-success',
      ...options,
    }
  )
}

// Transaction error toast
export const showTransactionErrorToast = (
  message: string,
  txHash?: string,
  onRetry?: () => void,
  options?: Partial<ToastOptions>
): Id => {
  return toast.error(
    <div className="toast-transaction">
      <div className="toast-transaction-header">
        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        {txHash && (
          <a
            href={`https://shannon-explorer.somnia.network/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="toast-transaction-link text-xs"
          >
            View on Explorer
            <ExternalLink className="w-3 h-3 inline ml-1" />
          </a>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="toast-retry-button"
          >
            <RotateCcw className="w-3 h-3 inline mr-1" />
            Retry
          </button>
        )}
      </div>
    </div>,
    {
      ...baseToastConfig,
      autoClose: 5000,
      className: 'toast-error',
      ...options,
    }
  )
}

// Update existing toast (useful for updating loading states)
export const updateToast = (
  id: Id,
  type: 'success' | 'error' | 'info' | 'warning',
  message: string,
  options?: Partial<ToastOptions>
): void => {
  const icon = {
    success: <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />,
  }

  toast.update(id, {
    render: (
      <div className="flex items-center gap-3">
        {icon[type]}
        <span className="font-medium">{message}</span>
      </div>
    ),
    type,
    isLoading: false,
    autoClose: type === 'info' ? 3000 : 2000,
    className: `toast-${type}`,
    ...options,
  })
}

// Dismiss toast
export const dismissToast = (id?: Id): void => {
  if (id) {
    toast.dismiss(id)
  } else {
    toast.dismiss()
  }
}

// Clear all toasts
export const clearAllToasts = (): void => {
  toast.dismiss()
}

// Piggy Boss specific toasts
export const showFaucetSuccessToast = (amount: number): Id => {
  return showSuccessToast(
    `${amount} MockUSDT claimed successfully! 💰`,
    { autoClose: 3000 }
  )
}

export const showDepositSuccessToast = (amount: number, apy: number): Id => {
  return showTransactionSuccessToast(
    `Deposit of ${amount} USDT successful! Earning ${apy}% APY 🎉`
  )
}

export const showWithdrawSuccessToast = (amount: number): Id => {
  return showTransactionSuccessToast(
    `Withdrawal of ${amount} USDT completed! 💸`
  )
}

export const showNFTEarnedToast = (nftName: string): Id => {
  return showSuccessToast(
    `🎨 NFT Earned: ${nftName}! Check your collection.`,
    { autoClose: 4000 }
  )
}

export const showWalletConnectionToast = (address: string): Id => {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
  return showSuccessToast(`Wallet connected: ${shortAddress}`)
}

export const showWalletDisconnectionToast = (): Id => {
  return showInfoToast('Wallet disconnected')
}

export const showNetworkSwitchToast = (networkName: string): Id => {
  return showInfoToast(`Switched to ${networkName}`)
}

export const showInsufficientBalanceToast = (): Id => {
  return showErrorToast('Insufficient balance for this transaction')
}

export const showApprovalRequiredToast = (): Id => {
  return showInfoToast('Token approval required for this transaction')
}

// Export the main toast object for advanced usage
export { toast }
