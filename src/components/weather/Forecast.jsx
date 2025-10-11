import React, { useState } from 'react'
import { convertTemperature, getWeatherIcon, formatDate, formatTime } from '../../utils/helpers'
import './Forecast.css'

const Forecast = ({ data, unit }) => {
  const [selectedDay, setSelectedDay] = useState(0)

  if (!data || data.length === 0) return null

  // Group forecast data by day
  const dailyForecasts = groupForecastsByDay(data)

  // Get hourly forecast for selected day
  const selectedDayForecasts = dailyForecasts[selectedDay] || []

  return (
    <div className="forecast-container">
      {/* Daily Forecast Header */}
      <div className="forecast-header">
        <h2>7-Day Forecast</h2>
        <div className="day-navigation">
          {dailyForecasts.map((day, index) => (
            <button
              key={index}
              className={`day-tab ${selectedDay === index ? 'day-tab-active' : ''}`}
              onClick={() => setSelectedDay(index)}
            >
              <div className="day-name">
                {index === 0 ? 'Today' : formatDate(day[0].dt_txt, { weekday: 'short' })}
              </div>
              <div className="day-date">
                {formatDate(day[0].dt_txt, { month: 'short', day: 'numeric' })}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Overview */}
      {selectedDayForecasts.length > 0 && (
        <div className="selected-day-overview">
          <div className="day-summary">
            <div className="day-temp-range">
              <span className="min-temp">
                {Math.round(convertTemperature(getDayMinTemp(selectedDayForecasts), unit))}°{unit === 'celsius' ? 'C' : 'F'}
              </span>
              <span className="temp-separator">→</span>
              <span className="max-temp">
                {Math.round(convertTemperature(getDayMaxTemp(selectedDayForecasts), unit))}°{unit === 'celsius' ? 'C' : 'F'}
              </span>
            </div>
            <div className="day-conditions">
              {getDominantCondition(selectedDayForecasts)}
            </div>
          </div>
        </div>
      )}

      {/* Hourly Forecast */}
      <div className="hourly-forecast">
        <h3>Hourly Forecast for {selectedDay === 0 ? 'Today' : formatDate(selectedDayForecasts[0]?.dt_txt, { weekday: 'long' })}</h3>
        <div className="hourly-scroll">
          {selectedDayForecasts.map((hour, index) => (
            <HourlyCard
              key={index}
              data={hour}
              unit={unit}
              isNow={selectedDay === 0 && index === 0}
            />
          ))}
        </div>
      </div>

      {/* Daily Forecast Summary */}
      <div className="daily-summary">
        <h3>Next 7 Days</h3>
        <div className="daily-cards">
          {dailyForecasts.map((day, index) => (
            <DailyCard
              key={index}
              day={day}
              unit={unit}
              isToday={index === 0}
              isSelected={selectedDay === index}
              onClick={() => setSelectedDay(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Hourly Forecast Card Component
const HourlyCard = ({ data, unit, isNow }) => {
  const time = new Date(data.dt_txt)
  const temp = Math.round(convertTemperature(data.main.temp, unit))
  const condition = data.weather[0].main

  return (
    <div className={`hourly-card ${isNow ? 'hourly-card-now' : ''}`}>
      <div className="hourly-time">
        {isNow ? 'Now' : formatTime(time)}
      </div>
      <div className="hourly-icon">
        {getWeatherIcon(condition)}
      </div>
      <div className="hourly-temp">
        {temp}°{unit === 'celsius' ? 'C' : 'F'}
      </div>
      <div className="hourly-details">
        <div className="hourly-pop">
          {data.pop > 0 ? `💧 ${Math.round(data.pop * 100)}%` : ''}
        </div>
        <div className="hourly-wind">
          💨 {data.wind.speed}m/s
        </div>
      </div>
    </div>
  )
}

// Daily Forecast Card Component
const DailyCard = ({ day, unit, isToday, isSelected, onClick }) => {
  const date = new Date(day[0].dt_txt)
  const minTemp = Math.round(convertTemperature(getDayMinTemp(day), unit))
  const maxTemp = Math.round(convertTemperature(getDayMaxTemp(day), unit))
  const dominantCondition = getDominantCondition(day)

  return (
    <div
      className={`daily-card ${isSelected ? 'daily-card-selected' : ''}`}
      onClick={onClick}
    >
      <div className="daily-date">
        {isToday ? 'Today' : formatDate(date, { weekday: 'short' })}
        <div className="daily-full-date">
          {formatDate(date, { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <div className="daily-icon">
        {getWeatherIcon(dominantCondition)}
      </div>
      <div className="daily-temps">
        <span className="daily-max">{maxTemp}°{unit === 'celsius' ? 'C' : 'F'}</span>
        <span className="daily-min">{minTemp}°{unit === 'celsius' ? 'C' : 'F'}</span>
      </div>
      <div className="daily-condition">
        {dominantCondition}
      </div>
      <div className="daily-stats">
        <span className="daily-pop">💧 {Math.round(getAveragePrecipitation(day) * 100)}%</span>
        <span className="daily-wind">💨 {Math.round(getAverageWind(day))}m/s</span>
      </div>
    </div>
  )
}

// Helper functions
function groupForecastsByDay(forecastData) {
  const days = {}

  forecastData.forEach(item => {
    const date = new Date(item.dt_txt)
    const dayKey = date.toDateString()

    if (!days[dayKey]) {
      days[dayKey] = []
    }

    days[dayKey].push(item)
  })

  return Object.values(days).slice(0, 7) // Return up to 7 days
}

function getDayMinTemp(dayForecasts) {
  return Math.min(...dayForecasts.map(item => item.main.temp_min))
}

function getDayMaxTemp(dayForecasts) {
  return Math.max(...dayForecasts.map(item => item.main.temp_max))
}

function getDominantCondition(dayForecasts) {
  const conditionCounts = {}
  dayForecasts.forEach(item => {
    const condition = item.weather[0].main
    conditionCounts[condition] = (conditionCounts[condition] || 0) + 1
  })

  return Object.keys(conditionCounts).reduce((a, b) =>
    conditionCounts[a] > conditionCounts[b] ? a : b
  )
}

function getAveragePrecipitation(dayForecasts) {
  const pops = dayForecasts.map(item => item.pop || 0)
  return pops.reduce((a, b) => a + b, 0) / pops.length
}

function getAverageWind(dayForecasts) {
  const winds = dayForecasts.map(item => item.wind.speed)
  return winds.reduce((a, b) => a + b, 0) / winds.length
}

export default Forecast