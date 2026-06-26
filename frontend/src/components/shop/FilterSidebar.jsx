import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
    rating: true,
    brand: true
  })

  const categories = ['All', 'Running', 'Classic', 'Lifestyle', 'Limited Edition', 'Training', 'Casual']
  const sizes = ['US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11']
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Green', hex: '#00FF00' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Orange', hex: '#FFA500' }
  ]
  const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Converse', 'Vans']
  const ratings = [5, 4, 3, 2, 1]

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const SectionHeader = ({ title, section }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full py-3 text-left font-semibold text-dark"
    >
      <span>{title}</span>
      {expandedSections[section] ? <FiChevronUp /> : <FiChevronDown />}
    </button>
  )

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Filters</h3>
        <button
          onClick={() => onFilterChange({
            category: '',
            brand: '',
            minPrice: '',
            maxPrice: '',
            size: '',
            color: '',
            rating: ''
          })}
          className="text-sm text-primary-500 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="border-b border-gray-100">
        <SectionHeader title="Category" section="category" />
        {expandedSections.category && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-3 space-y-2"
          >
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={category === 'All' ? '' : category}
                  checked={filters.category === (category === 'All' ? '' : category)}
                  onChange={(e) => onFilterChange({ category: e.target.value })}
                  className="w-4 h-4 text-primary-500"
                />
                <span className="text-sm text-gray-600">{category}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-100">
        <SectionHeader title="Price Range" section="price" />
        {expandedSections.price && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-3"
          >
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onFilterChange({ minPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Size */}
      <div className="border-b border-gray-100">
        <SectionHeader title="Size" section="size" />
        {expandedSections.size && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-3"
          >
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => onFilterChange({ 
                    size: filters.size === size ? '' : size 
                  })}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    filters.size === size
                      ? 'border-primary-500 bg-primary-50 text-primary-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Color */}
      <div className="border-b border-gray-100">
        <SectionHeader title="Color" section="color" />
        {expandedSections.color && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-3"
          >
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => onFilterChange({ 
                    color: filters.color === color.name ? '' : color.name 
                  })}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    filters.color === color.name
                      ? 'border-primary-500 scale-110'
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Rating */}
      <div className="border-b border-gray-100">
        <SectionHeader title="Rating" section="rating" />
        {expandedSections.rating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-3 space-y-2"
          >
            {ratings.map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === String(rating)}
                  onChange={(e) => onFilterChange({ rating: e.target.value })}
                  className="w-4 h-4 text-primary-500"
                />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-500">& up</span>
                </div>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Brand */}
      <div>
        <SectionHeader title="Brand" section="brand" />
        {expandedSections.brand && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-3 space-y-2"
          >
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  value={brand}
                  checked={filters.brand === brand}
                  onChange={(e) => onFilterChange({ brand: e.target.value })}
                  className="w-4 h-4 text-primary-500"
                />
                <span className="text-sm text-gray-600">{brand}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default FilterSidebar