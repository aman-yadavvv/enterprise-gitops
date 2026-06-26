import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from 'react-query'
import { FiFilter, FiGrid, FiList, FiChevronDown } from 'react-icons/fi'
import ProductGrid from '../components/shop/ProductGrid'
import FilterSidebar from '../components/shop/FilterSidebar'
import SortDropdown from '../components/shop/SortDropdown'
import { getProducts } from '../services/productService'
import Loader from '../components/common/Loader'

const ShopPage = () => {
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    color: '',
    rating: '',
    sort: 'newest',
    page: 1,
    limit: 12
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const { data, isLoading, error, refetch } = useQuery(
    ['products', filters],
    () => getProducts(filters),
    { keepPreviousData: true }
  )

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-light pt-8">
      <div className="container-custom">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            Shop <span className="gradient-text">Sneakers</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Discover our premium collection of sneakers
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-full hover:bg-primary-500 transition-colors duration-300"
            >
              <FiFilter />
              <span>Filters</span>
            </button>
            
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                <FiList />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {data?.data?.products?.length || 0} products
            </span>
            <SortDropdown
              value={filters.sort}
              onChange={(sort) => handleFilterChange({ sort })}
            />
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-72 flex-shrink-0 hidden lg:block"
              >
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <Loader />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading products</p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-full"
                >
                  Retry
                </button>
              </div>
            ) : (
              <ProductGrid
                products={data?.data?.products || []}
                viewMode={viewMode}
                pagination={data?.data?.pagination}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsFilterOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    ✕
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full mt-6 py-3 bg-primary-500 text-white rounded-full font-semibold"
                >
                  Apply Filters
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ShopPage