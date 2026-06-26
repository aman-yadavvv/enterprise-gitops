import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiCheck } from 'react-icons/fi'

const AddToCartButton = ({ onClick, isInStock, className = '' }) => {
  const [isAdded, setIsAdded] = useState(false)

  const handleClick = () => {
    if (!isInStock) return
    
    onClick()
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      disabled={!isInStock}
      className={`py-4 px-6 rounded-full font-semibold text-white transition-all flex items-center justify-center gap-2 ${
        isInStock
          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-xl hover:shadow-primary-500/30'
          : 'bg-gray-400 cursor-not-allowed'
      } ${className}`}
    >
      {isAdded ? (
        <>
          <FiCheck className="w-5 h-5" />
          Added to Cart!
        </>
      ) : (
        <>
          <FiShoppingBag className="w-5 h-5" />
          {isInStock ? 'Add to Cart' : 'Out of Stock'}
        </>
      )}
    </motion.button>
  )
}

export default AddToCartButton