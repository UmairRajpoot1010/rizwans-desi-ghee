'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminApi
      .getUsers()
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setUsers(res.data.data)
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await adminApi.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '-')

  if (loading) return <div className="loading-state">Loading users...</div>
  if (error) return <div className="error-state">{error}</div>

  return (
    <div className="users-page">
      {/* Desktop Table View */}
      <div className="table-container-desktop">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6}>No users found.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td><strong>{u.name || '-'}</strong></td>
                  <td>{u.email || '-'}</td>
                  <td>{u.phone || '-'}</td>
                  <td><span className="badge badge-role">{u.role || 'user'}</span></td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-sm btn-danger"
                      onClick={() => handleDelete(u._id, u.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="cards-container-mobile">
        {users.length === 0 ? (
          <div className="empty-state">No users found.</div>
        ) : (
          users.map((u) => (
            <div key={u._id} className="user-card">
              <div className="card-header">
                <h3>{u.name || '-'}</h3>
                <span className="badge badge-role">{u.role || 'user'}</span>
              </div>
              <div className="card-body">
                <div className="card-row">
                  <span className="card-label">Email:</span>
                  <span className="card-value">{u.email || '-'}</span>
                </div>
                <div className="card-row">
                  <span className="card-label">Phone:</span>
                  <span className="card-value">{u.phone || '-'}</span>
                </div>
                <div className="card-row">
                  <span className="card-label">Joined:</span>
                  <span className="card-value">{formatDate(u.createdAt)}</span>
                </div>
              </div>
              <div className="card-footer">
                <button
                  type="button"
                  className="btn-sm btn-danger"
                  onClick={() => handleDelete(u._id, u.name)}
                >
                  Delete User
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
