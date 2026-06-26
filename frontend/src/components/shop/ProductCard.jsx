import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi'
import { useCart } from '../../hooks/useCart'
import toast from 'react-hot-toast'

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const {
    _id,
    name,
    price,
    discountPrice,
    images,
    averageRating,
    totalReviews,
    isNew,
    isOnSale,
    category,
    brand,
    colors,
    sizes,
    stock
  } = product

  const mainImage = images?.find(img => img.isMain)?.url || images?.[0]?.url || '/assets/placeholder.jpg'
  const finalPrice = discountPrice || price
  const isInStock = stock > 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!isInStock) {
      toast.error('Out of stock!')
      return
    }
    addToCart({
      id: _id,
      name,
      price: finalPrice,
      image: mainImage,
      size: sizes?.[0] || 'US 8',
      color: colors?.[0]?.name || 'Default'
    })
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 p-4"
      >
        <Link to={`/product/${_id}`} className="md:w-48 h-48 flex-shrink-0">
          <img
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover rounded-xl"
          />
        </Link>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{brand} • {category}</p>
                <Link to={`/product/${_id}`}>
                  <h3 className="text-xl font-bold hover:text-primary-500 transition-colors">
                    {name}
                  </h3>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-semibold">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400">({totalReviews})</span>
              </div>
            </div>
            <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-bold text-primary-500">${finalPrice}</span>
              {discountPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">${price}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="px-6 py-2 bg-dark text-white rounded-full hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
    >
      <Link to={`/product/${_id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
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
            {!isInStock && (
              <span className="px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded-full">
                OUT OF STOCK
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300"
          >
            <FiHeart
              className={`w-5 h-5 transition-colors ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-dark'
              }`}
            />
          </button>

          {/* Quick Add */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
          >
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="px-6 py-2 bg-white text-dark font-semibold rounded-full shadow-lg hover:bg-primary-500 hover:text-white transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              <FiShoppingBag className="w-4 h-4" />
              {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </motion.div>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${_id}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{brand}</p>
              <h3 className="font-bold text-dark group-hover:text-primary-500 transition-colors line-clamp-1">
                {name}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{averageRating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-primary-500">
              ${finalPrice}
            </span>
            {discountPrice && (
              <span className="text-sm text-gray-400 line-through">${price}</span>
            )}
          </div>

          {/* Color options */}
          {colors && colors.length > 0 && (
            <div className="flex gap-1 mt-3">
              {colors.slice(0, 4).map((color, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.hex || '#000' }}
                  title={color.name}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-xs text-gray-500">+{colors.length - 4}</span>
              )}
            </div>
          )}
        </Link>
      </div>
    </motion.div>
  )
}

export default ProductCard