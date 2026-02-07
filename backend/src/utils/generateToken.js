const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env')

const generateToken = (id, type = 'user') => {
  return jwt.sign({ id, type }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  })
}

module.exports = { generateToken }
