'use client'

import { useState } from 'react'

export default function OrderCard({ order, onUpdate }) {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '-')
  const formatAmount = (n) => `Rs. ${Number(n || 0).toLocaleString()}`
  const formatShipping = (addr, user) => {
    if (!addr && !user) return '-'
    const name = addr?.name || user?.name
    const email = addr?.email || user?.email
    const phone = addr?.phone || user?.phone
    return { name, email, phone }
  }

  const shipping = formatShipping(order.shippingAddress, order.user)

  return (
    <div className="order-card">
      {/* Header */}
      <div className="order-card-header">
        <div className="order-card-id-amount">
          <div className="order-id">Order #{order._id?.slice(-8)}</div>
          <div className="order-amount">{formatAmount(order.totalAmount)}</div>
        </div>
        <div className="order-date">{formatDate(order.createdAt)}</div>
      </div>

      {/* Customer info */}
      <div className="order-card-section">
        <div className="section-title">Customer</div>
        <div className="customer-info">
          <div className="customer-name">{shipping.name || '-'}</div>
          <div className="customer-email">{shipping.email || '-'}</div>
          <div className="customer-phone">{shipping.phone || '-'}</div>
        </div>
      </div>

      {/* Address */}
      {order.shippingAddress && (
        <div className="order-card-section">
          <div className="section-title">Shipping Address</div>
          <div className="address-info">
            <div>{order.shippingAddress.address}</div>
            <div>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="order-card-section">
        <div className="section-title">
          Items ({order.items?.length || 0})
        </div>
        <div className="items-list">
          {order.items?.map((item, idx) => (
            <div key={idx} className="item-row">
              <div className="item-name">{item.product?.name || item.product}</div>
              <div className="item-qty">x{item.quantity}</div>
              <div className="item-price">Rs. {Number(item.price || 0).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment info */}
      <div className="order-card-section">
        <div className="section-title">Payment</div>
        <div className="payment-info">
          <div className="payment-method">
            <span className="label">Method:</span>
            <span className="badge badge-pending">
              {order.paymentMethod === 'ONLINE' ? 'Online' : 'COD'}
            </span>
          </div>
          <div className="payment-status">
            <span className="label">Status:</span>
            <span
              className={`badge badge-payment-${order.paymentStatus || 'pending'}`}
            >
              {order.paymentStatus || 'pending'}
            </span>
          </div>
          {order.paymentMethod === 'ONLINE' && (
            <div className="payment-verification">
              <span className="label">Verification:</span>
              <span
                className={`badge badge-verification-${order.paymentVerificationStatus || 'pending'}`}
              >
                {order.paymentVerificationStatus || 'pending'}
              </span>
            </div>
          )}
          {(order.paymentProof?.data || order.paymentScreenshot) && (
            <div className="payment-screenshot">
              <a
                href={order.paymentProof?.data || order.paymentScreenshot}
                target="_blank"
                rel="noreferrer"
                className="screenshot-link"
              >
                View Receipt
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="order-card-section">
        <div className="section-title">Status</div>
        <div className="status-badges">
          <span className={`badge badge-${order.status}`}>{order.status}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="order-card-footer">
        <button
          type="button"
          className="btn-sm btn-primary"
          onClick={() => onUpdate(order)}
        >
          Update Order
        </button>
      </div>
    </div>
  )
}
