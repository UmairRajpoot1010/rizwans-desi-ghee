'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import ProductForm from '@/components/ProductForm'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const fetchProducts = () => {
    setLoading(true)
    adminApi
      .getProducts()
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setProducts(res.data.data)
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load products'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleCreate = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete product "${name}"?`)) return
    try {
      await adminApi.deleteProduct(id)
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    }
  }

  if (loading) return <div className="loading-state">Loading products...</div>
  if (error) return <div className="error-state">{error}</div>

  return (
    <div className="products-page">
      <div className="page-header-responsive">
        <h2>Products</h2>
        <button type="button" className="btn-primary" onClick={handleCreate}>
          + Add
        </button>
      </div>

      {/* Desktop Table */}
      <div className="table-container-desktop">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6}>No products yet. Add your first product.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} onClick={() => handleEdit(p)} className="clickable-row" style={{ cursor: 'pointer' }}>
                  <td>
                    <div className="product-cell">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt="" className="product-thumb" />
                      )}
                      <div>
                        <strong>{p.name}</strong>
                        {p.description && (
                          <span className="product-desc">{p.description.slice(0, 50)}...</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>Rs. {Number(p.price).toLocaleString()}</td>
                  <td>{p.stock ?? 0}</td>
                  <td>
                    <span className={`badge ${p.isActive ? 'badge-success' : 'badge-muted'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-sm btn-edit"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-sm btn-danger"
                      onClick={() => handleDelete(p._id, p.name)}
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
        {products.length === 0 ? (
          <div className="empty-state">No products yet. Add your first product.</div>
        ) : (
          products.map((p) => (
            <div key={p._id} className="product-card admin-card-mobile">
              <div className="card-header">
                <div className="product-card-title">
                  {p.images?.[0] && (
                    <img src={p.images[0]} alt="" className="product-card-thumb" />
                  )}
                  <h3>{p.name}</h3>
                </div>
                <span className={`badge ${p.isActive ? 'badge-success' : 'badge-muted'}`}>
                  {p.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="card-body">
                <div className="card-row">
                  <span className="card-label">Category</span>
                  <span className="card-value">{p.category || '-'}</span>
                </div>
                <div className="card-row">
                  <span className="card-label">Price</span>
                  <span className="card-value">Rs. {Number(p.price).toLocaleString()}</span>
                </div>
                <div className="card-row">
                  <span className="card-label">Stock</span>
                  <span className="card-value">{p.stock ?? 0}</span>
                </div>
              </div>
              <div className="card-footer">
                <button
                  type="button"
                  className="btn-sm btn-edit"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-sm btn-danger"
                  onClick={() => handleDelete(p._id, p.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}
    </div>
  )
}
