const User = require('../models/User')
const { generateToken } = require('../utils/generateToken')

/**
 * Helper to send a consistent JSON response.
 */
const sendResponse = (res, statusCode, { success, message, data, meta }) => {
  const payload = { success, message }
  if (data !== undefined) payload.data = data
  if (meta !== undefined) payload.meta = meta
  return res.status(statusCode).json(payload)
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Name, email and password are required',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (password.length < 6) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Password must be at least 6 characters long',
      })
    }

    const userExists = await User.findOne({ email: normalizedEmail })
    if (userExists) {
      return sendResponse(res, 400, {
        success: false,
        message: 'User already exists',
      })
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      phone,
    })

    const token = generateToken(user._id)

    return sendResponse(res, 201, {
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Please provide email and password',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Invalid credentials',
      })
    }

    if (user.isActive === false) {
      return sendResponse(res, 403, {
        success: false,
        message: 'User account is inactive. Please contact support',
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Invalid credentials',
      })
    }

    const token = generateToken(user._id)

    return sendResponse(res, 200, {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Not authenticated',
      })
    }

    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return sendResponse(res, 404, {
        success: false,
        message: 'User not found',
      })
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'User profile fetched successfully',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}
