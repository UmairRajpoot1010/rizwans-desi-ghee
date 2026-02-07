const express = require('express')
const cors = require('cors')
const { errorHandler } = require('./middlewares/error.middleware')

// Import routes
const productRoutes = require('./routes/product.routes')
const orderRoutes = require('./routes/order.routes')
const authRoutes = require('./routes/auth.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Error handling middleware (must be last)
app.use(errorHandler)

module.exports = app
