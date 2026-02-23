'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api'

export default function ProductForm({ product, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '0',
    isActive: true,
    images: [],
  })
  const [imageUrls, setImageUrls] = useState('')
  const [previewImages, setPreviewImages] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: String(product.price ?? ''),
        category: product.category || '',
        stock: String(product.stock ?? 0),
        isActive: product.isActive !== false,
        images: Array.isArray(product.images) ? product.images : [],
      })
      setImageUrls(Array.isArray(product.images) ? product.images.join('\n') : '')
      setPreviewImages(Array.isArray(product.images) ? product.images : [])
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageInput = (e) => {
    const { value } = e.target
    setImageUrls(value)
    const urls = value
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    setPreviewImages(urls)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = String(reader.result)
        setPreviewImages((prev) => [...prev, base64])
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, base64],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const images = form.images.length > 0 ? form.images : (
      imageUrls
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    )

    if (images.length === 0) {
      setError('At least one image is required')
      setSubmitting(false)
      return
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price) || 0,
      category: form.category.trim(),
      stock: parseInt(form.stock, 10) || 0,
      isActive: form.isActive,
      images,
    }

    try {
      if (product?._id) {
        await adminApi.updateProduct(product._id, payload)
      } else {
        await adminApi.createProduct(payload)
      }
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Add Product'}</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="form-error">{error}</div>}
          <div className="form-group">
            <label>Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Product name"
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Product description"
            />
          </div>
          
          {/* VARIANT SELECTION */}
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Category *</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              placeholder="e.g. Desi Ghee"
            />
          </div>
          <div className="form-group">
            <label>Images *</label>
            <div className="image-upload-section">
              <div className="image-upload-input">
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handleImageUpload}
                  id="image-select"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn-upload"
                  onClick={() => document.getElementById('image-select').click()}
                >
                  📁 Choose Photos
                </button>
                <small>Upload product images from your device (PNG, JPG, GIF, WebP)</small>
              </div>
              
              {previewImages.length > 0 && (
                <div className="image-preview-grid">
                  {previewImages.map((src, idx) => (
                    <div key={idx} className="image-preview-item">
                      <img 
                        src={src} 
                        alt={`Preview ${idx + 1}`}
                        style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => removeImage(idx)}
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="form-group form-check">
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Active (visible to customers)
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
