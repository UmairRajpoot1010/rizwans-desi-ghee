import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rizwans-desi-ghee-backend.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach auth token; block protected routes without token
const ADMIN_PROTECTED_PATHS = ['/admin/auth/me', '/admin/dashboard', '/admin/products', '/admin/orders', '/admin/users']
const isProtectedPath = (url) => ADMIN_PROTECTED_PATHS.some((p) => url?.includes(p))

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken')
    if (isProtectedPath(config.url) && !token) {
      window.location.href = '/login'
      return Promise.reject(new Error('Admin authentication required'))
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor - handle 401/403 (token expired or forbidden)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if ((status === 401 || status === 403) && typeof window !== 'undefined') {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const healthApi = {
  check: () => api.get('/health'),
}

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
  verifyOrder: (id, status) => api.patch(`/admin/orders/${id}/verify`, { status }),

  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}

export default api
