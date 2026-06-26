import Stripe from 'stripe'
import Order from '../models/Order.js'
import { AppError } from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
export const createPaymentIntent = catchAsync(async (req, res, next) => {
  const { orderId } = req.body

  const order = await Order.findById(orderId)
  if (!order) {
    return next(new AppError('Order not found', 404))
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to pay for this order', 403))
  }

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // Convert to cents
    currency: 'usd',
    metadata: {
      orderId: order._id.toString(),
      userId: req.user.id
    },
    receipt_email: req.user.email,
    automatic_payment_methods: {
      enabled: true,
    },
  })

  res.status(200).json({
    status: 'success',
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  })
})

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = catchAsync(async (req, res, next) => {
  const { paymentIntentId, orderId } = req.body

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  
  if (paymentIntent.status !== 'succeeded') {
    return next(new AppError('Payment not successful', 400))
  }

  const order = await Order.findById(orderId)
  if (!order) {
    return next(new AppError('Order not found', 404))
  }

  // Update order
  order.isPaid = true
  order.paidAt = new Date()
  order.paymentResult = {
    id: paymentIntent.id,
    status: paymentIntent.status,
    updateTime: new Date().toISOString(),
    emailAddress: paymentIntent.receipt_email
  }

  await order.save()

  res.status(200).json({
    status: 'success',
    message: 'Payment confirmed successfully',
    data: {
      order
    }
  })
})

// @desc    Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public
export const stripeWebhook = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log(`PaymentIntent ${paymentIntent.id} was successful!`)
      
      // Update order status
      const orderId = paymentIntent.metadata.orderId
      if (orderId) {
        const order = await Order.findById(orderId)
        if (order) {
          order.isPaid = true
          order.paidAt = new Date()
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            updateTime: new Date().toISOString(),
            emailAddress: paymentIntent.receipt_email
          }
          await order.save()
        }
      }
      break
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      console.log(`PaymentIntent ${failedPayment.id} failed!`)
      break
      
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
})

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
export const getPaymentMethods = catchAsync(async (req, res, next) => {
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit / Debit Card',
      icon: '💳',
      description: 'Pay securely with your card'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      description: 'Pay with your PayPal account'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: '🍎',
      description: 'Pay with Apple Pay'
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      icon: '📱',
      description: 'Pay with Google Pay'
    }
  ]

  res.status(200).json({
    status: 'success',
    data: {
      paymentMethods
    }
  })
})