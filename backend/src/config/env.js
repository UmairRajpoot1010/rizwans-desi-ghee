require('dotenv').config()

/**
 * Environment Configuration
 * Validates and exports environment variables
 */

const NODE_ENV = process.env.NODE_ENV || 'development'

/**
 * Required environment variables
 * These must be set in production
 */
const requiredEnvVars = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
}

/**
 * Validate required environment variables
 * In production, all required variables must be set
 */
const validateEnvVars = () => {
  const missing = []
  
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    // Check if value is missing or empty string
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables: ${missing.join(', ')}`
    
    if (NODE_ENV === 'production') {
      console.error(`❌ ${errorMessage}`)
      console.error('Please set all required environment variables before starting the server.')
      process.exit(1)
    } else {
      console.warn(`⚠️  ${errorMessage}`)
      console.warn('Using default values for development. This is not recommended for production.')
    }
  }
}

// Validate environment variables on load
validateEnvVars()

/**
 * Configuration object
 * Uses environment variables with safe defaults for development only
 */
const config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : (NODE_ENV === 'production' ? null : 5000),
  NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI || (NODE_ENV === 'production' ? null : 'mongodb://localhost:27017/rizwans-desi-ghee'),
  JWT_SECRET: process.env.JWT_SECRET || (NODE_ENV === 'production' ? null : 'your-super-secret-jwt-key-change-in-production'),
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || (NODE_ENV === 'production' ? null : 'admin@rizwansdesighee.com'),
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || (NODE_ENV === 'production' ? null : 'admin123'),
  // CORS: Comma-separated list of allowed origins (e.g., "http://localhost:3000,https://example.com")
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
}

// Final validation: ensure no null values in production
if (NODE_ENV === 'production') {
  for (const [key, value] of Object.entries(config)) {
    if (value === null) {
      console.error(`❌ Required environment variable ${key} is not set in production`)
      process.exit(1)
    }
  }
}

module.exports = config
