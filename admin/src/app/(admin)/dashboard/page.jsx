'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminApi } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
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
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: '🛒', route: '/admin/orders' },
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: '📦', route: '/admin/products' },
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: '👥', route: '/admin/users' },
    { label: 'Revenue (COD)', value: `₹${Number(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💰', route: '/admin/orders' },
  ]

  return (
    <div className="dashboard-stats">
      {cards.map((card) => (
        <div 
          key={card.label} 
          className="stat-card"
          onClick={() => router.push(card.route)}
          style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = ''
          }}
        >
          <span className="stat-icon">{card.icon}</span>
          <h3>{card.label}</h3>
          <p className="stat-value">{card.value}</p>
        </div>
      ))}
    </div>
  )
}
