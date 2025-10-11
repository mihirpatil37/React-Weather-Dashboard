import React from 'react'
import { convertTemperature, getWeatherIcon, formatTime, getWindDirection, calculateDewPoint } from '../../utils/helpers'
import './CurrentWeather.css'

const CurrentWeather = ({ data, unit }) => {
  if (!data) return null

  const current = data
  const weather = current.weather[0]

  // Convert temperatures based on unit
  const temp = Math.round(convertTemperature(current.main.temp, unit))
  const feelsLike = Math.round(convertTemperature(current.main.feels_like, unit))
  const tempMin = Math.round(convertTemperature(current.main.temp_min, unit))
  const tempMax = Math.round(convertTemperature(current.main.temp_max, unit))

  // Calculate sunrise/sunset times
  const sunrise = new Date(current.sys.sunrise * 1000)
  const sunset = new Date(current.sys.sunset * 1000)

  // Weather metrics
  const metrics = [
    {
      label: 'Feels Like',
      value: `${feelsLike}°${unit === 'celsius' ? 'C' : 'F'}`,
      icon: '🌡️'
    },
    {
      label: 'Humidity',
      value: `${current.main.humidity}%`,
      icon: '💧'
    },
    {
      label: 'Wind',
      value: `${current.wind.speed} m/s`,
      icon: '💨',
      details: current.wind.deg ? `(${getWindDirection(current.wind.deg)})` : ''
    },
    {
      label: 'Pressure',
      value: `${current.main.pressure} hPa`,
      icon: '📊'
    },
    {
      label: 'Visibility',
      value: `${(current.visibility / 1000).toFixed(1)} km`,
      icon: '👁️'
    },
    {
      label: 'Cloudiness',
      value: `${current.clouds.all}%`,
      icon: '☁️'
    },
    {
      label: 'Sunrise',
      value: formatTime(sunrise),
      icon: '🌅'
    },
    {
      label: 'Sunset',
      value: formatTime(sunset),
      icon: '🌇'
    }
  ]

  // Additional details
  const additionalDetails = [
    {
      label: 'Min/Max Temp',
      value: `${tempMin}° / ${tempMax}°${unit === 'celsius' ? 'C' : 'F'}`
    },
    {
      label: 'Wind Gust',
      value: current.wind.gust ? `${current.wind.gust} m/s` : 'N/A'
    },
    {
      label: 'UV Index',
      value: 'Moderate'
    },
    {
      label: 'Dew Point',
      value: `${Math.round(calculateDewPoint(current.main.temp, current.main.humidity))}°C`
    }
  ]

  return (
    <div className="current-weather-detailed">
      {/* Main Weather Card */}
      <div className="weather-main-card">
        <div className="weather-header">
          <div className="location-info">
            <h2 className="location-name">{current.name}, {current.sys.country}</h2>
            <p className="current-date">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="weather-icon-large">
            <span className="weather-emoji">{getWeatherIcon(weather.main)}</span>
            <p className="weather-description">{weather.description}</p>
          </div>
        </div>

        <div className="temperature-section">
          <div className="current-temp">
            {temp}°<span className="temp-unit">{unit === 'celsius' ? 'C' : 'F'}</span>
          </div>
          <div className="temp-feels-like">
            Feels like {feelsLike}°{unit === 'celsius' ? 'C' : 'F'}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="metric-icon">{metric.icon}</div>
              <div className="metric-info">
                <div className="metric-label">{metric.label}</div>
                <div className="metric-value">{metric.value}</div>
                {metric.details && (
                  <div className="metric-details">{metric.details}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Details */}
      <div className="additional-details">
        <h3>Weather Details</h3>
        <div className="details-grid">
          {additionalDetails.map((detail, index) => (
            <div key={index} className="detail-item">
              <span className="detail-label">{detail.label}</span>
              <span className="detail-value">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Condition Insights */}
      <div className="weather-insights">
        <h3>Weather Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <span className="insight-icon">👕</span>
            <div className="insight-content">
              <h4>What to Wear</h4>
              <p>{getClothingRecommendation(temp, weather.main)}</p>
            </div>
          </div>
          <div className="insight-card">
            <span className="insight-icon">🌡️</span>
            <div className="insight-content">
              <h4>Temperature Trend</h4>
              <p>{getTemperatureTrend(temp, tempMin, tempMax)}</p>
            </div>
          </div>
          <div className="insight-card">
            <span className="insight-icon">💨</span>
            <div className="insight-content">
              <h4>Wind Conditions</h4>
              <p>{getWindDescription(current.wind.speed)}</p>
            </div>
          </div>
          <div className="insight-card">
            <span className="insight-icon">👁️</span>
            <div className="insight-content">
              <h4>Visibility</h4>
              <p>{getVisibilityDescription(current.visibility)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  function getClothingRecommendation(temp, condition) {
    if (condition === 'Rain') return 'Waterproof jacket and umbrella recommended'
    if (temp < 0) return 'Heavy winter coat, gloves, and hat'
    if (temp < 10) return 'Warm jacket and layers'
    if (temp < 20) return 'Light jacket or sweater'
    if (temp < 30) return 'T-shirt and comfortable clothing'
    return 'Light, breathable clothing. Stay hydrated!'
  }

  function getTemperatureTrend(currentTemp, minTemp, maxTemp) {
    const avgTemp = (minTemp + maxTemp) / 2
    if (currentTemp > avgTemp + 2) return 'Warmer than average for this time'
    if (currentTemp < avgTemp - 2) return 'Cooler than average for this time'
    return 'Typical temperatures for this season'
  }

  function getWindDescription(speed) {
    if (speed < 0.5) return 'Calm conditions'
    if (speed < 5) return 'Light breeze'
    if (speed < 10) return 'Moderate wind'
    if (speed < 15) return 'Strong wind'
    return 'Very strong wind, be cautious outdoors'
  }

  function getVisibilityDescription(visibility) {
    if (visibility > 10000) return 'Excellent visibility'
    if (visibility > 5000) return 'Good visibility'
    if (visibility > 2000) return 'Moderate visibility'
    return 'Poor visibility, drive carefully'
  }
}

export default CurrentWeather