
import React, { useState, useEffect } from 'react'

interface YieldDataPoint {
  date: string
  yield: number
  apy: number
}

const YieldChart: React.FC = () => {
  const [period] = useState<'7D' | '30D' | '90D'>('30D')
  const [data, setData] = useState<YieldDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Generate mock data
  useEffect(() => {
    setIsLoading(true)
    
    const generateMockData = (days: number): YieldDataPoint[] => {
      const data: YieldDataPoint[] = []
      const now = new Date()
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        
        // Generate realistic yield data with some variation
        const baseYield = 12 + Math.sin(i / 10) * 2 + Math.random() * 1.5
        const yieldValue = Math.max(0, baseYield)
        
        data.push({
          date: date.toISOString().split('T')[0] || '',
          yield: Number(yieldValue.toFixed(2)),
          apy: Number((yieldValue * 365 / days).toFixed(2))
        })
      }
      
      return data
    }

    // Simulate API delay
    setTimeout(() => {
      const days = period === '7D' ? 7 : period === '30D' ? 30 : 90
      setData(generateMockData(days))
      setIsLoading(false)
    }, 500)
  }, [period])

  const maxYield = Math.max(...data.map(d => d.yield))
  const minYield = Math.min(...data.map(d => d.yield))
  const avgYield = data.length > 0 ? data.reduce((sum, d) => sum + d.yield, 0) / data.length : 0

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Chart Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-500">Average APY</div>
          <div className="text-lg font-bold text-primary">{avgYield.toFixed(2)}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Peak APY</div>
          <div className="text-lg font-bold text-success">{maxYield.toFixed(2)}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Low APY</div>
          <div className="text-lg font-bold text-orange-500">{minYield.toFixed(2)}%</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-48 bg-gray-50 rounded-lg p-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
          <span>{maxYield.toFixed(1)}%</span>
          <span>{((maxYield + minYield) / 2).toFixed(1)}%</span>
          <span>{minYield.toFixed(1)}%</span>
        </div>

        {/* Chart Area */}
        <div className="ml-8 mr-4 h-full relative">
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {[0, 25, 50, 75, 100].map(percent => (
              <div
                key={percent}
                className="absolute w-full border-t border-gray-200"
                style={{ top: `${percent}%` }}
              ></div>
            ))}
          </div>

          {/* Data Points and Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Area Fill */}
            <defs>
              <linearGradient id="yieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#EC4899', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 0.05 }} />
              </linearGradient>
            </defs>

            {/* Generate path for area and line */}
            {data.length > 1 && (
              <>
                {/* Area */}
                <path
                  d={`M 0 ${100 - ((data[0]?.yield ?? 0 - minYield) / (maxYield - minYield)) * 100} 
                      ${data.map((d, i) => 
                        `L ${(i / (data.length - 1)) * 100} ${100 - ((d.yield - minYield) / (maxYield - minYield)) * 100}`
                      ).join(' ')} 
                      L 100 100 L 0 100 Z`}
                  fill="url(#yieldGradient)"
                />
                
                {/* Line */}
                <path
                  d={`M 0 ${100 - ((data[0]?.yield ?? 0 - minYield) / (maxYield - minYield)) * 100} 
                      ${data.map((d, i) => 
                        `L ${(i / (data.length - 1)) * 100} ${100 - ((d.yield - minYield) / (maxYield - minYield)) * 100}`
                      ).join(' ')}`}
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="0.5"
                  className="drop-shadow-sm"
                />
              </>
            )}

            {/* Data Points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={(i / (data.length - 1)) * 100}
                cy={100 - ((d.yield - minYield) / (maxYield - minYield)) * 100}
                r="0.8"
                fill="#EC4899"
                className="hover:r-1.5 transition-all cursor-pointer"
              />
            ))}
          </svg>

          {/* Interactive Overlay */}
          <div className="absolute inset-0 flex">
            {data.map((d, i) => (
              <div
                key={i}
                className="flex-1 group relative cursor-pointer"
                title={`${d.date}: ${d.yield}% APY`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    <div>{d.date}</div>
                    <div className="font-bold">{d.yield}% APY</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-8 right-4 flex justify-between text-xs text-gray-500">
          <span>{data[0]?.date}</span>
          {data.length > 2 && (
            <span>{data[Math.floor(data.length / 2)]?.date}</span>
          )}
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>

      {/* Chart Info */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Showing {period.toLowerCase()} yield performance • Last updated: just now
        </p>
      </div>
    </div>
  )
}

export default YieldChart
