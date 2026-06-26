import Product from '../models/Product.js'
import { AppError } from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'
import { deleteByPattern } from '../services/redisService.js'

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = catchAsync(async (req, res, next) => {
  const { 
    category, 
    brand, 
    minPrice, 
    maxPrice, 
    sort, 
    page = 1, 
    limit = 10,
    search,
    featured,
    new: isNew,
    sale,
    size,
    color,
    rating
  } = req.query

  // Build filter object
  const filter = {}
  
  if (category) filter.category = category
  if (brand) filter.brand = brand
  if (featured) filter.isFeatured = featured === 'true'
  if (isNew) filter.isNew = isNew === 'true'
  if (sale) filter.isOnSale = sale === 'true'
  
  // Price range
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }
  
  // Size filter
  if (size) filter.sizes = { $in: [size] }
  
  // Color filter
  if (color) filter['colors.name'] = color
  
  // Rating filter
  if (rating) filter.averageRating = { $gte: Number(rating) }

  // Search
  if (search) {
    filter.$text = { $search: search }
  }

  // Sort options
  let sortOptions = {}
  switch(sort) {
    case 'price-low':
      sortOptions = { price: 1 }
      break
    case 'price-high':
      sortOptions = { price: -1 }
      break
    case 'rating':
      sortOptions = { averageRating: -1 }
      break
    case 'newest':
      sortOptions = { createdAt: -1 }
      break
    case 'popular':
      sortOptions = { views: -1 }
      break
    default:
      sortOptions = { createdAt: -1 }
  }

  // Pagination
  const skip = (page - 1) * limit
  const total = await Product.countDocuments(filter)

  const products = await Product.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  })
})

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
  
  if (!product) {
    return next(new AppError('Product not found', 404))
  }

  // Increment views
  product.views += 1
  await product.save({ validateBeforeSave: false })

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  })
})

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = catchAsync(async (req, res, next) => {
  const productData = req.body
  
  // Generate slug from name
  productData.slug = productData.name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')

  const product = await Product.create(productData)

  // Invalidate products cache
  await deleteByPattern('cache:/api/products*')

  res.status(201).json({
    status: 'success',
    data: {
      product
    }
  })
})

// @desc    Update product
// @route   PATCH /api/products/:id
// @access  Private/Admin
export const updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )

  if (!product) {
    return next(new AppError('Product not found', 404))
  }

  // Invalidate products cache
  await deleteByPattern('cache:/api/products*')

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  })
})

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id)

  if (!product) {
    return next(new AppError('Product not found', 404))
  }

  // Invalidate products cache
  await deleteByPattern('cache:/api/products*')

  res.status(204).json({
    status: 'success',
    data: null
  })
})

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = catchAsync(async (req, res, next) => {
  const categories = await Product.distinct('category')
  
  res.status(200).json({
    status: 'success',
    data: {
      categories
    }
  })
})

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ isFeatured: true })
    .limit(6)
    .sort({ createdAt: -1 })

  res.status(200).json({
    status: 'success',
    data: {
      products
    }
  })
})

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addReview = catchAsync(async (req, res, next) => {
  const { rating, review } = req.body
  const product = await Product.findById(req.params.id)

  if (!product) {
    return next(new AppError('Product not found', 404))
  }

  // Check if user already reviewed
  const alreadyReviewed = product.ratings.find(
    r => r.user.toString() === req.user.id.toString()
  )

  if (alreadyReviewed) {
    return next(new AppError('You have already reviewed this product', 400))
  }

  product.ratings.push({
    user: req.user.id,
    rating: Number(rating),
    review
  })

  await product.save()

  // Invalidate products cache (rating averages changed)
  await deleteByPattern('cache:/api/products*')

  res.status(201).json({
    status: 'success',
    message: 'Review added successfully',
    data: {
      product
    }
  })
})