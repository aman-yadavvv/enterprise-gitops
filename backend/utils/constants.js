export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded'
}

export const PAYMENT_METHODS = {
  CARD: 'Card',
  PAYPAL: 'PayPal',
  APPLE_PAY: 'Apple Pay',
  GOOGLE_PAY: 'Google Pay'
}

export const CATEGORIES = [
  'Running',
  'Classic',
  'Lifestyle',
  'Limited Edition',
  'Training',
  'Casual'
]

export const SIZES = [
  'US 6', 'US 6.5', 'US 7', 'US 7.5',
  'US 8', 'US 8.5', 'US 9', 'US 9.5',
  'US 10', 'US 10.5', 'US 11', 'US 11.5',
  'US 12'
]

export const GENDER = {
  MEN: 'Men',
  WOMEN: 'Women',
  UNISEX: 'Unisex'
}

export const REGEX = {
  EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  PHONE: /^\+?[\d\s-]{10,}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/
}

export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  DOCUMENT: ['application/pdf', 'application/msword', 'text/plain']
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
}

export const CACHE_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  FEATURED: 'featured',
  USER: 'user'
}

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400 // 24 hours
}

export const SORT_OPTIONS = {
  NEWEST: 'newest',
  PRICE_LOW: 'price-low',
  PRICE_HIGH: 'price-high',
  RATING: 'rating',
  POPULAR: 'popular'
}

export const LIMITS = {
  MAX_PRODUCT_IMAGES: 10,
  MAX_REVIEW_LENGTH: 1000,
  MAX_ORDER_NOTES: 500,
  MAX_PRODUCT_NAME: 100,
  MAX_PRODUCT_DESC: 2000
}

export const ERROR_MESSAGES = {
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  VALIDATION_ERROR: 'Validation error',
  DUPLICATE: 'Duplicate entry',
  INVALID_CREDENTIALS: 'Invalid credentials',
  TOKEN_EXPIRED: 'Token expired',
  TOKEN_INVALID: 'Invalid token',
  RATE_LIMIT: 'Too many requests, please try again later'
}

export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  LOGOUT_SUCCESS: 'Logout successful'
}