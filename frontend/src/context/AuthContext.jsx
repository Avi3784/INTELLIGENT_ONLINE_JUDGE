import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, getMe } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // On mount, verify any stored token and restore the user session
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          const response = await getMe()
          setUser(response.data.data || response.data.user || response.data)
          setToken(storedToken)
        } catch (error) {
          console.error('Session restoration failed:', error)
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    restoreSession()
  }, [])

  const login = async (email, password) => {
    const response = await loginUser({ email, password })
    const data = response.data

    // Backend may return token/user in different response shapes
    const newToken = data.token || data.data?.token
    const userData = data.user || data.data?.user || data.data

    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
  }

  const register = async (username, email, password) => {
    const response = await registerUser({ username, email, password })
    const data = response.data

    const newToken = data.token || data.data?.token
    const userData = data.user || data.data?.user || data.data

    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
