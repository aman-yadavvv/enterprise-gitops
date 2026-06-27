import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { useFeaturedProducts } from '../../hooks/useProducts'

const HeroSection = () => {
  const { data, isLoading } = useFeaturedProducts()
  const featuredProduct = data?.data?.products?.[0]

  // Dynamic values or fallback static values
  const hasProduct = !!featuredProduct
  const tag = hasProduct ? `🔥 Featured: ${featuredProduct.brand}` : '🔥 New Collection 2026'
  const titleText = hasProduct ? (
    <>
      <span className="text-white">Introducing</span>
      <br />
      <span className="gradient-text">{featuredProduct.name}</span>
    </>
  ) : (
    <>
      <span className="text-white">Step Into</span>
      <br />
      <span className="gradient-text">The Future</span>
      <br />
      <span className="text-white">Of Style</span>
    </>
  )
  
  const description = hasProduct 
    ? featuredProduct.description 
    : 'Discover the perfect blend of comfort and style with our premium collection of sneakers. Designed for those who dare to be different.'

  const primaryBtnText = hasProduct ? 'Buy Now' : 'Shop Now'
  const primaryBtnLink = hasProduct ? `/product/${featuredProduct._id}` : '/shop'
  const secondaryBtnLink = '/shop'
  
  const mainImage = hasProduct 
    ? (featuredProduct.images?.[0]?.url || '/assets/placeholder.jpg')
    : '/assets/hero-sneaker.webp'

  // Discount or Price badge
  const discountBadge = hasProduct && featuredProduct.discountPrice ? (
    <div className="text-center">
      <p className="text-2xl font-bold text-white">
        {Math.round(((featuredProduct.price - featuredProduct.discountPrice) / featuredProduct.price) * 100)}%
      </p>
      <p className="text-xs text-gray-300">Off Selected</p>
    </div>
  ) : (
    <div className="text-center">
      <p className="text-2xl font-bold text-white">50%</p>
      <p className="text-xs text-gray-300">Limited Offer</p>
    </div>
  )

  // Views or sold badge
  const viewsBadge = hasProduct ? (
    <div className="flex items-center gap-2">
      <span className="text-sm text-white font-semibold">{featuredProduct.views || 0} views</span>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-8 h-8 rounded-full bg-primary-500 border-2 border-dark" />
        ))}
      </div>
      <span className="text-sm text-white font-semibold">2K+ sold</span>
    </div>
  )

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-dark via-dark to-primary-900">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-500 rounded-full blur-3xl animate-pulse animation-delay-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse animation-delay-200" />
      </div>

      <div className="container-custom relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full"
            >
              <span className="text-primary-400 text-sm font-semibold">
                {tag}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-display font-extrabold leading-tight"
            >
              {titleText}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-300 max-w-lg leading-relaxed"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to={primaryBtnLink}
                className="group relative px-8 py-4 bg-primary-500 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/30"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {primaryBtnText}
                  <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link
                to={secondaryBtnLink}
                className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                Explore Collection
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 pt-8 border-t border-white/10"
            >
              <div>
                <p className="text-3xl font-bold text-white">10K+</p>
                <p className="text-sm text-gray-400">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-gray-400">Premium Styles</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">4.9★</p>
                <p className="text-sm text-gray-400">Average Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-lg"
            >
              <img
                src={mainImage}
                alt="Premium Sneaker"
                className="w-full h-auto drop-shadow-2xl"
              />
              {/* Floating Badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -top-10 -right-10 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
              >
                {discountBadge}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-5 -left-5 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
              >
                {viewsBadge}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection