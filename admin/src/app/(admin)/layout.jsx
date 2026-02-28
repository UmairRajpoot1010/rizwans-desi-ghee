'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useNewOrdersCount } from '@/hooks/useNewOrdersCount'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/products', label: 'Products', icon: '📦' },
  { href: '/orders', label: 'Orders', icon: '🛒', badgeKey: 'orders' },
  { href: '/users', label: 'Users', icon: '👥' },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { admin, loading, logout, isAuthenticated } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pendingCount, showNewOrderToast, dismissToast } = useNewOrdersCount()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="admin-layout">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Rizwan&apos;s Ghee</h2>
          <span className="sidebar-subtitle">Admin Panel</span>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badgeKey === 'orders' && pendingCount > 0 && (
                <span className="nav-badge" aria-label={`${pendingCount} new order${pendingCount !== 1 ? 's' : ''}`}>
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="admin-info">
            <span className="admin-email">{admin?.email}</span>
          </div>
          <button type="button" className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-header">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <h1 className="page-title">
            {navItems.find((i) => i.href === pathname)?.label || 'Admin'}
          </h1>
        </header>
        <div className="admin-content">{children}</div>
      </main>

      {/* New order notification toast */}
      {showNewOrderToast && (
        <div className="new-order-toast" role="alert">
          <span className="new-order-toast-icon">✓</span>
          <span className="new-order-toast-text">
            New order placed! {pendingCount} pending order{pendingCount !== 1 ? 's' : ''} need attention.
          </span>
          <button
            type="button"
            className="new-order-toast-close"
            onClick={dismissToast}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
