import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Cart from '../models/Cart.js'
import { AppError } from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'
import { deleteByPattern } from '../services/redisService.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress, paymentMethod, items, notes } = req.body

  // Get user's cart if items not provided
  let orderItems = items
  if (!orderItems) {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product')
    if (!cart || cart.items.length === 0) {
      return next(new AppError('Cart is empty', 400))
    }
    orderItems = cart.items
  }

  // Calculate prices
  let itemsPrice = 0
  const orderItemsData = []

  for (const item of orderItems) {
    const product = await Product.findById(item.product._id || item.product)
    if (!product) {
      return next(new AppError(`Product not found: ${item.product}`, 404))
    }

    // Check stock
    if (!product.isInStock(item.quantity)) {
      return next(new AppError(`Insufficient stock for ${product.name}`, 400))
    }

    const price = product.finalPrice
    itemsPrice += price * item.quantity

    orderItemsData.push({
      product: product._id,
      name: product.name,
      price: price,
      quantity: item.quantity,
      size: item.size || product.sizes[0],
      color: item.color || product.colors[0]?.name,
      image: product.images[0]?.url
    })

    // Update stock
    product.stock -= item.quantity
    await product.save()
  }

  // Calculate totals
  const taxPrice = itemsPrice * 0.08
  const shippingPrice = itemsPrice > 100 ? 0 : 10
  const totalPrice = itemsPrice + taxPrice + shippingPrice

  // Create order
  const order = await Order.create({
    user: req.user.id,
    items: orderItemsData,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    notes
  })

  // Clear user's cart
  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [], totalPrice: 0, totalItems: 0 }
  )

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  })
})

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getOrders = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status, userId } = req.query

  const filter = {}
  if (req.user.role === 'admin') {
    if (userId) filter.user = userId
  } else {
    filter.user = req.user.id
  }

  if (status) filter.status = status

  const skip = (page - 1) * limit
  const total = await Order.countDocuments(filter)

  const query = Order.find(filter)
  if (req.user.role === 'admin') {
    query.populate('user', 'name email')
  }

  const orders = await query
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  })
})

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')

  if (!order) {
    return next(new AppError('Order not found', 404))
  }

  // Check if user owns the order or is admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to view this order', 403))
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  })
})

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body

  const order = await Order.findById(req.params.id)
  if (!order) {
    return next(new AppError('Order not found', 404))
  }

  order.status = status
  if (status === 'Delivered') {
    order.isDelivered = true
    order.deliveredAt = new Date()
  }
  if (status === 'Cancelled') {
    order.cancelledAt = new Date()
    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product)
      if (product) {
        product.stock += item.quantity
        await product.save()
      }
    }
  }

  await order.save()

  // Invalidate products cache (stock levels might have changed)
  await deleteByPattern('cache:/api/products*')

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  })
})

// @desc    Cancel order
// @route   POST /api/orders/:id/cancel
// @access  Private
export const cancelOrder = catchAsync(async (req, res, next) => {
  const { reason } = req.body

  const order = await Order.findById(req.params.id)
  if (!order) {
    return next(new AppError('Order not found', 404))
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to cancel this order', 403))
  }

  if (!order.canCancel()) {
    return next(new AppError('This order cannot be cancelled', 400))
  }

  order.status = 'Cancelled'
  order.cancelledAt = new Date()
  order.cancellationReason = reason

  // Restore stock
  for (const item of order.items) {
    const product = await Product.findById(item.product)
    if (product) {
      product.stock += item.quantity
      await product.save()
    }
  }

  await order.save()

  res.status(200).json({
    status: 'success',
    message: 'Order cancelled successfully',
    data: {
      order
    }
  })
})

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = catchAsync(async (req, res, next) => {
  const totalOrders = await Order.countDocuments()
  const totalRevenue = await Order.aggregate([
    { $match: { status: 'Delivered' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ])

  const statusCounts = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ])

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name email')

  res.status(200).json({
    status: 'success',
    data: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusCounts,
      recentOrders
    }
  })
})