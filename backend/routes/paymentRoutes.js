import express from 'express'
import {
  createPaymentIntent,
  confirmPayment,
  stripeWebhook,
  getPaymentMethods
} from '../controllers/paymentController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Webhook route (must be raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

// Protected routes
router.use(protect)

router.get('/methods', getPaymentMethods)
router.post('/create-payment-intent', createPaymentIntent)
router.post('/confirm', confirmPayment)

export default router