import { createContext, useContext, useMemo, useState } from 'react'
import { loginRequest, registerRequest } from '../api/authApi'

const AuthContext = createContext(null)

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

/** Read saved user from localStorage (survives page refresh). */
function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Optional helper: decode the JWT payload (middle part) without a library.
 * We mainly trust the login response; this is a fallback / interview talking point.
 */
export function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

/**
 * Provides token + user info to the whole app.
 * Wrap the router with <AuthProvider> in main.jsx / App.jsx.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => readStoredUser())

  const persistAuth = (authResponse) => {
    const nextUser = {
      userId: authResponse.userId,
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role,
      employeeId: authResponse.employeeId,
    }
    localStorage.setItem(TOKEN_KEY, authResponse.token)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setToken(authResponse.token)
    setUser(nextUser)
  }

  const login = async (email, password) => {
    const { data } = await loginRequest(email, password)
    persistAuth(data)
    return data
  }

  const register = async (payload) => {
    const { data } = await registerRequest(payload)
    persistAuth(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Hook used by pages/components: const { user, login } = useAuth() */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
