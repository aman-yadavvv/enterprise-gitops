import User from '../models/User.js'
import Order from '../models/Order.js'
import { AppError } from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, search, role } = req.query

  const filter = {}
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  }
  if (role) filter.role = role

  const skip = (page - 1) * limit
  const total = await User.countDocuments(filter)

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  })
})

// @desc    Get single user (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password')
  
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
})

// @desc    Update user (Admin)
// @route   PATCH /api/users/:id
// @access  Private/Admin
export const updateUser = catchAsync(async (req, res, next) => {
  const { name, email, role, isVerified } = req.body

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, isVerified },
    {
      new: true,
      runValidators: true,
      select: '-password'
    }
  )

  if (!user) {
    return next(new AppError('User not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
})

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    return next(new AppError('User not found', 404))
  }

  res.status(204).json({
    status: 'success',
    data: null
  })
})

// @desc    Get user statistics (Admin)
// @route   GET /api/users/stats
// @access  Private/Admin
export const getUserStats = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments()
  const totalAdmins = await User.countDocuments({ role: 'admin' })
  const totalVerified = await User.countDocuments({ isVerified: true })

  // New users in last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const newUsers = await User.countDocuments({ 
    createdAt: { $gte: thirtyDaysAgo } 
  })

  // Users by role
  const roleDistribution = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ])

  // Recent users
  const recentUsers = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(10)

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalAdmins,
      totalVerified,
      newUsers,
      roleDistribution,
      recentUsers
    }
  })
})

// @desc    Add address to user
// @route   POST /api/users/address
// @access  Private
export const addAddress = catchAsync(async (req, res, next) => {
  const { street, city, state, zipCode, country, isDefault } = req.body

  const user = await User.findById(req.user.id)
  
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  // If setting as default, unset other defaults
  if (isDefault) {
    user.addresses = user.addresses.map(addr => ({
      ...addr.toObject(),
      isDefault: false
    }))
  }

  user.addresses.push({
    street,
    city,
    state,
    zipCode,
    country,
    isDefault: isDefault || false
  })

  await user.save()

  res.status(201).json({
    status: 'success',
    data: {
      addresses: user.addresses
    }
  })
})

// @desc    Update address
// @route   PATCH /api/users/address/:addressId
// @access  Private
export const updateAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params
  const { street, city, state, zipCode, country, isDefault } = req.body

  const user = await User.findById(req.user.id)
  
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  const addressIndex = user.addresses.findIndex(
    addr => addr._id.toString() === addressId
  )

  if (addressIndex === -1) {
    return next(new AppError('Address not found', 404))
  }

  // If setting as default, unset other defaults
  if (isDefault) {
    user.addresses = user.addresses.map(addr => ({
      ...addr.toObject(),
      isDefault: false
    }))
  }

  user.addresses[addressIndex] = {
    ...user.addresses[addressIndex].toObject(),
    street: street || user.addresses[addressIndex].street,
    city: city || user.addresses[addressIndex].city,
    state: state || user.addresses[addressIndex].state,
    zipCode: zipCode || user.addresses[addressIndex].zipCode,
    country: country || user.addresses[addressIndex].country,
    isDefault: isDefault || user.addresses[addressIndex].isDefault
  }

  await user.save()

  res.status(200).json({
    status: 'success',
    data: {
      addresses: user.addresses
    }
  })
})

// @desc    Delete address
// @route   DELETE /api/users/address/:addressId
// @access  Private
export const deleteAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params

  const user = await User.findById(req.user.id)
  
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  user.addresses = user.addresses.filter(
    addr => addr._id.toString() !== addressId
  )

  await user.save()

  res.status(200).json({
    status: 'success',
    data: {
      addresses: user.addresses
    }
  })
})

// @desc    Get user order history
// @route   GET /api/users/orders
// @access  Private
export const getUserOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(20)

  res.status(200).json({
    status: 'success',
    data: {
      orders
    }
  })
})

// @desc    Add to wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const addToWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.body

  const user = await User.findById(req.user.id)
  
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  if (user.wishlist.includes(productId)) {
    return next(new AppError('Product already in wishlist', 400))
  }

  user.wishlist.push(productId)
  await user.save()

  res.status(200).json({
    status: 'success',
    data: {
      wishlist: user.wishlist
    }
  })
})

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
export const removeFromWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params

  const user = await User.findById(req.user.id)
  
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  user.wishlist = user.wishlist.filter(
    id => id.toString() !== productId
  )
  await user.save()

  res.status(200).json({
    status: 'success',
    data: {
      wishlist: user.wishlist
    }
  })
})