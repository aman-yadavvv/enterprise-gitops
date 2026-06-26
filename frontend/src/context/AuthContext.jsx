import React, { createContext, useState, useEffect } from 'react'
import { getCurrentUser, isAuthenticated as checkAuthStatus, getUser, logout as logoutService } from '../services/authService'
import toast from 'react-hot-toast'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      if (checkAuthStatus()) {
        try {
          const storedUser = getUser()
          if (storedUser) {
            setUser(storedUser)
            setIsAuthenticated(true)
          }
          
          // Verify token with backend
          const response = await getCurrentUser()
          setUser(response.data.user)
          setIsAuthenticated(true)
          localStorage.setItem('user', JSON.stringify(response.data.user))
        } catch (error) {
          console.error('Failed to load user:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
          setIsAuthenticated(false)
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    await logoutService()
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}