import jwt from 'jsonwebtoken'

export const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

export const decodeToken = (token) => {
  return jwt.decode(token)
}

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
}

export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token)
    if (!decoded) return true
    return decoded.exp < Date.now() / 1000
  } catch (error) {
    return true
  }
}

export const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.split(' ')[1]
}

export const extractUserId = (token) => {
  try {
    const decoded = verifyToken(token)
    return decoded.id
  } catch (error) {
    return null
  }
}