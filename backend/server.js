const app = require('./src/app')
const { connectDB, disconnectDB } = require('./src/config/db')
const { PORT, NODE_ENV } = require('./src/config/env')

// ==============================
// Handle uncaught exceptions
// ==============================
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...')
  console.error(err.name, err.message)
  process.exit(1)
})

// ==============================
// Connect to Database & Start Server
// ==============================
const startServer = async () => {
  try {
    await connectDB()

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📦 Environment: ${NODE_ENV}`)
      console.log(`🌐 Server: http://localhost:${PORT}`)
    })

    // ==============================
    // Handle unhandled promise rejections
    // ==============================
    process.on('unhandledRejection', (err) => {
      console.error('❌ UNHANDLED REJECTION! Shutting down...')
      console.error(err.name, err.message)
      server.close(async () => {
        try {
          await disconnectDB()
        } catch (dbErr) {
          console.error('Error during shutdown:', dbErr.message)
        }
        process.exit(1)
      })
    })

    // ==============================
    // Graceful shutdown (SIGTERM, SIGINT)
    // ==============================
    const gracefulShutdown = async (signal) => {
      console.log(`\n👋 ${signal} received. Shutting down gracefully...`)
      server.close(async () => {
        try {
          await disconnectDB()
          console.log('💥 Process terminated')
          process.exit(0)
        } catch (err) {
          console.error('❌ Error during shutdown:', err.message)
          process.exit(1)
        }
      })
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    if (error.message?.includes('MongoDB')) {
      console.error('   MongoDB connection failed. Check MONGODB_URI in .env')
    }
    process.exit(1)
  }
}

startServer()
