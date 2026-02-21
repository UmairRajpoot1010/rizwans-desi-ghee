'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth.service.js'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      setLoading(false)
      return
    }
    authService.getCurrentAdmin()
      .then((res) => {
        const payload = res?.data
        if (payload?.success && payload?.data) {
          setAdmin(payload.data)
        } else {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminUser')
        }
      })
      .catch(() => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const payload = response?.data
      const data = payload?.data
      if (!payload?.success || !data?.token || !data?.admin) {
        return { success: false, error: payload?.message ?? 'Login failed' }
      }
      localStorage.setItem('adminToken', data.token)
      setAdmin(data.admin)
      return { success: true }
    } catch (error) {
      const msg = error?.response?.data?.message ?? error?.message ?? 'Login failed'
      return { success: false, error: msg }
    }
  }

  const logout = () => {
    authService.logout()
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
