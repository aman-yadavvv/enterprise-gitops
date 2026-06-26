import express from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getFeaturedProducts,
  addReview
} from '../controllers/productController.js'
import { protect, restrictTo } from '../middleware/auth.js'
import { validateProduct } from '../middleware/validation.js'
import { cacheMiddleware } from '../services/redisService.js'

const router = express.Router()

// Public routes
router.get('/', cacheMiddleware(300), getProducts)
router.get('/categories', cacheMiddleware(3600), getCategories)
router.get('/featured', cacheMiddleware(300), getFeaturedProducts)
router.get('/:id', cacheMiddleware(300), getProduct)

// Protected routes
router.post('/:id/reviews', protect, addReview)

// Admin routes
router.post('/', protect, restrictTo('admin'), validateProduct, createProduct)
router.patch('/:id', protect, restrictTo('admin'), updateProduct)
router.delete('/:id', protect, restrictTo('admin'), deleteProduct)

export default router