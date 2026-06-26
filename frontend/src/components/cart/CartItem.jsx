import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiX, FiPlus, FiMinus } from 'react-icons/fi'
import { useCart } from '../../hooks/useCart'

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart()

  const { id, name, price, image, size, color, quantity } = item

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <Link to={`/product/${id}`} className="flex-shrink-0">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
            <img
              src={image || '/assets/placeholder.jpg'}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link to={`/product/${id}`}>
              <h3 className="font-semibold text-dark hover:text-primary-500 transition-colors">
                {name}
              </h3>
            </Link>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span>Size: {size}</span>
              <span>•</span>
              <span>Color: {color}</span>
            </div>
            <div className="mt-2">
              <span className="text-lg font-bold text-primary-500">
                ${(price * quantity).toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-gray-400">
                ${price} each
              </span>
            </div>
          </div>

          {/* Quantity Controls & Remove */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-2 hover:bg-gray-50 transition-colors"
              >
                <FiMinus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 hover:bg-gray-50 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => removeFromCart(id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CartItem