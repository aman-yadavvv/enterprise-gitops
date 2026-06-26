import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { FiArrowLeft, FiHeart, FiShare2, FiStar, FiCheck } from 'react-icons/fi'
import { getProduct } from '../services/productService'
import { useCart } from '../hooks/useCart'
import ProductImageGallery from '../components/product/ProductImageGallery'
import ProductInfo from '../components/product/ProductInfo'
import SizeSelector from '../components/product/SizeSelector'
import AddToCartButton from '../components/product/AddToCartButton'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

const ProductDetailPage = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { data, isLoading, error } = useQuery(
    ['product', id],
    () => getProduct(id),
    {
      onSuccess: (data) => {
        const product = data.data.product
        if (product.sizes && product.sizes.length > 0) {
          setSelectedSize(product.sizes[0])
        }
        if (product.colors && product.colors.length > 0) {
          setSelectedColor(product.colors[0].name)
        }
      }
    }
  )

  if (isLoading) return <Loader fullScreen />
  if (error) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500">Error loading product</h2>
        <p className="text-gray-600 mt-2">{error.message}</p>
        <Link to="/shop" className="inline-block mt-4 text-primary-500 hover:underline">
          Back to Shop
        </Link>
      </div>
    )
  }

  const product = data?.data?.product

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/shop" className="inline-block mt-4 text-primary-500 hover:underline">
          Back to Shop
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    if (!selectedColor) {
      toast.error('Please select a color')
      return
    }

    addToCart({
      id: product._id,
      name: product.name,
      price: product.finalPrice,
      image: product.images?.[0]?.url || '/assets/placeholder.jpg',
      size: selectedSize,
      color: selectedColor,
      quantity
    })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name} on SoleStyle!`,
        url: window.location.href
      })
    } catch (error) {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-light min-h-screen pt-8 pb-16"
    >
      <div className="container-custom">
        {/* Back Button */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-dark transition-colors mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Image Gallery */}
          <ProductImageGallery images={product.images} name={product.name} />

          {/* Right - Product Info */}
          <div>
            <ProductInfo product={product} />

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-dark mb-3">
                  Color: <span className="font-normal">{selectedColor}</span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-primary-500 scale-110'
                          : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex || '#000' }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />
            )}

            {/* Quantity */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-dark mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <AddToCartButton
                onClick={handleAddToCart}
                isInStock={product.stock > 0}
                className="flex-1"
              />
              
              <button
                onClick={handleWishlist}
                className={`p-4 rounded-full border-2 transition-all ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-4 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>

            {/* Stock Status */}
            <div className="mt-6 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {product.stock > 0 
                  ? `In Stock (${product.stock} available)` 
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-gray-100">
              <div className="text-center">
                <p className="text-sm font-semibold text-dark">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over $100</p>
              </div>
              <div className="text-center border-x border-gray-100">
                <p className="text-sm font-semibold text-dark">30-Day Returns</p>
                <p className="text-xs text-gray-500">Hassle-free returns</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-dark">Authentic</p>
                <p className="text-xs text-gray-500">100% genuine products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductDetailPage