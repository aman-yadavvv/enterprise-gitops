import express from 'express'
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
} from '../controllers/orderController.js'
import { protect, restrictTo } from '../middleware/auth.js'
import { validateOrder } from '../middleware/validation.js'

const router = express.Router()

// All order routes are protected
router.use(protect)

router.route('/')
  .get(getOrders)
  .post(validateOrder, createOrder)

router.get('/stats', restrictTo('admin'), getOrderStats)

router.route('/:id')
  .get(getOrder)
  .patch(restrictTo('admin'), updateOrderStatus)

router.post('/:id/cancel', cancelOrder)

export default router