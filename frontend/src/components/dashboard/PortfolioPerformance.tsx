import React from 'react'
import { motion } from 'framer-motion'
import {
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiClock,
  FiDollarSign,
  FiPieChart
} from 'react-icons/fi'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

interface PerformanceData {
  date: string
  value: number
  deposits: number
  rewards: number
}

interface PortfolioPerformanceProps {
  data: PerformanceData[]
  totalValue: number
  totalRewards: number
  totalDeposits: number
}

const PortfolioPerformance: React.FC<PortfolioPerformanceProps> = ({
  data,
  totalValue,
  totalRewards,
  totalDeposits
}) => {
  // Calculate performance metrics
  const currentValue = data[data.length - 1]?.value || 0
  const previousValue = data[data.length - 2]?.value || 0
  const dayChange = currentValue - previousValue
  const dayChangePercent = previousValue > 0 ? ((dayChange / previousValue) * 100) : 0

  const monthlyGrowth = data.length >= 30 
    ? ((currentValue - (data[data.length - 30]?.value || 0)) / (data[data.length - 30]?.value || 1)) * 100 
    : 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Portfolio Performance</h3>
          <p className="text-sm text-gray-600">Your savings growth over time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">24h Change</p>
            <div className={`flex items-center text-sm font-medium ${
              dayChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {dayChange >= 0 ? <FiArrowUp className="w-4 h-4 mr-1" /> : <FiArrowDown className="w-4 h-4 mr-1" />}
              ${Math.abs(dayChange).toFixed(2)} ({dayChangePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRewards" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="deposits" 
              stackId="1"
              stroke="#3b82f6" 
              fill="url(#colorValue)"
              strokeWidth={2}
              name="Deposits"
            />
            <Area 
              type="monotone" 
              dataKey="rewards" 
              stackId="1"
              stroke="#10b981" 
              fill="url(#colorRewards)"
              strokeWidth={2}
              name="Rewards"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Deposits</p>
              <p className="text-2xl font-bold text-blue-700">${totalDeposits.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiPieChart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Rewards</p>
              <p className="text-2xl font-bold text-green-700">${totalRewards.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Monthly Growth</p>
              <p className="text-2xl font-bold text-purple-700">{monthlyGrowth.toFixed(2)}%</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiArrowUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PortfolioPerformance
