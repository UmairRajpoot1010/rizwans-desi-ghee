'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadStoredAuth = useCallback(() => {
    if (typeof window === 'undefined') return null
    const token = localStorage.getItem('adminToken')
    const stored = localStorage.getItem('adminUser')
    if (token && stored) {
      try {
        return { token, admin: JSON.parse(stored) }
      } catch {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        return null
      }
    }
    return null
  }, [])

  const initAuth = useCallback(async () => {
    const stored = loadStoredAuth()
    if (!stored) {
      setLoading(false)
      return
    }
    try {
      const res = await adminApi.getMe()
      if (res.data?.success && res.data?.data) {
        setAdmin(res.data.data)
        localStorage.setItem('adminUser', JSON.stringify(res.data.data))
      } else {
        logout()
      }
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [loadStoredAuth])

  useEffect(() => {
    initAuth()
  }, [initAuth])

  const login = async (email, password) => {
    const res = await adminApi.login(email, password)
    const { data } = res.data
    if (data?.token && data?.admin) {
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminUser', JSON.stringify(data.admin))
      setAdmin(data.admin)
      return { success: true }
    }
    return { success: false, message: res.data?.message || 'Login failed' }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setAdmin(null)
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  const isAuthenticated = !!admin

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
