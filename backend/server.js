const app = require('./src/app')
const { connectDB } = require('./src/config/db')
const { PORT, NODE_ENV } = require('./src/config/env')

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...')
  console.error(err.name, err.message)
  process.exit(1)
})

// Connect to database
connectDB()
  .then(() => {
    // Start server only after database connection
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📦 Environment: ${NODE_ENV}`)
      console.log(`🌐 Server: http://localhost:${PORT}`)
    })

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ UNHANDLED REJECTION! Shutting down...')
      console.error(err.name, err.message)
      
      // Close server gracefully
      server.close(() => {
        process.exit(1)
      })
    })

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received. Shutting down gracefully...')
      server.close(() => {
        console.log('💥 Process terminated!')
      })
    })
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  })
