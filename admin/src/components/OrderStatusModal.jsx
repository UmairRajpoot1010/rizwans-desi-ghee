'use client'

import { useState } from 'react'
import { adminApi } from '@/lib/api'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_OPTIONS = ['pending', 'paid', 'failed']

export default function OrderStatusModal({ order, onClose, onSuccess }) {
  const [status, setStatus] = useState(order?.status || '')
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!status && !paymentStatus) {
      setError('Update at least one field')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const payload = {}
      if (status) payload.status = status
      if (paymentStatus) payload.paymentStatus = paymentStatus
      await adminApi.updateOrderStatus(order._id, payload)
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Update Order #{order?._id?.slice(-8)}</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="form-error">{error}</div>}
          <div className="form-group">
            <label>Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Payment Status (COD)</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              {PAYMENT_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <small>Mark &quot;paid&quot; when customer pays on delivery.</small>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
