const mongoose = require('mongoose')
const { MONGODB_URI, NODE_ENV } = require('./env')

/**
 * MongoDB Connection Configuration
 * Supports both MongoDB Atlas and local MongoDB instances
 */

// MongoDB connection options (Mongoose 6+ compatible)
// Removed deprecated options: useNewUrlParser, useUnifiedTopology
const mongooseOptions = {
  // Connection pool settings
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 2, // Maintain at least 2 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  // Retry settings
  retryWrites: true, // Retry write operations on network errors
  retryReads: true, // Retry read operations on network errors
}

/**
 * Connect to MongoDB
 * @returns {Promise<void>} Resolves when connection is established
 * @throws {Error} If connection fails
 */
const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected')
      return
    }

    // Attempt connection
    const conn = await mongoose.connect(MONGODB_URI, mongooseOptions)
    
    // Log successful connection
    const connectionInfo = {
      host: conn.connection.host,
      name: conn.connection.name,
      port: conn.connection.port,
      readyState: conn.connection.readyState,
    }
    
    console.log('✅ MongoDB Connected Successfully')
    console.log(`   Host: ${connectionInfo.host}`)
    console.log(`   Database: ${connectionInfo.name}`)
    if (connectionInfo.port) {
      console.log(`   Port: ${connectionInfo.port}`)
    }
    
    // Set up connection event handlers
    setupConnectionHandlers()
    
  } catch (error) {
    // Log detailed error information
    console.error('❌ MongoDB Connection Failed')
    console.error(`   Error: ${error.message}`)
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('   Unable to reach MongoDB server. Please check:')
      console.error('   - MongoDB server is running (for local)')
      console.error('   - Network connectivity (for Atlas)')
      console.error('   - Connection string is correct')
      console.error('   - IP whitelist includes your IP (for Atlas)')
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('   Authentication failed. Please check:')
      console.error('   - Username and password are correct')
      console.error('   - Database user has proper permissions')
    }
    
    // In production, exit process; in development, throw error
    if (NODE_ENV === 'production') {
      console.error('   Exiting application...')
      process.exit(1)
    } else {
      throw error
    }
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
  
  // Reconnected handler
  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected')
  })
  
  // Connection opened handler
  mongoose.connection.on('open', () => {
    console.log('✅ MongoDB connection opened')
  })
  
  // Note: Graceful shutdown is handled by server.js
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
