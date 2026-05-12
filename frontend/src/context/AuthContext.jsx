import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🔥 TEMP FIX: direct loading false (UI ko force show karega)
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    api
      .get('/api/auth/me')
      .then((res) => {
        console.log("User data:", res.data) // debug
        setUser({ ...res.data, token })
      })
      .catch((err) => {
        console.error("Auth error:", err) // 🔥 important debug
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      })
      .finally(() => {
        setLoading(false) // 🔥 always stop loading
      })
  }, [token])

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser({ ...data, token: data.token })
    return data
  }

  const register = async (payload) => {
    const { data } = await api.post('/api/auth/register', payload)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser({ ...data, token: data.token })
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}