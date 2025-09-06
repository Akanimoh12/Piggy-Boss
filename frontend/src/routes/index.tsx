/**
 * Route Configuration for Piggy Boss DeFi Platform
 * 
 * Handles all application routing with lazy loading and protected routes
 */

import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Lazy load components for better performance
const LandingPage = React.lazy(() => import('@components/landing/LandingPage'))
const DashboardLayout = React.lazy(() => import('@components/layout/DashboardLayout'))
const Dashboard = React.lazy(() => import('@components/dashboard/Dashboard'))
const SavingsPage = React.lazy(() => import('@components/savings/SavingsPage'))
const DepositPage = React.lazy(() => import('@components/savings/DepositPage'))
const FaucetPage = React.lazy(() => import('@components/faucet/FaucetPage'))
const ToastDemo = React.lazy(() => import('@components/common/ToastDemo'))

// Loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Dashboard Routes with Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="savings" element={<SavingsPage />} />
          <Route path="yield" element={<div className="p-6">Yield Page Coming Soon</div>} />
          <Route path="ai" element={<div className="p-6">AI Insights Coming Soon</div>} />
          <Route path="faucet" element={<FaucetPage />} />
          <Route path="staking" element={<div className="p-6">Staking Coming Soon</div>} />
        </Route>
        
        {/* Legacy routes - redirect to dashboard */}
        <Route path="/savings" element={<Navigate to="/dashboard/savings" replace />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/faucet" element={<Navigate to="/dashboard/faucet" replace />} />
        <Route path="/toast-demo" element={<ToastDemo />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
