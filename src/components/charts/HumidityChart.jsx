import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import './Charts.css'

const HumidityChart = ({ data }) => {
  const chartData = data.map((item, index) => ({
    time: new Date(item.dt_txt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }),
    day: new Date(item.dt_txt).toLocaleDateString('en-US', {
      weekday: 'short'
    }),
    fullTime: new Date(item.dt_txt).toLocaleString(),
    humidity: item.main.humidity,
    // Color coding based on humidity levels
    color: item.main.humidity > 80 ? '#2E86AB' :
           item.main.humidity > 60 ? '#4CB5AE' :
           item.main.humidity > 40 ? '#A8E6CF' : '#F0F4C3'
  }))

  const avgHumidity = (chartData.reduce((sum, item) => sum + item.humidity, 0) / chartData.length).toFixed(1)
  const maxHumidity = Math.max(...chartData.map(item => item.humidity))
  const minHumidity = Math.min(...chartData.map(item => item.humidity))

  // Custom X-axis tick formatter
  const formatXAxis = (tickItem, index) => {
    if (index === 0 || index === chartData.length - 1 || index % 4 === 0) {
      return tickItem
    }
    return ''
  }

  // Custom tooltip for humidity
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      let humidityLevel = ''
      let levelColor = ''

      if (data.humidity > 80) {
        humidityLevel = 'High Humidity'
        levelColor = '#2E86AB'
      } else if (data.humidity > 60) {
        humidityLevel = 'Moderate Humidity'
        levelColor = '#4CB5AE'
      } else if (data.humidity > 40) {
        humidityLevel = 'Comfortable'
        levelColor = '#A8E6CF'
      } else {
        humidityLevel = 'Low Humidity'
        levelColor = '#F0F4C3'
      }

      return (
        <div className="custom-tooltip">
          <p className="tooltip-time">{data.fullTime}</p>
          <p className="tooltip-item">
            <span className="tooltip-label">Humidity: </span>
            <span className="tooltip-value" style={{ color: levelColor }}>
              {payload[0].value}%
            </span>
          </p>
          <p className="tooltip-item">
            <span className="tooltip-label">Level: </span>
            <span className="tooltip-value" style={{ color: levelColor }}>
              {humidityLevel}
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Humidity Trend</h3>
        <div className="chart-stats">
          <div className="stat-item">
            <div className="stat-label">Average</div>
            <div className="stat-value">{avgHumidity}%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Min</div>
            <div className="stat-value min-humidity">{minHumidity}%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Max</div>
            <div className="stat-value max-humidity">{maxHumidity}%</div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.1)"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            stroke="rgba(255,255,255,0.7)"
            fontSize={11}
            tickFormatter={formatXAxis}
            angle={-45}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
            tick={{ fill: 'rgba(255,255,255,0.8)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
          />

          <YAxis
            stroke="rgba(255,255,255,0.7)"
            fontSize={12}
            domain={[0, 100]}
            tick={{ fill: 'rgba(255,255,255,0.8)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            tickFormatter={(value) => `${value}%`}
            width={40}
          />

          <ReferenceLine
            y={50}
            stroke="rgba(255,255,255,0.2)"
            strokeDasharray="2 2"
          />

          <ReferenceLine
            y={avgHumidity}
            stroke="rgba(255,255,255,0.4)"
            strokeDasharray="3 3"
            label={{
              value: `Avg: ${avgHumidity}%`,
              position: 'right',
              fill: 'rgba(255,255,255,0.7)',
              fontSize: 12
            }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Bar
            dataKey="humidity"
            name="Humidity (%)"
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Humidity Level Guide */}
      <div className="humidity-guide">
        <div className="guide-title">Humidity Levels:</div>
        <div className="guide-items">
          <div className="guide-item">
            <span className="color-dot" style={{ backgroundColor: '#F0F4C3' }}></span>
            <span>Low (0-40%)</span>
          </div>
          <div className="guide-item">
            <span className="color-dot" style={{ backgroundColor: '#A8E6CF' }}></span>
            <span>Comfortable (40-60%)</span>
          </div>
          <div className="guide-item">
            <span className="color-dot" style={{ backgroundColor: '#4CB5AE' }}></span>
            <span>Moderate (60-80%)</span>
          </div>
          <div className="guide-item">
            <span className="color-dot" style={{ backgroundColor: '#2E86AB' }}></span>
            <span>High (80-100%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HumidityChart