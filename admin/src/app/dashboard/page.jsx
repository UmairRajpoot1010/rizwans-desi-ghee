'use client'

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p>$0</p>
        </div>
      </div>
    </main>
  )
}
