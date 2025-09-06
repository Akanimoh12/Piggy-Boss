import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

/**
 * Toast Notification Component
 * 
 * Provides user feedback for actions with different types and animations
 * Supports auto-dismiss, actions, and accessibility features
 */

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  isVisible: boolean
  onClose: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastStyles = {
  success: {
    container: 'bg-white border-l-4 border-success-500 shadow-soft-lg',
    icon: 'text-success-500',
    title: 'text-success-800',
    message: 'text-success-600',
  },
  error: {
    container: 'bg-white border-l-4 border-error-500 shadow-soft-lg',
    icon: 'text-error-500',
    title: 'text-error-800',
    message: 'text-error-600',
  },
  warning: {
    container: 'bg-white border-l-4 border-warning-500 shadow-soft-lg',
    icon: 'text-warning-500',
    title: 'text-warning-800',
    message: 'text-warning-600',
  },
  info: {
    container: 'bg-white border-l-4 border-info-500 shadow-soft-lg',
    icon: 'text-info-500',
    title: 'text-info-800',
    message: 'text-info-600',
  },
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 3000,
  isVisible,
  onClose,
  action,
}) => {
  const Icon = toastIcons[type]
  const styles = toastStyles[type]

  // Auto-dismiss timer
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.3 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.5 }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.4
          }}
          className={`
            ${styles.container}
            relative flex items-start p-4 rounded-xl max-w-sm w-full
            pointer-events-auto overflow-hidden
          `}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Progress bar for auto-dismiss */}
          {duration > 0 && (
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-current opacity-20"
            />
          )}

          {/* Icon */}
          <div className={`flex-shrink-0 ${styles.icon}`}>
            <Icon size={20} />
          </div>

          {/* Content */}
          <div className="ml-3 flex-1">
            <p className={`${styles.title} text-sm font-semibold leading-5`}>
              {title}
            </p>
            {message && (
              <p className={`${styles.message} mt-1 text-sm leading-4`}>
                {message}
              </p>
            )}
            
            {/* Action button */}
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={`
                    text-sm font-medium underline hover:no-underline
                    transition-colors duration-200 focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-current
                    ${styles.title}
                  `}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>

          {/* Close button */}
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="
                inline-flex text-secondary-400 hover:text-secondary-600
                focus:outline-none focus:text-secondary-600
                transition-colors duration-200
              "
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Toast Container Component
 * 
 * Manages multiple toast notifications with proper positioning
 */

export interface ToastContainerProps {
  toasts: ToastProps[]
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  className?: string
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  className = '',
}) => {
  return (
    <div
      className={`
        fixed z-50 flex flex-col space-y-2 pointer-events-none
        ${positionStyles[position]}
        ${className}
      `}
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Toast Hook for easy usage
 * 
 * Provides a simple API to show toast notifications
 */

export interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const showToast = React.useCallback((
    title: string,
    message?: string,
    options: ToastOptions = {}
  ) => {
    const id = Date.now().toString()
    const newToast: ToastProps = {
      id,
      type: options.type || 'info',
      title,
      message,
      duration: options.duration ?? 3000,
      isVisible: true,
      onClose: () => removeToast(id),
      action: options.action,
    }

    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id 
          ? { ...toast, isVisible: false }
          : toast
      )
    )

    // Remove from state after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 400)
  }, [])

  const clearToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods
  const success = React.useCallback((title: string, message?: string, options?: Omit<ToastOptions, 'type'>) => {
    return showToast(title, message, { ...options, type: 'success' })
  }, [showToast])

  const error = React.useCallback((title: string, message?: string, options?: Omit<ToastOptions, 'type'>) => {
    return showToast(title, message, { ...options, type: 'error' })
  }, [showToast])

  const warning = React.useCallback((title: string, message?: string, options?: Omit<ToastOptions, 'type'>) => {
    return showToast(title, message, { ...options, type: 'warning' })
  }, [showToast])

  const info = React.useCallback((title: string, message?: string, options?: Omit<ToastOptions, 'type'>) => {
    return showToast(title, message, { ...options, type: 'info' })
  }, [showToast])

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  }
}

export default Toast
