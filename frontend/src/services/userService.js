import api from './api'

export const getUsers = async (filters = {}) => {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '' && value !== 'all') {
      params.append(key, value)
    }
  })

  const response = await api.get(`/users?${params.toString()}`)
  return response.data
}

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export const getUserStats = async () => {
  const response = await api.get('/users/stats')
  return response.data
}

export const updateUser = async (id, userData) => {
  const response = await api.patch(`/users/${id}`, userData)
  return response.data
}

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`)
  return response.data
}
