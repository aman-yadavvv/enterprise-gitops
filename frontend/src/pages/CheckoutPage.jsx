import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { createOrder } from '../services/orderService'
import { FiMapPin, FiCreditCard, FiCheckCircle, FiArrowLeft, FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const { items, totalItems, totalAmount, clearCart } = useCart()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  const [paymentMethod, setPaymentMethod] = useState('Card')
  const [notes, setNotes] = useState('')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please log in to proceed to checkout')
      navigate('/login')
    }
  }, [isAuthenticated, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const subtotal = totalAmount
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
      toast.error('Please fill in all shipping fields')
      return
    }

    setIsPlacingOrder(true)
    try {
      const orderData = {
        shippingAddress,
        paymentMethod,
        notes
      }

      const response = await createOrder(orderData)
      setPlacedOrder(response.data.order)
      toast.success('Order placed successfully!')
      clearCart() // Local cart state update
    } catch (error) {
      console.error('Failed to create order:', error)
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (placedOrder) {
    return (
      <div className="min-h-screen bg-light py-16 flex items-center">
        <div className="container-custom max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
              <FiCheckCircle className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-display font-bold text-dark">
              Order <span className="gradient-text">Confirmed!</span>
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Thank you for your purchase! Your order has been placed successfully and is being processed.
            </p>
            
            <div className="bg-light rounded-2xl p-6 border border-gray-100 text-left space-y-3 font-mono text-sm max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-bold text-dark">#{placedOrder._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment:</span>
                <span className="text-dark font-medium">{placedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Price:</span>
                <span className="text-primary-500 font-bold">${placedOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="px-8 py-3 bg-dark text-white font-semibold rounded-full hover:bg-primary-500 transition-colors shadow-lg shadow-dark/10"
              >
                Continue Shopping
              </Link>
              <Link
                to="/"
                className="px-8 py-3 border-2 border-gray-200 text-dark font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                Go to Homepage
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-custom">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-dark transition-colors mb-8"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-display font-bold mb-8">
          Secure <span className="gradient-text">Checkout</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <FiMapPin className="text-primary-500 w-6 h-6" />
                  <h2 className="text-xl font-bold text-dark">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleInputChange}
                      placeholder="e.g. 123 Main St"
                      className="w-full px-4 py-3 bg-light border border-gray-100 rounded-xl text-dark focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Los Angeles"
                      className="w-full px-4 py-3 bg-light border border-gray-100 rounded-xl text-dark focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">State / Province</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      placeholder="e.g. CA"
                      className="w-full px-4 py-3 bg-light border border-gray-100 rounded-xl text-dark focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">ZIP / Postal Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      placeholder="e.g. 90001"
                      className="w-full px-4 py-3 bg-light border border-gray-100 rounded-xl text-dark focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      placeholder="e.g. United States"
                      className="w-full px-4 py-3 bg-light border border-gray-100 rounded-xl text-dark focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Order Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Gate code, special delivery instructions"
                    className="w-full px-4 py-3 bg-light border border-gray-100 rounded-xl text-dark focus:outline-none focus:border-primary-500 min-h-[80px]"
                  />
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <FiCreditCard className="text-primary-500 w-6 h-6" />
                  <h2 className="text-xl font-bold text-dark">Payment Method</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Card', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
                    <label
                      key={method}
                      className={`flex flex-col items-center justify-center p-4 border rounded-2xl cursor-pointer hover:border-primary-500 hover:bg-light transition-all select-none ${
                        paymentMethod === method
                          ? 'border-primary-500 bg-primary-500/5 text-primary-500 font-semibold'
                          : 'border-gray-150 text-gray-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="sr-only"
                      />
                      <span className="text-2xl mb-2">
                        {method === 'Card' ? '💳' : method === 'PayPal' ? '🅿️' : method === 'Apple Pay' ? '🍎' : '📱'}
                      </span>
                      <span className="text-sm text-center">{method}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            </form>
          </div>

          {/* Right Column - Order Summary Panel */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-dark border-b border-gray-100 pb-4">Order Summary</h2>

              {/* Items List */}
              <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 py-3 items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-light border border-gray-100"
                      />
                      <div>
                        <h4 className="font-semibold text-dark text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-400">
                          {item.size} • {item.color} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-dark text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-dark">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-semibold text-dark">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (8%)</span>
                  <span className="font-semibold text-dark">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-500">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-primary-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-t-2 border-white animate-spin"></div>
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <span>Place Order (${total.toFixed(2)})</span>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
