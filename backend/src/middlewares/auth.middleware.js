const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env')
const User = require('../models/User')
const Admin = require('../models/Admin')

/**
 * Extract JWT token from Authorization header
 * @param {Object} req - Express request object
 * @returns {String|null} Token string or null
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7) // Remove 'Bearer ' prefix
  }
  return null
}

/**
 * Verify JWT token and decode payload
 * Uses jwt.verify directly to preserve error types for proper error handling
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired (preserves JWT error types)
 */
const decodeToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    // Preserve original JWT error types (TokenExpiredError, JsonWebTokenError, etc.)
    throw error
  }
}

/**
 * Protect routes - for regular users
 * Verifies JWT token and attaches user to request
 */
exports.protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = extractToken(req)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      })
    }

    // Verify and decode token
    const decoded = decodeToken(token)

    // Verify token type is for user
    if (decoded.type && decoded.type !== 'user') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type for this route',
      })
    }

    // Get user from database
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      })
    }

    // Attach user to request
    req.user = user
    req.userId = user._id

    next()
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: error.message || 'Token expired, please login again',
      })
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid token',
      })
    }

    // Pass other errors to error handler
    next(error)
  }
}

/**
 * Protect admin routes
 * Verifies JWT token and attaches admin to request
 */
exports.protectAdmin = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = extractToken(req)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      })
    }

    // Verify and decode token
    const decoded = decodeToken(token)

    // Verify token type is admin
    if (!decoded.type || decoded.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin token required',
      })
    }

    // Get admin from database
    const admin = await Admin.findById(decoded.id).select('-password')
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found',
      })
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive. Please contact administrator',
      })
    }

    // Attach admin to request
    req.admin = admin
    req.adminId = admin._id
    req.adminRole = admin.role

    next()
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: error.message || 'Token expired, please login again',
      })
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid token',
      })
    }

    // Pass other errors to error handler
    next(error)
  }
}

/**
 * Require superadmin role
 * Must be used after protectAdmin middleware
 */
exports.requireSuperAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, admin authentication required',
    })
  }

  if (req.admin.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Superadmin privileges required',
    })
  }

  next()
}
