import express from 'express'
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserOrders,
  addToWishlist,
  removeFromWishlist
} from '../controllers/userController.js'
import { protect, restrictTo } from '../middleware/auth.js'

const router = express.Router()

// Protected routes (all user routes are protected)
router.use(protect)

// Wishlist routes
router.post('/wishlist', addToWishlist)
router.delete('/wishlist/:productId', removeFromWishlist)

// Address routes
router.post('/address', addAddress)
router.patch('/address/:addressId', updateAddress)
router.delete('/address/:addressId', deleteAddress)

// Order history
router.get('/orders', getUserOrders)

// Admin only routes
router.get('/', restrictTo('admin'), getUsers)
router.get('/stats', restrictTo('admin'), getUserStats)
router.get('/:id', restrictTo('admin'), getUser)
router.patch('/:id', restrictTo('admin'), updateUser)
router.delete('/:id', restrictTo('admin'), deleteUser)

export default router