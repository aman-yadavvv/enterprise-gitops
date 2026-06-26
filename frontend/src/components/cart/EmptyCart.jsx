import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'

const EmptyCart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-[60vh] flex items-center justify-center bg-light"
    >
      <div className="text-center max-w-md mx-auto p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6"
        >
          <FiShoppingBag className="w-16 h-16 text-primary-500" />
        </motion.div>

        <h2 className="text-3xl font-display font-bold text-dark mb-3">
          Your cart is empty
        </h2>
        
        <p className="text-gray-500 mb-8">
          Looks like you haven't added any sneakers to your cart yet. 
          Explore our collection and find your perfect pair!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="px-8 py-3 bg-primary-500 text-white font-semibold rounded-full hover:bg-primary-600 transition-colors"
          >
            Start Shopping
          </Link>
          <Link
            to="/"
            className="px-8 py-3 border-2 border-dark text-dark font-semibold rounded-full hover:bg-dark hover:text-white transition-colors"
          >
            Go Home
          </Link>
        </div>

        {/* Featured Categories */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <p className="text-sm font-semibold text-dark">Running</p>
            <p className="text-xs text-gray-400">20+ styles</p>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <p className="text-sm font-semibold text-dark">Classic</p>
            <p className="text-xs text-gray-400">15+ styles</p>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <p className="text-sm font-semibold text-dark">Lifestyle</p>
            <p className="text-xs text-gray-400">18+ styles</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EmptyCart