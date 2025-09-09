import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'

import App from './App'
import Web3Provider from '@/providers/Web3Provider'

import '@styles/index.css'
import 'react-toastify/dist/ReactToastify.css'

// Create a client for React Query
// Note: React Query client is now created inside Web3Provider

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // In production, you might want to log this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-soft-lg">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-primary-900 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-secondary-600 mb-6">
              We encountered an unexpected error. Please refresh the page and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-800 transition-colors"
            >
              Refresh Page
            </button>
            {import.meta.env.DEV && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-secondary-500">
                  Error Details (Dev Mode)
                </summary>
                <pre className="mt-2 text-xs bg-error-50 p-2 rounded border overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Loading Component
const AppLoading = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <svg className="w-8 h-8 text-primary-900" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-primary-900 mb-2">
        Loading Piggy Boss
      </h2>
      <p className="text-secondary-600">
        Preparing your DeFi savings experience...
      </p>
    </div>
  </div>
)

// Main App wrapper
const AppWrapper = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Web3Provider>
          <React.Suspense fallback={<AppLoading />}>
            <App />
          </React.Suspense>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="custom-toast-container"
          />
        </Web3Provider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root')!)

// Render the app
root.render(<AppWrapper />)

// Hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept()
}

// Service Worker registration for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
      })
      .catch((registrationError) => {
      })
  })
}

if (import.meta.env.DEV) {
}

