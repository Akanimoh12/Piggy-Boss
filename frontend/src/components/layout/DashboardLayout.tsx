import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { FiMenu } from 'react-icons/fi'
import Sidebar from '../common/Sidebar'
import WalletConnection from '../wallet/WalletConnectionRK'

const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isConnected } = useAccount()

  // Redirect to landing if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md w-full"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <img 
              src="/logo.png" 
              alt="Piggy Boss Logo" 
              className="w-20 h-20"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to access your dashboard and start earning.
          </p>
          <WalletConnection />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 lg:flex lg:overflow-hidden">
      {/* Sidebar */}
      <div className="lg:flex-shrink-0">
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="lg:flex-1 lg:flex lg:flex-col lg:overflow-hidden lg:h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiMenu className="w-6 h-6 text-gray-600" />
          </button>
          <img 
            src="/logo.png" 
            alt="Piggy Boss Logo" 
            className="w-8 h-8"
          />
        </div>

        {/* Desktop Header */}
        <header className="hidden lg:block lg:flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">
                Manage your savings and track your earnings
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
              >
                Quick Deposit
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
