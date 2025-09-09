import React from 'react'
import { motion } from 'framer-motion'
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiClock,
  FiDollarSign,
  FiGift,
  FiExternalLink,
  FiCheck,
  FiLoader
} from 'react-icons/fi'

interface Activity {
  id: string
  type: 'deposit' | 'reward' | 'withdraw' | 'claim'
  amount: number
  date: string
  time: string
  status: 'completed' | 'pending' | 'failed'
  hash: string
}

interface RecentActivityProps {
  activities: Activity[]
  maxItems?: number
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, maxItems = 10 }) => {
  const displayActivities = activities.slice(0, maxItems)

  const getActivityIcon = (type: string, status: string) => {
    if (status === 'pending') return <FiLoader className="w-4 h-4 animate-spin" />
    if (status === 'failed') return <div className="w-4 h-4 bg-red-500 rounded-full" />
    
    switch (type) {
      case 'deposit':
        return <FiArrowDownRight className="w-4 h-4" />
      case 'withdraw':
        return <FiArrowUpRight className="w-4 h-4" />
      case 'reward':
        return <FiGift className="w-4 h-4" />
      case 'claim':
        return <FiDollarSign className="w-4 h-4" />
      default:
        return <FiClock className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string, status: string) => {
    if (status === 'pending') return 'text-yellow-600 bg-yellow-50'
    if (status === 'failed') return 'text-red-600 bg-red-50'
    
    switch (type) {
      case 'deposit':
        return 'text-blue-600 bg-blue-50'
      case 'withdraw':
        return 'text-orange-600 bg-orange-50'
      case 'reward':
        return 'text-green-600 bg-green-50'
      case 'claim':
        return 'text-purple-600 bg-purple-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getActivityDescription = (activity: Activity) => {
    switch (activity.type) {
      case 'deposit':
        return `Deposited $${activity.amount.toFixed(2)} USDT`
      case 'withdraw':
        return `Withdrew $${activity.amount.toFixed(2)} USDT`
      case 'reward':
        return `Earned $${activity.amount.toFixed(2)} rewards`
      case 'claim':
        return `Claimed $${activity.amount.toFixed(2)} from faucet`
      default:
        return `Transaction of $${activity.amount.toFixed(2)}`
    }
  }

  const openTransactionOnExplorer = (hash: string) => {
    const explorerUrl = `https://explorer.somnia.network/tx/${hash}`
    window.open(explorerUrl, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Activity</h3>
          <p className="text-sm text-gray-600">Your latest transactions and interactions</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          View All
        </button>
      </div>

      {displayActivities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiClock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No recent activity</p>
          <p className="text-gray-400 text-xs mt-1">Your transactions will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.type, activity.status)}`}>
                  {getActivityIcon(activity.type, activity.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getActivityDescription(activity)}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>{activity.date}</span>
                    <span className="mx-1">•</span>
                    <span>{activity.time}</span>
                    {activity.status === 'completed' && (
                      <>
                        <span className="mx-1">•</span>
                        <div className="flex items-center">
                          <FiCheck className="w-3 h-3 text-green-500 mr-1" />
                          <span className="text-green-600">Completed</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    activity.type === 'deposit' || activity.type === 'claim' 
                      ? 'text-green-600' 
                      : activity.type === 'withdraw' 
                        ? 'text-red-600' 
                        : 'text-blue-600'
                  }`}>
                    {activity.type === 'withdraw' ? '-' : '+'}${activity.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{activity.status}</p>
                </div>
                
                <button
                  onClick={() => openTransactionOnExplorer(activity.hash)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-gray-600 transition-all"
                  title="View on Explorer"
                >
                  <FiExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {displayActivities.length > 0 && activities.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors">
            Load More ({activities.length - maxItems} more activities)
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default RecentActivity
