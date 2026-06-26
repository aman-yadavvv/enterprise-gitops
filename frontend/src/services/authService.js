import api from './api'

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
  }
  return response.data
}

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
  }
  return response.data
}

export const logout = async () => {
  try {
    await api.post('/auth/logout')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const updateProfile = async (userData) => {
  const response = await api.patch('/auth/updateprofile', userData)
  if (response.data.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
  }
  return response.data
}

export const updatePassword = async (passwordData) => {
  const response = await api.patch('/auth/updatepassword', passwordData)
  return response.data
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}