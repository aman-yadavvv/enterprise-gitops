import Stripe from 'stripe'
import Order from '../models/Order.js'
import { AppError } from '../utils/AppError.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Create Stripe payment intent
export const createPaymentIntent = async (orderId, userId) => {
  try {
    const order = await Order.findById(orderId)
    if (!order) {
      throw new AppError('Order not found', 404)
    }

    // Check if user owns the order
    if (order.user.toString() !== userId) {
      throw new AppError('You do not have permission to pay for this order', 403)
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: userId
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  } catch (error) {
    console.error('Payment intent creation failed:', error)
    throw error
  }
}

// Confirm payment
export const confirmPayment = async (paymentIntentId, orderId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status !== 'succeeded') {
      throw new AppError('Payment not successful', 400)
    }

    const order = await Order.findById(orderId)
    if (!order) {
      throw new AppError('Order not found', 404)
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

    return order
  } catch (error) {
    console.error('Payment confirmation failed:', error)
    throw error
  }
}

// Refund payment
export const refundPayment = async (paymentIntentId, amount = null) => {
  try {
    const refundParams = {
      payment_intent: paymentIntentId
    }

    if (amount) {
      refundParams.amount = Math.round(amount * 100)
    }

    const refund = await stripe.refunds.create(refundParams)
    return refund
  } catch (error) {
    console.error('Refund failed:', error)
    throw error
  }
}

// Create Stripe customer
export const createCustomer = async (email, name, metadata = {}) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    })
    return customer
  } catch (error) {
    console.error('Customer creation failed:', error)
    throw error
  }
}

// Create payment method
export const createPaymentMethod = async (paymentMethodData) => {
  try {
    const paymentMethod = await stripe.paymentMethods.create(paymentMethodData)
    return paymentMethod
  } catch (error) {
    console.error('Payment method creation failed:', error)
    throw error
  }
}

// Attach payment method to customer
export const attachPaymentMethodToCustomer = async (paymentMethodId, customerId) => {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    })
    return paymentMethod
  } catch (error) {
    console.error('Attach payment method failed:', error)
    throw error
  }
}

// Get customer payment methods
export const getCustomerPaymentMethods = async (customerId, type = 'card') => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: type
    })
    return paymentMethods.data
  } catch (error) {
    console.error('Get payment methods failed:', error)
    throw error
  }
}

// Create subscription (if implementing subscription feature)
export const createSubscription = async (customerId, priceId, metadata = {}) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata
    })
    return subscription
  } catch (error) {
    console.error('Subscription creation failed:', error)
    throw error
  }
}

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Subscription cancellation failed:', error)
    throw error
  }
}

// Get subscription status
export const getSubscriptionStatus = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return {
      id: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      items: subscription.items.data
    }
  } catch (error) {
    console.error('Get subscription status failed:', error)
    throw error
  }
}

// Webhook event handler
export const handleWebhookEvent = async (event) => {
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      const orderId = paymentIntent.metadata.orderId
      if (orderId) {
        const order = await Order.findById(orderId)
        if (order && !order.isPaid) {
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
      console.log(`Payment ${failedPayment.id} failed`)
      break
      
    case 'charge.refunded':
      const refund = event.data.object
      console.log(`Refund processed for charge ${refund.id}`)
      break
      
    default:
      console.log(`Unhandled event type ${event.type}`)
  }
}

// Verify webhook signature
export const verifyWebhookSignature = (payload, signature, secret) => {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    throw error
  }
}