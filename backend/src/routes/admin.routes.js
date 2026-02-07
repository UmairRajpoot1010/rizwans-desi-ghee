const express = require('express')
const router = express.Router()
const { protectAdmin } = require('../middlewares/auth.middleware')
const {
  adminLogin,
  getStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/admin.controller')

// Auth routes
router.post('/auth/login', adminLogin)

// Dashboard
router.get('/dashboard/stats', protectAdmin, getStats)

// Products
router.get('/products', protectAdmin, getAllProducts)
router.post('/products', protectAdmin, createProduct)
router.put('/products/:id', protectAdmin, updateProduct)
router.delete('/products/:id', protectAdmin, deleteProduct)

// Orders
router.get('/orders', protectAdmin, getAllOrders)
router.put('/orders/:id', protectAdmin, updateOrderStatus)

// Users
router.get('/users', protectAdmin, getAllUsers)
router.put('/users/:id', protectAdmin, updateUser)
router.delete('/users/:id', protectAdmin, deleteUser)

module.exports = router
