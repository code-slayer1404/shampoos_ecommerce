import { createContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, AuthUser } from '../services/authService'
import { registerAuthTokenGetter, registerUnauthorizedHandler } from '../services/api'

const AUTH_STORAGE_KEY = 'admin_auth'

interface AuthContextValue {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      setToken(parsed.token || null)
      setUser(parsed.user || null)
    }
    setIsLoading(false)
  }, [])

  const persistAuth = (nextToken: string | null, nextUser: AuthUser | null) => {
    setToken(nextToken)
    setUser(nextUser)
    if (nextToken && nextUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }))
      return
    }
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const logout = () => {
    persistAuth(null, null)
    navigate('/admin/login', { replace: true })
  }

  useEffect(() => {
    registerAuthTokenGetter(() => token)
    registerUnauthorizedHandler(logout)
  }, [token])

  const login = async (email: string, password: string) => {
    const response = await authService.adminLogin({ email, password })
    persistAuth(response.token, response.user)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
