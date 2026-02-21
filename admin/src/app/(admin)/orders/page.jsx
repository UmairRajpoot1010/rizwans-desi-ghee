'use client'

import { useEffect, useState, useCallback } from 'react'
import { adminApi } from '@/lib/api'
import OrderCard from '@/components/OrderCard'
import OrderStatusModal from '@/components/OrderStatusModal'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [meta, setMeta] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const fetchOrders = useCallback(
    (pageNum = 1) => {
      setLoading(true)
      const params = { page: pageNum, limit: 20 }
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
        .catch((err) =>
          setError(err.response?.data?.message || 'Failed to load orders')
        )
        .finally(() => setLoading(false))
    },
    [statusFilter, paymentFilter]
  )

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (meta.pages || 1)) {
      setPage(newPage)
      fetchOrders(newPage)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchOrders(1)
  }, [fetchOrders])

  const handleStatusUpdate = () => {
    setSelectedOrder(null)
    fetchOrders(page)
  }

  if (loading && orders.length === 0)
    return <div className="loading-state">Loading orders...</div>
  if (error && orders.length === 0)
    return <div className="error-state">{error}</div>

  return (
    <div className="orders-page">
      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Payment Status:</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No orders found</h3>
          <p>Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <>
          {/* Mobile: Card view */}
          <div className="orders-cards">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onUpdate={setSelectedOrder}
              />
            ))}
          </div>

          {/* Desktop: Table view */}
          <div className="orders-table">
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Verification</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <code>{order._id?.slice(-8)}</code>
                      </td>
                      <td>
                        <div>
                          <strong>
                            {order.shippingAddress?.name ||
                              order.user?.name ||
                              '-'}
                          </strong>
                          <br />
                          <small>
                            {order.shippingAddress?.phone ||
                              order.user?.phone ||
                              '-'}
                          </small>
                        </div>
                      </td>
                      <td>{order.items?.length || 0}</td>
                      <td>
                        ₹{Number(order.totalAmount || 0).toLocaleString()}
                      </td>
                      <td>
                        <span className="badge badge-pending">
                          {order.paymentMethod === 'ONLINE'
                            ? 'Online'
                            : 'COD'}
                        </span>
                        {order.paymentMethod === 'ONLINE' &&
                          order.paymentScreenshot && (
                            <div style={{ marginTop: '4px' }}>
                              <a
                                href={order.paymentScreenshot}
                                target="_blank"
                                rel="noreferrer"
                                className="text-link"
                              >
                                View
                              </a>
                            </div>
                          )}
                      </td>
                      <td>
                        <span className={`badge badge-${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge badge-verification-${order.paymentVerificationStatus || 'pending'}`}
                        >
                          {order.paymentVerificationStatus || 'pending'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-sm btn-primary"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="btn-sm"
            disabled={page <= 1 || loading}
            onClick={() => handlePageChange(page - 1)}
          >
            ← Previous
          </button>
          <span>
            Page {meta.page} of {meta.pages} ({meta.total} total)
          </span>
          <button
            type="button"
            className="btn-sm"
            disabled={page >= meta.pages || loading}
            onClick={() => handlePageChange(page + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {/* Modal */}
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
