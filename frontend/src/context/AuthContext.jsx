import React, { createContext, useState, useContext, useEffect } from 'react'
import {authService} from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    if (!authService.isAuthenticated()) {
      setLoading(false)
      return
    }

    try {
      // Try to get current user from localStorage first
      const storedUser = authService.getCurrentUser()
      if (storedUser) {
        setUser(storedUser)
      }

      // Then fetch fresh profile data
      const profileData = await authService.getProfile()
      if (profileData.success) {
        setUser(profileData.data)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear invalid tokens
      await authService.logout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      
      // Get user from response - the EmailLoginView returns user data
      if (response.data && response.data.user) {
        setUser(response.data.user)
      } else if (response.data) {
        // If user not in response, store what we have and try to fetch profile
        const storedUser = authService.getCurrentUser()
        if (storedUser) {
          setUser(storedUser)
        }
      }
      
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (userData) => {
    const response = await authService.register(userData)
    
    // If registration includes auto-login
    if (response.status === 201 && response.data.user) {
      setUser(response.data.user)
      
      // If tokens are provided, user is auto-logged in
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access)
        localStorage.setItem('refresh_token', response.data.refresh)
      }
    }
    
    return response
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const updateProfile = async (profileData) => {
    const response = await authService.updateProfile(profileData)
    if (response.success) {
      setUser(response.data)
    }
    return response
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
    isAuthenticated: authService.isAuthenticated(),
    refreshUser: checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}