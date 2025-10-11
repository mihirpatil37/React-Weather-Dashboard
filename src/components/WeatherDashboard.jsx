import React, { useState } from 'react'
import { weatherAPI } from '../services/weatherAPI'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Navbar from './Navbar'
import LoadingSpinner from './LoadingSpinner'
import CurrentWeather from './weather/CurrentWeather'
import Forecast from './weather/Forecast'
import WeatherAlerts from './weather/WeatherAlerts'
import TemperatureChart from './charts/TemperatureChart'
import HumidityChart from './charts/HumidityChart'
import WindChart from './charts/WindChart'
import './WeatherDashboard.css'

const WeatherDashboard = () => {
  // State management
  const [searchInput, setSearchInput] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unit, setUnit] = useLocalStorage('weatherUnit', 'celsius')
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', [])
  const [currentView, setCurrentView] = useLocalStorage('currentView', 'current')
  const [address, setAddress] = useState('')

  // Search handler
  const handleSearch = async (city = searchInput) => {
    if (!city.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const [current, forecast] = await Promise.all([
        weatherAPI.getByCity(city),
        weatherAPI.getForecast(city, 5)
      ])
      
      setWeatherData(current)
      setForecastData(forecast)
      setAddress(current.name)
      
      // Add to search history
      addToHistory(city, current)
      
    } catch (err) {
      setError(err.message)
      setWeatherData(null)
      setForecastData(null)
    } finally {
      setLoading(false)
    }
  }

  // Location handler
  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    setError('')
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Get address first
          const locationAddress = await weatherAPI.getAddressFromCoords(latitude, longitude)
          setAddress(locationAddress)
          
          const [current, forecast] = await Promise.all([
            weatherAPI.getByCoords(latitude, longitude),
            weatherAPI.getForecastByCoords(latitude, longitude, 5)
          ])
          
          setWeatherData(current)
          setForecastData(forecast)
          addToHistory(locationAddress, current)
          
        } catch (err) {
          setError('Failed to get weather for your location')
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        setLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please allow location access.')
            break
          default:
            setError('Location unavailable. Please try again.')
        }
      },
      {
        timeout: 10000,
        enableHighAccuracy: true
      }
    )
  }

  // Search history management
  const addToHistory = (city, data) => {
    const newEntry = {
      city,
      timestamp: Date.now(),
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main
    }
    
    setSearchHistory(prev => {
      const filtered = prev.filter(item => 
        item.city.toLowerCase() !== city.toLowerCase()
      )
      return [newEntry, ...filtered].slice(0, 5)
    })
  }

  const clearHistory = () => {
    setSearchHistory([])
  }

  // Unit toggle handler
  const handleUnitToggle = () => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')
  }

  // View change handler
  const handleViewChange = (view) => {
    setCurrentView(view)
  }

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Render different views based on currentView state
  const renderCurrentView = () => {
    if (!weatherData || !forecastData) return null

    switch (currentView) {
      case 'current':
        return (
          <div className="view-content">
            <CurrentWeather data={weatherData} unit={unit} />
            <WeatherAlerts data={[weatherData, ...forecastData]} />
          </div>
        )
      
      case 'forecast':
        return (
          <div className="view-content">
            <Forecast data={forecastData} unit={unit} />
          </div>
        )
      
      case 'charts':
        return (
          <div className="view-content">
            <div className="charts-grid">
              <TemperatureChart data={forecastData} unit={unit} />
              <HumidityChart data={forecastData} />
              <WindChart data={forecastData} />
            </div>
          </div>
        )
      
      case 'alerts':
        return (
          <div className="view-content">
            <WeatherAlerts data={[weatherData, ...forecastData]} detailed />
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="weather-dashboard">
      {/* Navigation Bar */}
      <Navbar
        unit={unit}
        onUnitToggle={handleUnitToggle}
        onViewChange={handleViewChange}
        currentView={currentView}
        locationName={address}
      />

      <div className="dashboard-content">
        {/* Search Controls */}
        <div className="search-section">
          <div className="search-controls">
            <div className="search-group">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter city name..."
                className="search-input"
              />
              <button 
                onClick={() => handleSearch()} 
                disabled={loading || !searchInput.trim()}
                className="search-btn"
              >
                {loading ? '🔍 Searching...' : '🔍 Search'}
              </button>
              <button 
                onClick={handleLocation}
                disabled={loading}
                className="location-btn"
              >
                📍 My Location
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Main Content */}
        {weatherData && !loading && (
          <div className="main-content">
            {renderCurrentView()}
          </div>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="search-history">
            <div className="history-header">
              <h3>Recent Searches</h3>
              <button onClick={clearHistory} className="clear-history">
                Clear All
              </button>
            </div>
            <div className="history-list">
              {searchHistory.map((item, index) => (
                <div 
                  key={index} 
                  className="history-item"
                  onClick={() => {
                    setSearchInput(item.city)
                    handleSearch(item.city)
                  }}
                >
                  <div className="history-city">{item.city}</div>
                  <div className="history-details">
                    <span className="history-temp">
                      {unit === 'celsius' ? item.temp : Math.round((item.temp * 9/5) + 32)}°{unit === 'celsius' ? 'C' : 'F'}
                    </span>
                    <span className="history-condition">
                      {item.condition}
                    </span>
                    <span className="history-time">
                      {new Date(item.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Welcome Message when no data */}
        {!weatherData && !loading && (
          <div className="welcome-message">
            <h2>Welcome to WeatherPro</h2>
            <p>Search for a city or use your current location to get started!</p>
            <div className="feature-highlights">
              <div className="feature">
                <span className="feature-icon">🌡️</span>
                <span>Real-time Temperature</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Detailed Charts</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⚠️</span>
                <span>Weather Alerts</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📱</span>
                <span>Mobile Friendly</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherDashboard