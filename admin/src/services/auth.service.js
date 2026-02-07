import api from './api.js'

export const authService = {
  login: (email, password) => api.post('/admin/auth/login', { email, password }),
  logout: () => {
    localStorage.removeItem('adminToken')
  },
  getCurrentAdmin: () => api.get('/admin/auth/me'),
}
