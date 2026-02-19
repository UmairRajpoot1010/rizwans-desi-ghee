'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/products', label: 'Products', icon: '📦' },
  { href: '/orders', label: 'Orders', icon: '🛒' },
  { href: '/users', label: 'Users', icon: '👥' },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { admin, loading, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [loading, isAuthenticated, router])

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
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Rizwan&apos;s Ghee</h2>
          <span className="sidebar-subtitle">Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
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
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="page-title">
            {navItems.find((i) => i.href === pathname)?.label || 'Admin'}
          </h1>
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  )
}
