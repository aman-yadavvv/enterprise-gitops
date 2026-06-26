import { REGEX } from './constants.js'

export const isValidEmail = (email) => {
  return REGEX.EMAIL.test(email)
}

export const isValidPassword = (password) => {
  return password && password.length >= 6
}

export const isValidPhone = (phone) => {
  return REGEX.PHONE.test(phone)
}

export const isValidZipCode = (zipCode) => {
  return REGEX.ZIP_CODE.test(zipCode)
}

export const isValidURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

export const isRequired = (value) => {
  return value !== undefined && value !== null && value !== ''
}

export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

export const isPositiveNumber = (value) => {
  return isNumber(value) && Number(value) > 0
}

export const isInteger = (value) => {
  return Number.isInteger(Number(value))
}

export const isInRange = (value, min, max) => {
  const num = Number(value)
  return num >= min && num <= max
}

export const isLengthValid = (value, min, max) => {
  if (!value) return false
  const length = value.length
  return length >= min && length <= max
}

export const isEnum = (value, enumValues) => {
  return enumValues.includes(value)
}

export const sanitizeString = (str) => {
  if (!str) return ''
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
}

export const sanitizeEmail = (email) => {
  if (!email) return ''
  return email.toLowerCase().trim()
}

export const validateProductData = (data) => {
  const errors = []
  
  if (!isRequired(data.name)) {
    errors.push('Product name is required')
  } else if (!isLengthValid(data.name, 2, 100)) {
    errors.push('Product name must be between 2 and 100 characters')
  }

  if (!isRequired(data.description)) {
    errors.push('Product description is required')
  } else if (!isLengthValid(data.description, 10, 2000)) {
    errors.push('Product description must be between 10 and 2000 characters')
  }

  if (!isRequired(data.price)) {
    errors.push('Product price is required')
  } else if (!isPositiveNumber(data.price)) {
    errors.push('Product price must be a positive number')
  }

  if (!isRequired(data.category)) {
    errors.push('Product category is required')
  }

  if (!isRequired(data.brand)) {
    errors.push('Product brand is required')
  }

  if (!isRequired(data.stock)) {
    errors.push('Product stock is required')
  } else if (!isInteger(data.stock) || data.stock < 0) {
    errors.push('Product stock must be a non-negative integer')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateUserData = (data) => {
  const errors = []

  if (!isRequired(data.name)) {
    errors.push('Name is required')
  } else if (!isLengthValid(data.name, 2, 50)) {
    errors.push('Name must be between 2 and 50 characters')
  }

  if (!isRequired(data.email)) {
    errors.push('Email is required')
  } else if (!isValidEmail(data.email)) {
    errors.push('Invalid email format')
  }

  if (data.password) {
    if (!isLengthValid(data.password, 6, 50)) {
      errors.push('Password must be at least 6 characters')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateOrderData = (data) => {
  const errors = []

  if (!isRequired(data.shippingAddress)) {
    errors.push('Shipping address is required')
  } else {
    const address = data.shippingAddress
    if (!isRequired(address.street)) {
      errors.push('Street address is required')
    }
    if (!isRequired(address.city)) {
      errors.push('City is required')
    }
    if (!isRequired(address.state)) {
      errors.push('State is required')
    }
    if (!isRequired(address.zipCode)) {
      errors.push('Zip code is required')
    } else if (!isValidZipCode(address.zipCode)) {
      errors.push('Invalid zip code format')
    }
    if (!isRequired(address.country)) {
      errors.push('Country is required')
    }
  }

  if (!isRequired(data.paymentMethod)) {
    errors.push('Payment method is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateReviewData = (data) => {
  const errors = []

  if (!isRequired(data.rating)) {
    errors.push('Rating is required')
  } else if (!isInRange(data.rating, 1, 5)) {
    errors.push('Rating must be between 1 and 5')
  }

  if (data.review && !isLengthValid(data.review, 0, 1000)) {
    errors.push('Review cannot exceed 1000 characters')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}