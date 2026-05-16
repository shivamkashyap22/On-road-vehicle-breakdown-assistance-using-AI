import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

  const [token, setToken] = useState(
    localStorage.getItem('token')
  )

  const [user, setUser] = useState(
    token ? { token, role: 'USER' } : null
  )

  const [loading] = useState(false)

  // LOGIN
  const login = async (email, password) => {

    console.log("LOGIN SUCCESS")

    const fakeToken = "demo-token"

    localStorage.setItem('token', fakeToken)

    setToken(fakeToken)

    setUser({
      email,
      role: 'USER',
      token: fakeToken
    })

    return {
      email,
      role: 'USER',
      token: fakeToken
    }
  }

  // REGISTER
  const register = async (payload) => {

    const fakeToken = "demo-token"

    localStorage.setItem('token', fakeToken)

    setToken(fakeToken)

    setUser({
      ...payload,
      role: 'USER',
      token: fakeToken
    })

    return {
      ...payload,
      role: 'USER',
      token: fakeToken
    }
  }

  // LOGOUT
  const logout = () => {

    localStorage.removeItem('token')

    setToken(null)

    setUser(null)
  }

  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading
      }}
    >

      {children}

    </AuthContext.Provider>
  )
}

export function useAuth() {

  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    )
  }

  return ctx
}