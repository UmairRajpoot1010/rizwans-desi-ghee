const mongoose = require('mongoose')
const { MONGODB_URI, NODE_ENV, ADMIN_EMAIL, ADMIN_PASSWORD } = require('./env')

/**
 * MongoDB Connection Configuration
 * Supports MongoDB Atlas (mongodb+srv://) and local MongoDB instances
 */

// MongoDB connection options - Mongoose 6+ / Atlas compatible
// SRV connection strings (mongodb+srv://) are natively supported
const mongooseOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 10000, // 10s for Atlas DNS/network
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true, // Atlas default
  retryReads: true,
}

/**
 * Initialize default admin account if it doesn't exist
 * @returns {Promise<void>}
 */
const initializeDefaultAdmin = async () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not configured, skipping default admin creation')
    return
  }

  try {
    const Admin = require('../models/Admin')
    const existingAdmin = await Admin.findByEmail(ADMIN_EMAIL.toLowerCase())

    if (existingAdmin) {
      console.log('✅ Default admin account already exists')
      return
    }

    const admin = new Admin({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      isActive: true,
    })

    await admin.save()
    console.log('✅ Default admin account created successfully')
    console.log(`   Email: ${ADMIN_EMAIL}`)
  } catch (error) {
    console.error('⚠️  Failed to initialize default admin:', error.message)
    // Don't exit here, as this is not critical
  }
}

/**
 * Connect to MongoDB
 * @returns {Promise<void>} Resolves when connection is established
 * @throws {Error} If connection fails
 */
const connectDB = async () => {
  if (!MONGODB_URI || (typeof MONGODB_URI === 'string' && MONGODB_URI.trim() === '')) {
    console.error('❌ MONGODB_URI is not set. Add it to your .env file.')
    process.exit(1)
  }

  if (mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected')
    return
  }

  console.log('🔄 Connecting to MongoDB...')

  try {
    const conn = await mongoose.connect(MONGODB_URI, mongooseOptions)

    const host = conn.connection.host
    const name = conn.connection.name
    const isAtlas = MONGODB_URI.includes('mongodb+srv://')

    console.log('✅ MongoDB Connected Successfully')
    console.log(`   Cluster: ${host}`)
    console.log(`   Database: ${name}`)
    if (isAtlas) {
      console.log(`   Mode: MongoDB Atlas`)
    }
    console.log(`   Status: Ready`)

    setupConnectionHandlers()
    
    // Initialize default admin account
    await initializeDefaultAdmin()
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed')
    console.error(`   Error: ${error.message}`)

    if (error.name === 'MongoServerSelectionError') {
      console.error('   Troubleshooting:')
      console.error('   - For Atlas: Check network, connection string, IP whitelist')
      console.error('   - For local: Ensure MongoDB is running')
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('   Troubleshooting: Check username, password, and database user permissions')
    }

    console.error('   Exiting application...')
    process.exit(1)
  }
}

/**
 * Set up MongoDB connection event handlers
 */
const setupConnectionHandlers = () => {
  // Connection error handler
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message)
  })
  
  // Disconnected handler
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected')
    if (NODE_ENV === 'production') {
      console.warn('   Attempting to reconnect...')
    }
  })
  
  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected')
  })

  // Graceful shutdown (SIGINT/SIGTERM) is handled by server.js
}

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close()
      console.log('✅ MongoDB connection closed gracefully')
    }
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message)
    throw error
  }
}

module.exports = { connectDB, disconnectDB }
