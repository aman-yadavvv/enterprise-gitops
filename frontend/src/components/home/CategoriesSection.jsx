import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const CategoriesSection = () => {
  const categories = [
    {
      name: 'Running',
      image: '/assets/category-running.jpg',
      count: '120+ Styles',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Classic',
      image: '/assets/category-classic.jpg',
      count: '85+ Styles',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Lifestyle',
      image: '/assets/category-lifestyle.jpg',
      count: '95+ Styles',
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'Limited Edition',
      image: '/assets/category-limited.jpg',
      count: '30+ Styles',
      color: 'from-green-500 to-teal-500',
    },
  ]

  return (
    <section className="section-padding bg-dark">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
            Shop by Category
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-4 text-white">
            Explore Our <span className="gradient-text">Collections</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Find the perfect pair for every occasion. From running to lifestyle, 
            we've got you covered.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl cursor-pointer"
            >
              <div className="aspect-square relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform group-hover:translate-y-[-8px] transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm">{category.count}</p>
                    <div className="mt-3 flex items-center text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-4">
                      <span>Shop Now</span>
                      <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection