'use client'

import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/products">Products</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/users">Users</Link>
      </nav>
    </aside>
  )
}
