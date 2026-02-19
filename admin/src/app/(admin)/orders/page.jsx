'use client'

import { useEffect, useState, useCallback } from 'react'
import { adminApi } from '@/lib/api'
import OrderStatusModal from '@/components/OrderStatusModal'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [meta, setMeta] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const fetchOrders = useCallback((page = 1) => {
    setLoading(true)
    const params = { page, limit: 20 }
    if (statusFilter) params.status = statusFilter
    if (paymentFilter) params.paymentStatus = paymentFilter
    adminApi
      .getOrders(params)
      .then((res) => {
        if (res.data?.success) {
          setOrders(res.data.data || [])
          setMeta(res.data.meta || {})
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [statusFilter, paymentFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleStatusUpdate = () => {
    setSelectedOrder(null)
    fetchOrders()
  }

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '-')
  const formatAmount = (n) => `₹${Number(n || 0).toLocaleString()}`

  if (loading && orders.length === 0) return <div className="loading-state">Loading orders...</div>
  if (error && orders.length === 0) return <div className="error-state">{error}</div>

  return (
    <div className="orders-page">
      <div className="page-header filters">
        <div className="filter-group">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Payment (COD)</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8}>No orders found.</td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id}>
                  <td><code>{o._id?.slice(-8)}</code></td>
                  <td>
                    <div>
                      <strong>{o.user?.name || '-'}</strong>
                      <br />
                      <small>{o.user?.email || '-'}</small>
                    </div>
                  </td>
                  <td>{o.items?.length || 0} item(s)</td>
                  <td>{formatAmount(o.totalAmount)}</td>
                  <td>
                    <span className={`badge badge-${o.status}`}>{o.status}</span>
                  </td>
                  <td>
                    <span className={`badge badge-payment-${o.paymentStatus}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-sm btn-primary"
                      onClick={() => setSelectedOrder(o)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {meta.pages > 1 && (
        <div className="pagination">
          Page {meta.page} of {meta.pages} ({meta.total} total)
        </div>
      )}
      {selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSuccess={handleStatusUpdate}
        />
      )}
    </div>
  )
}
