import axios from 'axios'

/**
 * Shared Axios instance for all API calls.
 *
 * - baseURL comes from VITE_API_URL (see frontend/.env.example)
 * - Every request gets Authorization: Bearer <token> when a token exists
 * - On HTTP 401 we clear auth storage and send the user to /login
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Runs before each request leaves the browser.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Runs after each response (or error) comes back.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Full page redirect avoids React Router circular imports in this small file.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default axiosClient
