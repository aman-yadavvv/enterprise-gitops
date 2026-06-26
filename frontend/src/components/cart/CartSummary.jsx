import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { FiTruck, FiShield, FiLock } from 'react-icons/fi'

const CartSummary = () => {
  const { totalItems, totalAmount } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [isCouponApplied, setIsCouponApplied] = useState(false)

  const subtotal = totalAmount
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const discount = isCouponApplied ? subtotal * 0.1 : 0
  const total = subtotal + shipping + tax - discount

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setIsCouponApplied(true)
    } else {
      alert('Invalid coupon code')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-md sticky top-24"
    >
      <h2 className="text-xl font-bold text-dark mb-6">Order Summary</h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({totalItems} items)</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (8%)</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-500">
            <span>Discount (10%)</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary-500">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Coupon Code */}
      <div className="mt-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
            disabled={isCouponApplied}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={isCouponApplied}
            className="px-4 py-2 bg-dark text-white rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-50 text-sm font-semibold"
          >
            Apply
          </button>
        </div>
        {isCouponApplied && (
          <p className="text-sm text-green-500 mt-2">✓ Coupon applied successfully!</p>
        )}
      </div>

      {/* Checkout Button */}
      <Link to="/checkout">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-primary-500/30 transition-all"
        >
          Proceed to Checkout
        </motion.button>
      </Link>

      {/* Trust Badges */}
      <div className="mt-6 space-y-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <FiLock className="w-4 h-4 text-primary-500" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <FiTruck className="w-4 h-4 text-primary-500" />
          <span>Free shipping on orders over $100</span>
        </div>
        <div className="flex items-center gap-2">
          <FiShield className="w-4 h-4 text-primary-500" />
          <span>30-day return policy</span>
        </div>
      </div>
    </motion.div>
  )
}

export default CartSummary