const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env')

/**
 * Generate JWT token
 * @param {String} id - User/Admin ID
 * @param {String} type - Token type: 'user' or 'admin'
 * @returns {String} JWT token
 */
const generateToken = (id, type = 'user') => {
  const payload = {
    id,
    type, // 'user' or 'admin'
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  })
}

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

module.exports = {
  generateToken,
  verifyToken,
}
