const API_KEY = '472aa6b358b3e2a44134cdd9ca6a09c3'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'API request failed')
  }
  return response.json()
}

export const weatherAPI = {
  getByCity: async (city) => {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    )
    return handleResponse(response)
  },

  getForecast: async (city, days = 5) => {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    )
    const data = await handleResponse(response)
    return data.list.slice(0, days * 8)
  },

  getByCoords: async (lat, lon) => {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    )
    return handleResponse(response)
  },

  getForecastByCoords: async (lat, lon, days = 5) => {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    )
    const data = await handleResponse(response)
    return data.list.slice(0, days * 8)
  },

  getAddressFromCoords: async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
      )
      if (!response.ok) throw new Error('Failed to fetch address')
      const data = await response.json()

      if (data.address) {
        const { city, town, village, county, state, country } = data.address
        const locationName = city || town || village || county
        return [locationName, state, country].filter(Boolean).join(', ')
      }
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    } catch (error) {
      // Fallback to OpenWeatherMap geocoding
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
        )
        const data = await response.json()
        if (data.length > 0) {
          const location = data[0]
          const addressParts = []
          if (location.name) addressParts.push(location.name)
          if (location.state) addressParts.push(location.state)
          if (location.country) addressParts.push(location.country)
          return addressParts.join(', ')
        }
        return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
      } catch {
        return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
      }
    }
  }
}