const mongoose = require('mongoose')
const { MONGODB_URI, NODE_ENV } = require('./env')

// MongoDB connection options
// Keep this minimal and compatible with the MongoDB Node.js driver used by Mongoose
const mongooseOptions = {
  // Use new URL parser and unified topology
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Connection pool settings
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, mongooseOptions)
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected')
    })
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed through app termination')
      process.exit(0)
    })
    
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`)
    
    // In production, exit process; in development, throw error
    if (NODE_ENV === 'production') {
      process.exit(1)
    } else {
      throw error
    }
  }
}

module.exports = { connectDB }
