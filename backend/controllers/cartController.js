import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { AppError } from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id })
    .populate('items.product', 'name price images colors sizes')

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [],
      totalPrice: 0,
      totalItems: 0
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  })
})

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1, size, color } = req.body

  // Check if product exists
  const product = await Product.findById(productId)
  if (!product) {
    return next(new AppError('Product not found', 404))
  }

  // Check stock
  if (!product.isInStock(quantity)) {
    return next(new AppError('Insufficient stock', 400))
  }

  let cart = await Cart.findOne({ user: req.user.id })

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [],
      totalPrice: 0,
      totalItems: 0
    })
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId && 
    item.size === size && 
    item.color === color
  )

  if (existingItemIndex > -1) {
    // Update quantity
    const newQuantity = cart.items[existingItemIndex].quantity + quantity
    if (!product.isInStock(newQuantity)) {
      return next(new AppError('Insufficient stock', 400))
    }
    cart.items[existingItemIndex].quantity = newQuantity
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      size: size || product.sizes[0],
      color: color || product.colors[0]?.name,
      price: product.finalPrice
    })
  }

  // Update cart totals
  await cart.updateTotals()
  await cart.populate('items.product', 'name price images colors')

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  })
})

// @desc    Update cart item quantity
// @route   PATCH /api/cart/:itemId
// @access  Private
export const updateCartItem = catchAsync(async (req, res, next) => {
  const { quantity } = req.body
  const { itemId } = req.params

  const cart = await Cart.findOne({ user: req.user.id })
  if (!cart) {
    return next(new AppError('Cart not found', 404))
  }

  const itemIndex = cart.items.findIndex(
    item => item._id.toString() === itemId
  )

  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart', 404))
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1)
  } else {
    const product = await Product.findById(cart.items[itemIndex].product)
    if (!product.isInStock(quantity)) {
      return next(new AppError('Insufficient stock', 400))
    }
    cart.items[itemIndex].quantity = quantity
  }

  await cart.updateTotals()
  await cart.populate('items.product', 'name price images colors')

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  })
})

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = catchAsync(async (req, res, next) => {
  const { itemId } = req.params

  const cart = await Cart.findOne({ user: req.user.id })
  if (!cart) {
    return next(new AppError('Cart not found', 404))
  }

  cart.items = cart.items.filter(
    item => item._id.toString() !== itemId
  )

  await cart.updateTotals()

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart',
    data: {
      cart
    }
  })
})

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id })
  if (!cart) {
    return next(new AppError('Cart not found', 404))
  }

  cart.items = []
  cart.totalPrice = 0
  cart.totalItems = 0
  await cart.save()

  res.status(200).json({
    status: 'success',
    message: 'Cart cleared successfully',
    data: {
      cart
    }
  })
})