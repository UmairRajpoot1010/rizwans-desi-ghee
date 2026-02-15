const mongoose = require('mongoose')
const { MONGODB_URI, NODE_ENV } = require('./env')

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
