require('dotenv').config()

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/rizwans-desi-ghee',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@rizwansdesighee.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
}
