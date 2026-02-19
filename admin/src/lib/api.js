import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const adminApi = {
  login: (email, password) =>
    api.post('/admin/auth/login', { email, password }),

  getMe: () => api.get('/admin/auth/me'),

  getStats: () => api.get('/admin/dashboard/stats'),

  getProducts: () => api.get('/admin/products'),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}`, data),

  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}

export default api
