import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { convertTemperature } from '../../utils/helpers'
import './Charts.css'

const TemperatureChart = ({ data, unit }) => {
  const chartData = data.map((item, index) => ({
    time: new Date(item.dt_txt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }),
    day: new Date(item.dt_txt).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }),
    fullTime: new Date(item.dt_txt).toLocaleString(),
    temperature: Math.round(convertTemperature(item.main.temp, unit)),
    feelsLike: Math.round(convertTemperature(item.main.feels_like, unit)),
    isNewDay: index === 0 || new Date(item.dt_txt).getDate() !== new Date(data[index-1].dt_txt).getDate()
  }))

  const avgTemp = (chartData.reduce((sum, item) => sum + item.temperature, 0) / chartData.length).toFixed(1)
  const minTemp = Math.min(...chartData.map(item => item.temperature))
  const maxTemp = Math.max(...chartData.map(item => item.temperature))

  // Calculate Y-axis domain with padding
  const tempPadding = 2
  const yDomain = [
    Math.floor(minTemp / 5) * 5 - tempPadding,
    Math.ceil(maxTemp / 5) * 5 + tempPadding
  ]

  // Custom X-axis tick formatter
  const formatXAxis = (tickItem, index) => {
    // Show time for first, last, and every 4th tick
    if (index === 0 || index === chartData.length - 1 || index % 4 === 0) {
      return tickItem
    }
    return ''
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="custom-tooltip">
          <p className="tooltip-time">{data.fullTime}</p>
          <p className="tooltip-item">
            <span className="tooltip-label">Temperature: </span>
            <span className="tooltip-value temp-value">
              {payload[0].value}°{unit === 'celsius' ? 'C' : 'F'}
            </span>
          </p>
          <p className="tooltip-item">
            <span className="tooltip-label">Feels Like: </span>
            <span className="tooltip-value feels-value">
              {payload[1].value}°{unit === 'celsius' ? 'C' : 'F'}
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
        <h3 className="chart-title">Temperature Trend</h3>
        <div className="chart-stats">
          <div className="stat-item">
            <div className="stat-label">Average</div>
            <div className="stat-value">{avgTemp}°{unit === 'celsius' ? 'C' : 'F'}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Min</div>
            <div className="stat-value min-temp">{minTemp}°{unit === 'celsius' ? 'C' : 'F'}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Max</div>
            <div className="stat-value max-temp">{maxTemp}°{unit === 'celsius' ? 'C' : 'F'}</div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.1)"
            vertical={false}
          />

          {/* X Axis with improved formatting */}
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

          {/* Y Axis with better domain */}
          <YAxis
            stroke="rgba(255,255,255,0.7)"
            fontSize={12}
            domain={yDomain}
            tick={{ fill: 'rgba(255,255,255,0.8)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            tickFormatter={(value) => `${value}°`}
            width={40}
          />

          {/* Reference line for average temperature */}
          <ReferenceLine
            y={avgTemp}
            stroke="rgba(255,255,255,0.4)"
            strokeDasharray="3 3"
            label={{
              value: `Avg: ${avgTemp}°`,
              position: 'right',
              fill: 'rgba(255,255,255,0.7)',
              fontSize: 12
            }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: '10px',
              color: 'white'
            }}
          />

          {/* Temperature line */}
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#FF6B6B"
            strokeWidth={3}
            dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, fill: '#FF5252', stroke: 'white', strokeWidth: 2 }}
            name={`Temperature (°${unit === 'celsius' ? 'C' : 'F'})`}
          />

          {/* Feels like line */}
          <Line
            type="monotone"
            dataKey="feelsLike"
            stroke="#4ECDC4"
            strokeWidth={2}
            strokeDasharray="4 2"
            dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 2 }}
            activeDot={{ r: 5, fill: '#26A69A', stroke: 'white', strokeWidth: 2 }}
            name={`Feels Like (°${unit === 'celsius' ? 'C' : 'F'})`}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Chart Legend Explanation */}
      <div className="chart-explanation">
        <p>📈 <strong>Solid line</strong> shows actual temperature</p>
        <p>📊 <strong>Dashed line</strong> shows "feels like" temperature</p>
        <p>📅 <strong>Dotted line</strong> shows average temperature across the period</p>
      </div>
    </div>
  )
}

export default TemperatureChart