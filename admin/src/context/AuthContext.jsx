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

  const logoutRef = useCallback(() => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setAdmin(null)
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }, [])

  const initAuth = useCallback(async () => {
    const stored = loadStoredAuth()
    if (!stored) {
      setLoading(false)
      return
    }
    try {
      const res = await adminApi.getMe()
      const payload = res?.data
      const data = payload?.data
      if (!payload?.success || !data) {
        logoutRef()
        return
      }
      const role = (data.role || '').toLowerCase()
      if (role !== 'admin' && role !== 'superadmin') {
        logoutRef()
        return
      }
      setAdmin(data)
      localStorage.setItem('adminUser', JSON.stringify(data))
    } catch {
      logoutRef()
    } finally {
      setLoading(false)
    }
  }, [loadStoredAuth, logoutRef])

  useEffect(() => {
    initAuth()
  }, [initAuth])

  const login = async (email, password) => {
    try {
      const res = await adminApi.login(email, password)
      const payload = res?.data
      const data = payload?.data

      console.log('Login Response:', { success: payload?.success, role: data?.admin?.role })

      if (!payload?.success || !data?.token || !data?.admin) {
        return { success: false, message: payload?.message ?? 'Login failed' }
      }

      const role = String(data.admin?.role || '').toLowerCase()
      if (role !== 'admin' && role !== 'superadmin') {
        console.error('Access Denied: Invalid role', role)
        return { success: false, message: 'Access denied. Admin or superadmin role required.' }
      }

      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminUser', JSON.stringify(data.admin))
      setAdmin(data.admin)
      return { success: true }
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Login failed'
      return { success: false, message: msg }
    }
  }

  const logout = logoutRef

  const isAuthenticated = !!admin && (admin.role === 'admin' || admin.role === 'superadmin')

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
