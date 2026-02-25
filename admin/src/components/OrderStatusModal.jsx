'use client'

import { useState } from 'react'
import { adminApi } from '@/lib/api'
import PaymentProofModal from './PaymentProofModal'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_OPTIONS = ['pending', 'paid', 'unverified', 'failed']
const PAYMENT_VERIFICATION_OPTIONS = ['pending', 'verified', 'rejected']

export default function OrderStatusModal({ order, onClose, onSuccess }) {
  const [status, setStatus] = useState(order?.status || '')
  const [paymentStatus, setPaymentStatus] = useState(
    order?.paymentStatus || ''
  )
  const [paymentVerificationStatus, setPaymentVerificationStatus] = useState(
    order?.paymentVerificationStatus || ''
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!status && !paymentStatus && !paymentVerificationStatus) {
      setError('Update at least one field')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const payload = {}
      if (status) payload.status = status
      if (paymentStatus) payload.paymentStatus = paymentStatus
      if (paymentVerificationStatus)
        payload.paymentVerificationStatus = paymentVerificationStatus
      await adminApi.updateOrderStatus(order._id, payload)
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) return
    setError('')
    setDeleting(true)
    try {
      await adminApi.deleteOrder(order._id)
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete order')
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Update Order #{order?._id?.slice(-8)}</h3>
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="modal-body">
            {error && <div className="form-error">{error}</div>}

            {/* Shipping information (read-only) */}
            {order.shippingAddress && (
              <div className="form-group">
                <label>Shipping Information</label>
                <div className="read-only-text">
                  <div>
                    <strong>{order.shippingAddress.name}</strong>
                  </div>
                  <div>{order.shippingAddress.address}</div>
                  <div>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </div>
                  <div>Phone: {order.shippingAddress.phone}</div>
                  <div>Email: {order.shippingAddress.email}</div>
                </div>
              </div>
            )}

            {/* Items summary */}
            <div className="form-group">
              <label>Items ({order.items?.length || 0})</label>
              <div className="space-y-2">
                {order.items?.map((it, idx) => (
                  <div key={idx} className="item-summary">
                    <div>{it.product?.name || it.product}</div>
                    <div className="text-right">
                      <div>Qty: {it.quantity}</div>
                      <div>{it.product?.name ? '' : ''}</div>
                      <div className="item-price">
                        Rs. {Number(it.price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Status */}
            <div className="form-group">
              <label>Order Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Select status...</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Status (COD) */}
            {order.paymentMethod !== 'ONLINE' && (
              <div className="form-group">
                <label>Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="">Select payment status...</option>
                  {PAYMENT_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
                <small>
                  Mark &quot;paid&quot; when customer pays on delivery.
                </small>
              </div>
            )}

            {/* Payment Verification (Online) */}
            {order.paymentMethod === 'ONLINE' && (
              <div className="form-group">
                <label>Payment Verification</label>
                <select
                  value={paymentVerificationStatus}
                  onChange={(e) =>
                    setPaymentVerificationStatus(e.target.value)
                  }
                >
                  <option value="">Select verification status...</option>
                  {PAYMENT_VERIFICATION_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
                <small>
                  Verify or reject uploaded payment screenshots for online
                  payments.
                </small>
              </div>
            )}

            {/* Payment Screenshot */}
            {(order.paymentProof?.data || order.paymentScreenshot) && (
              <div className="form-group">
                <label>Payment Proof</label>
                <button
                  type="button"
                  className="screenshot-button"
                  onClick={() => setShowImageModal(true)}
                >
                  <img
                    src={order.paymentProof?.data || order.paymentScreenshot}
                    alt="payment"
                    className="screenshot-thumb"
                  />
                  <span>Click to view full size</span>
                </button>
              </div>
            )}

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary btn-danger-secondary"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Order'}
              </button>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Image modal */}
      {showImageModal && (
        <PaymentProofModal
          imageUrl={order.paymentProof?.data || order.paymentScreenshot}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </>
  )
}
