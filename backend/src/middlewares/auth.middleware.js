const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env')
const User = require('../models/User')
const Admin = require('../models/Admin')

// Protect routes - for regular users
exports.protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' })
      }
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  } catch (error) {
    next(error)
  }
}

// Protect admin routes
exports.protectAdmin = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.admin = await Admin.findById(decoded.id).select('-password')
      if (!req.admin || !req.admin.isActive) {
        return res.status(401).json({ message: 'Admin not found or inactive' })
      }
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  } catch (error) {
    next(error)
  }
}
