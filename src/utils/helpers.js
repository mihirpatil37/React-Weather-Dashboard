// Temperature conversion
export const convertTemperature = (temp, unit) => {
  if (unit === 'fahrenheit') {
    return (temp * 9/5) + 32
  }
  return temp
}

// Format date with options
export const formatDate = (timestamp, options = {}) => {
  const date = new Date(timestamp)
  const defaultOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options })
}

// Format time
export const formatTime = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Get weather icon
export const getWeatherIcon = (condition) => {
  const icons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Snow: '❄️',
    Thunderstorm: '⛈️',
    Drizzle: '🌦️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️'
  }
  return icons[condition] || '🌤️'
}

// Group forecast by day
export const groupForecastsByDay = (forecastData) => {
  const days = {}

  forecastData.forEach(item => {
    const date = new Date(item.dt_txt)
    const dayKey = date.toDateString()

    if (!days[dayKey]) {
      days[dayKey] = []
    }

    days[dayKey].push(item)
  })

  return Object.values(days)
}

// Get wind direction from degrees
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Calculate dew point
export const calculateDewPoint = (temp, humidity) => {
  const a = 17.27
  const b = 237.7
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100)
  return (b * alpha) / (a - alpha)
}