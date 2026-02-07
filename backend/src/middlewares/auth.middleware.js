const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env')
const User = require('../models/User')
const Admin = require('../models/Admin')
const { verifyToken } = require('../utils/generateToken')

// Protect routes - for regular users
exports.protect = async (req, res, next) => {
  try {
    let token

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      })
    }

    try {
      // Verify token
      const decoded = verifyToken(token)

      // Check token type
      if (decoded.type && decoded.type !== 'user') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token type for this route',
        })
      }

      // Get user from database
      req.user = await User.findById(decoded.id).select('-password')
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        })
      }

      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired, please login again',
        })
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
        })
      }
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token verification failed',
      })
    }
  } catch (error) {
    next(error)
  }
}

// Protect admin routes
exports.protectAdmin = async (req, res, next) => {
  try {
    let token

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      })
    }

    try {
      // Verify token
      const decoded = verifyToken(token)

      // Verify token type is admin
      if (!decoded.type || decoded.type !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin token required',
        })
      }

      // Get admin from database (include password for comparison if needed)
      req.admin = await Admin.findById(decoded.id).select('-password')
      
      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: 'Admin not found',
        })
      }

      // Check if admin is active
      if (!req.admin.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Admin account is inactive. Please contact administrator',
        })
      }

      // Attach admin info to request
      req.adminId = req.admin._id
      req.adminRole = req.admin.role

      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired, please login again',
        })
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
        })
      }
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token verification failed',
      })
    }
  } catch (error) {
    next(error)
  }
}

// Optional: Middleware to check if admin is superadmin
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
