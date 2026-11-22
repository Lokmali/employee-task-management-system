import axiosClient from './axiosClient'

/** POST /api/auth/login */
export function loginRequest(email, password) {
  return axiosClient.post('/api/auth/login', { email, password })
}

/** POST /api/auth/register */
export function registerRequest(payload) {
  return axiosClient.post('/api/auth/register', payload)
}
