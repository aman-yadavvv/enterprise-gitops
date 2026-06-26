import React from 'react'
import { motion } from 'framer-motion'

const SizeSelector = ({ sizes, selectedSize, onSelectSize }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-dark">Select Size</h3>
        <button className="text-sm text-primary-500 hover:underline">
          Size Guide
        </button>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {sizes.map((size) => (
          <motion.button
            key={size}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectSize(size)}
            className={`py-3 text-sm font-medium rounded-lg border-2 transition-all ${
              selectedSize === size
                ? 'border-primary-500 bg-primary-50 text-primary-500'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            {size}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default SizeSelector