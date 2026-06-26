import React from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'

const ProductInfo = ({ product }) => {
  const {
    name,
    brand,
    category,
    price,
    discountPrice,
    averageRating,
    totalReviews,
    description,
    specifications,
    isNew,
    isOnSale
  } = product

  const finalPrice = discountPrice || price

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Brand & Category */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <span>{brand}</span>
        <span>•</span>
        <span>{category}</span>
      </div>

      {/* Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-dark">{name}</h1>

      {/* Badges */}
      <div className="flex items-center gap-2 mt-3">
        {isNew && (
          <span className="px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
            NEW
          </span>
        )}
        {isOnSale && (
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            SALE
          </span>
        )}
        {product.stock <= 10 && product.stock > 0 && (
          <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 mt-4">
        <div className="flex items-center gap-1">
          <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{averageRating.toFixed(1)}</span>
        </div>
        <span className="text-gray-400">|</span>
        <span className="text-gray-500">{totalReviews} reviews</span>
      </div>

      {/* Price */}
      <div className="mt-4">
        <span className="text-3xl font-bold text-primary-500">${finalPrice}</span>
        {discountPrice && (
          <>
            <span className="ml-3 text-lg text-gray-400 line-through">${price}</span>
            <span className="ml-2 text-sm text-green-500 font-semibold">
              Save ${(price - discountPrice).toFixed(2)}
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-dark mb-2">Description</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      {/* Specifications */}
      {specifications && (
        <div className="mt-6 grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
          {specifications.material && (
            <div>
              <p className="text-xs text-gray-500">Material</p>
              <p className="text-sm font-medium text-dark">{specifications.material}</p>
            </div>
          )}
          {specifications.soleType && (
            <div>
              <p className="text-xs text-gray-500">Sole Type</p>
              <p className="text-sm font-medium text-dark">{specifications.soleType}</p>
            </div>
          )}
          {specifications.weight && (
            <div>
              <p className="text-xs text-gray-500">Weight</p>
              <p className="text-sm font-medium text-dark">{specifications.weight}</p>
            </div>
          )}
          {specifications.gender && (
            <div>
              <p className="text-xs text-gray-500">Gender</p>
              <p className="text-sm font-medium text-dark">{specifications.gender}</p>
            </div>
          )}
        </div>
      )}

      {/* Features */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiTruck className="w-4 h-4 text-primary-500" />
          <span>Free Shipping</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiRefreshCw className="w-4 h-4 text-primary-500" />
          <span>30-Day Returns</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiShield className="w-4 h-4 text-primary-500" />
          <span>Authentic</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductInfo