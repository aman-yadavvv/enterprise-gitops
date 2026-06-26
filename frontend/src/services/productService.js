import api from './api'

export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '' && value !== 'all') {
      params.append(key, value)
    }
  })

  const response = await api.get(`/products?${params.toString()}`)
  return response.data
}

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const getFeaturedProducts = async () => {
  const response = await api.get('/products/featured')
  return response.data
}

export const getCategories = async () => {
  const response = await api.get('/products/categories')
  return response.data
}

export const addReview = async (productId, reviewData) => {
  const response = await api.post(`/products/${productId}/reviews`, reviewData)
  return response.data
}

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData)
  return response.data
}

export const updateProduct = async (id, productData) => {
  const response = await api.patch(`/products/${id}`, productData)
  return response.data
}

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}