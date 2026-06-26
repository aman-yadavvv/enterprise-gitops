import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { 
  getProducts, 
  getProduct, 
  getFeaturedProducts, 
  getCategories, 
  addReview 
} from '../services/productService'
import toast from 'react-hot-toast'

export const useProducts = (filters = {}) => {
  return useQuery(
    ['products', filters],
    () => getProducts(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000 // 10 minutes
    }
  )
}

export const useProduct = (id) => {
  return useQuery(
    ['product', id],
    () => getProduct(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
      cacheTime: 15 * 60 * 1000
    }
  )
}

export const useFeaturedProducts = () => {
  return useQuery(
    'featuredProducts',
    getFeaturedProducts,
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 15 * 60 * 1000
    }
  )
}

export const useCategories = () => {
  return useQuery(
    'categories',
    getCategories,
    {
      staleTime: 30 * 60 * 1000,
      cacheTime: 60 * 60 * 1000
    }
  )
}

export const useAddReview = (productId) => {
  const queryClient = useQueryClient()

  return useMutation(
    (reviewData) => addReview(productId, reviewData),
    {
      onSuccess: (data) => {
        toast.success('Review added successfully!')
        queryClient.invalidateQueries(['product', productId])
        queryClient.invalidateQueries(['products'])
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add review')
      }
    }
  )
}

export const useProductFilters = () => {
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

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const resetFilters = () => {
    setFilters({
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
  }

  const changePage = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  return {
    filters,
    updateFilters,
    resetFilters,
    changePage
  }
}