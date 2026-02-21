'use client'

import { useState } from 'react'

export default function PaymentProofModal({ imageUrl, onClose }) {
  const [loadingImage, setLoadingImage] = useState(true)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="image-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="image-container">
          {loadingImage && <div className="image-loading">Loading image...</div>}
          <img
            src={imageUrl}
            alt="Payment proof"
            onLoad={() => setLoadingImage(false)}
            className={loadingImage ? 'hidden' : ''}
          />
        </div>
      </div>
    </div>
  )
}
