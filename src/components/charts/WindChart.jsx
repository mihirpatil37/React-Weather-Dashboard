import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts'
import './Charts.css'

const WindChart = ({ data }) => {
  const chartData = data.map((item, index) => ({
    time: new Date(item.dt_txt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }),
    day: new Date(item.dt_txt).toLocaleDateString('en-US', {
      weekday: 'short'
    }),
    fullTime: new Date(item.dt_txt).toLocaleString(),
    windSpeed: Math.round(item.wind.speed * 10) / 10, // 1 decimal place
    windGust: item.wind.gust ? Math.round(item.wind.gust * 10) / 10 : 0,
    windDirection: item.wind.deg || 0
  }))

  const avgWind = (chartData.reduce((sum, item) => sum + item.windSpeed, 0) / chartData.length).toFixed(1)
  const maxWind = Math.max(...chartData.map(item => item.windSpeed))
  const maxGust = Math.max(...chartData.map(item => item.windGust))

  // Wind speed categories for reference areas
  const getWindCategory = (speed) => {
    if (speed < 0.5) return { name: 'Calm', color: 'rgba(76, 205, 196, 0.1)' }
    if (speed < 5) return { name: 'Light Breeze', color: 'rgba(255, 230, 109, 0.1)' }
    if (speed < 10) return { name: 'Moderate', color: 'rgba(255, 158, 109, 0.1)' }
    return { name: 'Strong', color: 'rgba(255, 107, 107, 0.1)' }
  }

  // Custom X-axis tick formatter
  const formatXAxis = (tickItem, index) => {
    if (index === 0 || index === chartData.length - 1 || index % 4 === 0) {
      return tickItem
    }
    return ''
  }

  // Custom tooltip for wind
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const windCategory = getWindCategory(data.windSpeed)

      return (
        <div className="custom-tooltip">
          <p className="tooltip-time">{data.fullTime}</p>
          <p className="tooltip-item">
            <span className="tooltip-label">Wind Speed: </span>
            <span className="tooltip-value wind-value">
              {data.windSpeed} m/s
            </span>
          </p>
          {data.windGust > 0 && (
            <p className="tooltip-item">
              <span className="tooltip-label">Wind Gust: </span>
              <span className="tooltip-value gust-value">
                {data.windGust} m/s
              </span>
            </p>
          )}
          <p className="tooltip-item">
            <span className="tooltip-label">Wind Direction: </span>
            <span className="tooltip-value">
              {getWindDirectionText(data.windDirection)}
            </span>
          </p>
          <p className="tooltip-item">
            <span className="tooltip-label">Category: </span>
            <span className="tooltip-value" style={{ color: windCategory.color.replace('0.1', '0.8') }}>
              {windCategory.name}
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  // Helper function to get wind direction text
  const getWindDirectionText = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Wind Speed Trend</h3>
        <div className="chart-stats">
          <div className="stat-item">
            <div className="stat-label">Avg Speed</div>
            <div className="stat-value">{avgWind} m/s</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Max Speed</div>
            <div className="stat-value max-wind">{maxWind} m/s</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Max Gust</div>
            <div className="stat-value max-gust">{maxGust} m/s</div>
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

          {/* Wind speed reference areas */}
          <ReferenceArea y1={10} y2={20} fill="rgba(255, 107, 107, 0.1)" />
          <ReferenceArea y1={5} y2={10} fill="rgba(255, 158, 109, 0.1)" />
          <ReferenceArea y1={0.5} y2={5} fill="rgba(255, 230, 109, 0.1)" />
          <ReferenceArea y1={0} y2={0.5} fill="rgba(76, 205, 196, 0.1)" />

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
            domain={[0, 'dataMax + 2']}
            tick={{ fill: 'rgba(255,255,255,0.8)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            tickFormatter={(value) => `${value} m/s`}
            width={50}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: '10px',
              color: 'white'
            }}
          />

          {/* Wind speed line */}
          <Line
            type="monotone"
            dataKey="windSpeed"
            stroke="#FFE66D"
            strokeWidth={3}
            dot={{ fill: '#FFE66D', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, fill: '#FFD166', stroke: 'white', strokeWidth: 2 }}
            name="Wind Speed (m/s)"
          />

          {/* Wind gust line */}
          <Line
            type="monotone"
            dataKey="windGust"
            stroke="#FF9E6D"
            strokeWidth={2}
            strokeDasharray="4 2"
            dot={{ fill: '#FF9E6D', strokeWidth: 2, r: 2, display: (data) => data.windGust > 0 ? 'block' : 'none' }}
            activeDot={{ r: 5, fill: '#FF8A65', stroke: 'white', strokeWidth: 2 }}
            name="Wind Gust (m/s)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Wind Speed Guide */}
      <div className="wind-guide">
        <div className="guide-title">Wind Speed Categories:</div>
        <div className="guide-items">
          <div className="guide-item">
            <span className="color-area" style={{ backgroundColor: 'rgba(76, 205, 196, 0.3)' }}></span>
            <span>Calm (0-0.5 m/s)</span>
          </div>
          <div className="guide-item">
            <span className="color-area" style={{ backgroundColor: 'rgba(255, 230, 109, 0.3)' }}></span>
            <span>Light Breeze (0.5-5 m/s)</span>
          </div>
          <div className="guide-item">
            <span className="color-area" style={{ backgroundColor: 'rgba(255, 158, 109, 0.3)' }}></span>
            <span>Moderate (5-10 m/s)</span>
          </div>
          <div className="guide-item">
            <span className="color-area" style={{ backgroundColor: 'rgba(255, 107, 107, 0.3)' }}></span>
            <span>Strong (10+ m/s)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WindChart