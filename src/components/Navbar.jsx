import React, { useState } from 'react'
import './Navbar.css'

const Navbar = ({
  unit,
  onUnitToggle,
  onViewChange,
  currentView,
  locationName
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { id: 'current', label: 'Current', icon: '☀️' },
    { id: 'forecast', label: 'Forecast', icon: '📅' },
    { id: 'charts', label: 'Charts', icon: '📊' },
    { id: 'alerts', label: 'Alerts', icon: '⚠️' }
  ]

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo/Brand */}
        <div className="nav-brand">
          <span className="brand-icon">🌤️</span>
          <span className="brand-text">WeatherPro</span>
        </div>

        {/* Location Display */}
        {locationName && (
          <div className="nav-location">
            <span className="location-icon">📍</span>
            <span className="location-text">{locationName}</span>
          </div>
        )}

        {/* Navigation Links */}
        <div className={`nav-links ${isMenuOpen ? 'nav-links-active' : ''}`}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-link ${currentView === item.id ? 'nav-link-active' : ''}`}
              onClick={() => {
                onViewChange(item.id)
                setIsMenuOpen(false)
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Side Controls */}
        <div className="nav-controls">
          {/* Unit Toggle */}
          <button
            className="unit-toggle-btn"
            onClick={onUnitToggle}
            title={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
          >
            °{unit === 'celsius' ? 'C' : 'F'}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`hamburger ${isMenuOpen ? 'hamburger-active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar