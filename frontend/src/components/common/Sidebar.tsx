import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiHome, 
  FiPieChart, 
  FiTrendingUp, 
  FiZap, 
  FiDroplet,
  FiLayers,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi'
import { useAccount, useDisconnect } from 'wagmi'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: FiHome },
  { name: 'Savings', href: '/dashboard/savings', icon: FiPieChart },
  { name: 'Yield', href: '/dashboard/yield', icon: FiTrendingUp },
  { name: 'AI Insights', href: '/dashboard/ai', icon: FiZap },
  { name: 'Faucet', href: '/dashboard/faucet', icon: FiDroplet },
  { name: 'Staking', href: '/dashboard/staking', icon: FiLayers },
]

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-gray-200 flex flex-col shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-gray-900">Piggy Boss</span>
          </motion.div>
        )}
        
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <FiChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <FiChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && address && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {address.slice(2, 4).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {formatAddress(address)}
              </p>
              <p className="text-xs text-gray-500">Connected</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-pink-50 text-pink-700 border-r-2 border-pink-500' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.name}
                </motion.span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        <button className={`
          flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg 
          hover:bg-gray-50 hover:text-gray-900 transition-colors
        `}>
          <FiSettings className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`} />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              Settings
            </motion.span>
          )}
        </button>

        <button 
          onClick={() => disconnect()}
          className={`
            flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg 
            hover:bg-red-50 transition-colors
          `}
        >
          <FiLogOut className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`} />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              Disconnect
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  )
}

export default Sidebar
