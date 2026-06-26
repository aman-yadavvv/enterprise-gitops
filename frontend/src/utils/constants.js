// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/updateprofile',
    UPDATE_PASSWORD: '/auth/updatepassword'
  },
  PRODUCTS: {
    BASE: '/products',
    CATEGORIES: '/products/categories',
    FEATURED: '/products/featured',
    REVIEWS: (id) => `/products/${id}/reviews`
  },
  CART: {
    BASE: '/cart'
  },
  ORDERS: {
    BASE: '/orders'
  },
  PAYMENTS: {
    BASE: '/payments'
  }
}

// Product categories
export const CATEGORIES = [
  'Running',
  'Classic',
  'Lifestyle',
  'Limited Edition',
  'Training',
  'Casual'
]

// Shoe sizes
export const SHOE_SIZES = [
  'US 6', 'US 6.5', 'US 7', 'US 7.5',
  'US 8', 'US 8.5', 'US 9', 'US 9.5',
  'US 10', 'US 10.5', 'US 11', 'US 11.5',
  'US 12'
]

// Colors
export const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Pink', hex: '#FF69B4' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Navy', hex: '#000080' }
]

// Brands
export const BRANDS = [
  'Nike',
  'Adidas',
  'Puma',
  'New Balance',
  'Reebok',
  'Converse',
  'Vans',
  'Asics',
  'Under Armour',
  'Saucony'
]

// Sort options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' }
]

// Payment methods
export const PAYMENT_METHODS = [
  'Card',
  'PayPal',
  'Apple Pay',
  'Google Pay'
]

// Order status
export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded'
}

// Shipping countries
export const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Brazil',
  'India',
  'Japan',
  'South Korea'
]

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
  WISHLIST: 'wishlist'
}

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}

// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 400,
  SLOW: 600,
  VERY_SLOW: 1000
}