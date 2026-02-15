const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env')

/**
 * Valid token types
 */
const TOKEN_TYPES = {
  USER: 'user',
  ADMIN: 'admin',
}

/**
 * Validate JWT secret is configured
 * @throws {Error} If JWT_SECRET is not set
 */
const validateJWTSecret = () => {
  if (!JWT_SECRET || JWT_SECRET.trim() === '') {
    throw new Error('JWT_SECRET is not configured. Please set it in environment variables.')
  }
  
  // Warn if using default secret in production
  if (process.env.NODE_ENV === 'production' && JWT_SECRET.includes('change-in-production')) {
    console.warn('⚠️  WARNING: Using default JWT_SECRET in production is insecure!')
  }
}

/**
 * Validate token type
 * @param {String} type - Token type to validate
 * @throws {Error} If token type is invalid
 */
const validateTokenType = (type) => {
  const validTypes = Object.values(TOKEN_TYPES)
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid token type: ${type}. Must be one of: ${validTypes.join(', ')}`)
  }
}

/**
 * Validate user/admin ID
 * @param {String|Object} id - User/Admin ID to validate
 * @throws {Error} If ID is invalid
 */
const validateId = (id) => {
  if (!id) {
    throw new Error('ID is required to generate token')
  }
  
  // Convert ObjectId to string if needed
  if (typeof id === 'object' && id.toString) {
    return id.toString()
  }
  
  // Ensure ID is a string
  const idString = String(id).trim()
  if (idString === '' || idString === 'undefined' || idString === 'null') {
    throw new Error('Invalid ID: ID cannot be empty')
  }
  
  return idString
}

/**
 * Generate JWT token
 * @param {String|Object} id - User/Admin ID (MongoDB ObjectId or string)
 * @param {String} [type='user'] - Token type: 'user' or 'admin'
 * @returns {String} JWT token
 * @throws {Error} If ID is invalid, type is invalid, or JWT_SECRET is not configured
 */
const generateToken = (id, type = TOKEN_TYPES.USER) => {
  try {
    // Validate JWT secret is configured
    validateJWTSecret()
    
    // Validate and normalize ID
    const normalizedId = validateId(id)
    
    // Validate token type
    validateTokenType(type)
    
    // Create payload
    const payload = {
      id: normalizedId,
      type: type.toLowerCase(), // Ensure lowercase
    }
    
    // Generate token
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE || '7d', // Fallback to 7 days if not set
    })
    
    // Validate token was generated
    if (!token || typeof token !== 'string') {
      throw new Error('Failed to generate token')
    }
    
    return token
  } catch (error) {
    // Re-throw with more context if it's our validation error
    if (error.message.includes('JWT_SECRET') || 
        error.message.includes('Invalid') || 
        error.message.includes('ID')) {
      throw error
    }
    
    // Wrap JWT library errors
    throw new Error(`Token generation failed: ${error.message}`)
  }
}

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload with id and type
 * @throws {Error} If token is invalid, expired, or malformed
 */
const verifyToken = (token) => {
  try {
    // Validate JWT secret is configured
    validateJWTSecret()
    
    // Validate token input
    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new Error('Token is required and must be a non-empty string')
    }
    
    // Verify token
    const decoded = jwt.verify(token.trim(), JWT_SECRET)
    
    // Validate decoded payload structure
    if (!decoded || !decoded.id) {
      throw new Error('Invalid token payload: missing required fields')
    }
    
    // Validate token type if present
    if (decoded.type) {
      validateTokenType(decoded.type)
    }
    
    return decoded
  } catch (error) {
    // Preserve JWT library error types for proper error handling
    if (error.name === 'JsonWebTokenError') {
      const jwtError = new Error('Invalid token')
      jwtError.name = 'JsonWebTokenError'
      throw jwtError
    }
    
    if (error.name === 'TokenExpiredError') {
      const expiredError = new Error('Token expired')
      expiredError.name = 'TokenExpiredError'
      throw expiredError
    }
    
    if (error.name === 'NotBeforeError') {
      const notBeforeError = new Error('Token not active yet')
      notBeforeError.name = 'NotBeforeError'
      throw notBeforeError
    }
    
    // Re-throw validation errors as-is
    if (error.message.includes('Token is required') || 
        error.message.includes('Invalid token payload') ||
        error.message.includes('JWT_SECRET')) {
      throw error
    }
    
    // Wrap other errors
    throw new Error(`Token verification failed: ${error.message}`)
  }
}

/**
 * Decode token without verification (for debugging only)
 * WARNING: This does not verify the token signature. Use verifyToken for production.
 * @param {String} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    throw new Error('Token is required and must be a non-empty string')
  }
  
  try {
    return jwt.decode(token.trim(), { complete: true })
  } catch (error) {
    throw new Error(`Token decoding failed: ${error.message}`)
  }
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  TOKEN_TYPES,
}
