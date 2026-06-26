import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

// Send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  
  // Remove password from output
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body

  // Check if user exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return next(new AppError('User already exists with this email', 400))
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  })

  createSendToken(user, 201, res)
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400))
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401))
  }

  // Update last login
  user.lastLogin = new Date()
  await user.save({ validateBeforeSave: false })

  createSendToken(user, 200, res)
})

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
})

// @desc    Update user profile
// @route   PATCH /api/auth/updateprofile
// @access  Private
export const updateProfile = catchAsync(async (req, res, next) => {
  const { name, email, profileImage } = req.body

  // Build update object
  const updateData = {}
  if (name) updateData.name = name
  if (email) updateData.email = email
  if (profileImage) updateData.profileImage = profileImage

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  )

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
})

// @desc    Update password
// @route   PATCH /api/auth/updatepassword
// @access  Private
export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body

  // Get user with password
  const user = await User.findById(req.user.id).select('+password')

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 401))
  }

  // Update password
  user.password = newPassword
  await user.save()

  createSendToken(user, 200, res)
})

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  })
})