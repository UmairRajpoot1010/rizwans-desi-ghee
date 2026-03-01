const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { errorHandler } = require('./middlewares/error.middleware')
const { NODE_ENV, ALLOWED_ORIGINS } = require('./config/env')

// Import routes
const productRoutes = require('./routes/product.routes')
const orderRoutes = require('./routes/order.routes')
const authRoutes = require('./routes/auth.routes')
const adminRoutes = require('./routes/admin.routes')
const reviewRoutes = require('./routes/review.routes')

const app = express()

// Security Headers Middleware
app.use(helmet())

// CORS Configuration - uses ALLOWED_ORIGINS from env config
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    // In development, allow all origins
    if (NODE_ENV === 'development') {
      return callback(null, true)
    }

    // In production, use ALLOWED_ORIGINS from env (and always allow localhost for local dev)
    const baseOrigins = ALLOWED_ORIGINS
      ? ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
      : [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://rizwans-desi-ghee.vercel.app',
        'https://rizwans-desi-ghee-admin.vercel.app',
      ]
    const localhostOrigins = ['http://localhost:3000', 'http://localhost:3001']
    const allowedOrigins = [...new Set([...baseOrigins, ...localhostOrigins])]

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, // Allow cookies/credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 hours
}

app.use(cors(corsOptions))

// Request Logging Middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev')) // Colored output for development
} else {
  app.use(morgan('combined')) // Standard Apache combined log format for production
}

// Body Parser Middleware
app.use(express.json({ limit: '50mb' })) // Increased limit for Base64 screenshots
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Production Request Logger for debugging empty bodies
app.use((req, res, next) => {
  if (req.method === 'POST') {
    const hasBody = req.body && Object.keys(req.body).length > 0;
    if (!hasBody && req.headers['content-length'] > 0) {
      console.warn(`📥 [${new Date().toISOString()}] Warning: POST ${req.path} has content-length ${req.headers['content-length']} but empty body!`);
      console.warn('   Headers:', JSON.stringify(req.headers));
    }
  }
  next();
});

// Serve uploaded files (payment screenshots, etc.)
const path = require('path')
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Trust proxy (important for rate limiting and correct IP addresses)
app.set('trust proxy', 1)

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Rizwan\'s Desi Ghee API',
    version: '1.0.0',
    status: 'running',
    environment: NODE_ENV,
  })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// API Routes
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/reviews', reviewRoutes)

// 404 Handler - must be after all routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

module.exports = app
