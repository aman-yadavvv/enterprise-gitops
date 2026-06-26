import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'
import { useFeaturedProducts } from '../../hooks/useProducts'
import Loader from '../common/Loader'

const FeaturedSection = () => {
  const { data, isLoading, error } = useFeaturedProducts()
  const featuredProducts = data?.data?.products || []

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="section-padding bg-light">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
            Featured Collection
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-4">
            Best Selling <span className="gradient-text">Sneakers</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our most popular styles that combine cutting-edge design with 
            unparalleled comfort.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10 font-semibold">
            Error loading featured products. Please check if your server is running.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product._id || product.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={product.images?.[0]?.url || '/assets/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {product.isNew && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
                      NEW
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Quick View Button */}
                  <Link
                    to={`/product/${product._id || product.id}`}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white text-dark font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 shadow-md hover:bg-primary-500 hover:text-white"
                  >
                    Quick View
                  </Link>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                      <h3 className="text-xl font-bold text-dark group-hover:text-primary-500 transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-bold text-primary-500">
                        ${product.discountPrice || product.price}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-1">
                      {product.colors?.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color.hex || '#000' }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-full hover:bg-primary-500 transition-colors duration-300 text-sm font-semibold"
                    >
                      <FiShoppingBag className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-dark text-dark font-semibold rounded-full hover:bg-dark hover:text-white transition-all duration-300"
          >
            View All Collection
            <FiShoppingBag className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedSection