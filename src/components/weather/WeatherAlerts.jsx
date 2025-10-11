import React from 'react'
import './WeatherAlerts.css'

const WeatherAlerts = ({ data, detailed = false }) => {
  if (!data || data.length === 0) return null

  // Check for extreme weather conditions
  const alerts = []

  // Temperature alerts
  const extremeTemp = data.some(item => item.main.temp > 35 || item.main.temp < -10)
  if (extremeTemp) {
    alerts.push({
      type: 'temp',
      level: 'high',
      title: 'Extreme Temperature',
      message: 'Temperatures are outside normal ranges. Take precautions.',
      icon: '🌡️',
      instructions: [
        'Stay hydrated and avoid prolonged exposure',
        'Wear appropriate clothing',
        'Check on vulnerable individuals'
      ]
    })
  }

  // Heavy rain alerts
  const heavyRain = data.some(item =>
    item.weather[0].main === 'Rain' &&
    (item.rain?.['3h'] > 10 || item.rain?.['1h'] > 10)
  )
  if (heavyRain) {
    alerts.push({
      type: 'rain',
      level: 'medium',
      title: 'Heavy Rainfall',
      message: 'Significant rainfall expected. Flooding possible.',
      icon: '🌧️',
      instructions: [
        'Avoid low-lying areas',
        'Use caution while driving',
        'Have umbrella and waterproof gear ready'
      ]
    })
  }

  // High wind alerts
  const highWind = data.some(item => item.wind.speed > 8)
  if (highWind) {
    alerts.push({
      type: 'wind',
      level: 'medium',
      title: 'High Wind Conditions',
      message: 'Strong winds expected. Secure loose objects.',
      icon: '💨',
      instructions: [
        'Secure outdoor furniture',
        'Be cautious when driving',
        'Watch for falling branches'
      ]
    })
  }

  // Thunderstorm alerts
  const thunderstorm = data.some(item => item.weather[0].main === 'Thunderstorm')
  if (thunderstorm) {
    alerts.push({
      type: 'storm',
      level: 'high',
      title: 'Thunderstorm Warning',
      message: 'Thunderstorms in the area. Lightning risk present.',
      icon: '⛈️',
      instructions: [
        'Seek indoor shelter',
        'Avoid open fields and water',
        'Unplug sensitive electronics'
      ]
    })
  }

  // Snow alerts
  const heavySnow = data.some(item =>
    item.weather[0].main === 'Snow' &&
    (item.snow?.['3h'] > 5 || item.snow?.['1h'] > 2)
  )
  if (heavySnow) {
    alerts.push({
      type: 'snow',
      level: 'medium',
      title: 'Snowfall Alert',
      message: 'Significant snowfall expected. Travel may be affected.',
      icon: '❄️',
      instructions: [
        'Allow extra travel time',
        'Check road conditions',
        'Dress in warm layers'
      ]
    })
  }

  // Low visibility alerts
  const lowVisibility = data.some(item => item.visibility < 2000)
  if (lowVisibility) {
    alerts.push({
      type: 'fog',
      level: 'low',
      title: 'Low Visibility',
      message: 'Reduced visibility conditions.',
      icon: '🌫️',
      instructions: [
        'Use low beam headlights',
        'Reduce driving speed',
        'Increase following distance'
      ]
    })
  }

  if (alerts.length === 0 && !detailed) return null

  return (
    <div className="weather-alerts">
      <div className="alerts-header">
        <h3>⚠️ Weather Alerts</h3>
        <span className="alerts-count">{alerts.length} active</span>
      </div>

      {alerts.length > 0 ? (
        <div className="alerts-list">
          {alerts.map((alert, index) => (
            <AlertCard
              key={index}
              alert={alert}
              detailed={detailed}
            />
          ))}
        </div>
      ) : (
        <div className="no-alerts">
          <div className="no-alerts-icon">✅</div>
          <div className="no-alerts-message">
            <h4>No Active Alerts</h4>
            <p>All weather conditions are within normal ranges.</p>
          </div>
        </div>
      )}

      {detailed && (
        <div className="alerts-info">
          <p>Weather alerts help you stay informed about potentially dangerous conditions.</p>
        </div>
      )}
    </div>
  )
}

const AlertCard = ({ alert, detailed }) => {
  return (
    <div className={`alert-card alert-${alert.type} alert-level-${alert.level}`}>
      <div className="alert-header">
        <div className="alert-icon">{alert.icon}</div>
        <div className="alert-title">
          <h4>{alert.title}</h4>
          <span className="alert-level">{getLevelText(alert.level)}</span>
        </div>
      </div>

      <div className="alert-message">
        {alert.message}
      </div>

      {detailed && alert.instructions && (
        <div className="alert-instructions">
          <h5>Recommended Actions:</h5>
          <ul>
            {alert.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="alert-footer">
        <span className="alert-time">Updated just now</span>
      </div>
    </div>
  )
}

function getLevelText(level) {
  const levels = {
    low: 'Low Risk',
    medium: 'Moderate Risk',
    high: 'High Risk'
  }
  return levels[level] || 'Alert'
}

export default WeatherAlerts