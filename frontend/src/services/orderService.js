import api from './api'

export const getOrders = async (filters = {}) => {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '') {
      params.append(key, value)
    }
  })

  const response = await api.get(`/orders?${params.toString()}`)
  return response.data
}

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`)
  return response.data
}

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData)
  return response.data
}

export const cancelOrder = async (id, reason) => {
  const response = await api.post(`/orders/${id}/cancel`, { reason })
  return response.data
}

export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}/status`, { status })
  return response.data
}

export const getOrderStats = async () => {
  const response = await api.get('/orders/stats')
  return response.data
}

export const getOrderByPaymentIntent = async (paymentIntentId) => {
  const response = await api.get(`/orders/payment/${paymentIntentId}`)
  return response.data
}