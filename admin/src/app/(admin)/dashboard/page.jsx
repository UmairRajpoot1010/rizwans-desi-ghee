'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminApi
      .getStats()
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setStats(res.data.data)
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-state">Loading dashboard...</div>
  if (error) return <div className="error-state">{error}</div>

  const cards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: '🛒' },
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: '📦' },
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: '👥' },
    { label: 'Revenue (COD)', value: `₹${Number(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💰' },
  ]

  return (
    <div className="dashboard-stats">
      {cards.map((card) => (
        <div key={card.label} className="stat-card">
          <span className="stat-icon">{card.icon}</span>
          <h3>{card.label}</h3>
          <p className="stat-value">{card.value}</p>
        </div>
      ))}
    </div>
  )
}
