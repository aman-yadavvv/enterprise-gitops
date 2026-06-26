// Email validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Password validation
export const validatePassword = (password) => {
  return password && password.length >= 6
}

// Phone validation
export const validatePhone = (phone) => {
  const regex = /^\+?[\d\s-]{10,}$/
  return regex.test(phone)
}

// Name validation
export const validateName = (name) => {
  return name && name.length >= 2 && name.length <= 50
}

// URL validation
export const validateURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// ZIP code validation
export const validateZipCode = (zipCode) => {
  const regex = /^\d{5}(-\d{4})?$/
  return regex.test(zipCode)
}

// Credit card validation (Luhn algorithm)
export const validateCreditCard = (cardNumber) => {
  const str = cardNumber.replace(/\s/g, '')
  if (!/^\d+$/.test(str)) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = str.length - 1; i >= 0; i--) {
    let digit = parseInt(str[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

// CVV validation
export const validateCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv)
}

// Expiry date validation
export const validateExpiryDate = (month, year) => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  
  const expYear = parseInt(year)
  const expMonth = parseInt(month)
  
  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false
  if (expMonth < 1 || expMonth > 12) return false
  
  return true
}

// Required field validation
export const isRequired = (value) => {
  return value !== undefined && value !== null && value !== ''
}

// Number validation
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

// Positive number validation
export const isPositiveNumber = (value) => {
  return isNumber(value) && Number(value) > 0
}

// Integer validation
export const isInteger = (value) => {
  return Number.isInteger(Number(value))
}

// Range validation
export const isInRange = (value, min, max) => {
  const num = Number(value)
  return num >= min && num <= max
}

// Length validation
export const isLengthValid = (value, min, max) => {
  if (!value) return false
  const length = value.length
  return length >= min && length <= max
}

// Enum validation
export const isEnum = (value, enumValues) => {
  return enumValues.includes(value)
}

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {}
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field]
    const fieldErrors = []
    
    if (fieldRules.required && !isRequired(value)) {
      fieldErrors.push(`${field} is required`)
    }
    
    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      fieldErrors.push(`${field} must be at least ${fieldRules.minLength} characters`)
    }
    
    if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
      fieldErrors.push(`${field} must be at most ${fieldRules.maxLength} characters`)
    }
    
    if (fieldRules.email && value && !validateEmail(value)) {
      fieldErrors.push(`${field} must be a valid email`)
    }
    
    if (fieldRules.phone && value && !validatePhone(value)) {
      fieldErrors.push(`${field} must be a valid phone number`)
    }
    
    if (fieldRules.zipCode && value && !validateZipCode(value)) {
      fieldErrors.push(`${field} must be a valid zip code`)
    }
    
    if (fieldRules.pattern && value && !fieldRules.pattern.test(value)) {
      fieldErrors.push(`${field} has an invalid format`)
    }
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Sanitize string
export const sanitizeString = (str) => {
  if (!str) return ''
  return str
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
}

// Sanitize email
export const sanitizeEmail = (email) => {
  if (!email) return ''
  return email.toLowerCase().trim()
}

// Escape HTML
export const escapeHTML = (str) => {
  if (!str) return ''
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  return str.replace(/[&<>"']/g, (char) => htmlEntities[char])
}