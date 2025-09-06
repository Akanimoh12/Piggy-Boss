import React from 'react'
import { useAccount } from 'wagmi'
import ModernDashboard from './ModernDashboard'

const Dashboard: React.FC = () => {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your wallet to access your dashboard
          </p>
        </div>
      </div>
    )
  }

  return <ModernDashboard />
}

export default Dashboard
