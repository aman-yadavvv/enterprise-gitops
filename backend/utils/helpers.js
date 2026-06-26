import crypto from 'crypto'

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex')
}

export const generateOTP = (length = 6) => {
  return Math.floor(Math.random() * (10 ** length - 1) + 10 ** (length - 1)).toString()
}

export const calculateDiscount = (originalPrice, discountPrice) => {
  if (!discountPrice || discountPrice >= originalPrice) return 0
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0
  const total = ratings.reduce((sum, r) => sum + r.rating, 0)
  return Math.round((total / ratings.length) * 10) / 10
}

export const paginate = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const results = data.slice(startIndex, endIndex)

  return {
    results,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: data.length,
      pages: Math.ceil(data.length / limit)
    }
  }
}

export const filterObject = (obj, allowedFields) => {
  return Object.keys(obj)
    .filter(key => allowedFields.includes(key))
    .reduce((newObj, key) => {
      newObj[key] = obj[key]
      return newObj
    }, {})
}

export const omitFields = (obj, fieldsToOmit) => {
  return Object.keys(obj)
    .filter(key => !fieldsToOmit.includes(key))
    .reduce((newObj, key) => {
      newObj[key] = obj[key]
      return newObj
    }, {})
}

export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn()
  } catch (error) {
    if (retries === 0) throw error
    await sleep(delay)
    return retry(fn, retries - 1, delay * 2)
  }
}

export const getDateRange = (days) => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  return { startDate, endDate }
}

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key]
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {})
}

export const sortBy = (array, key, order = 'asc') => {
  return array.sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
}

export const pluck = (array, key) => {
  return array.map(item => item[key])
}

export const compact = (array) => {
  return array.filter(Boolean)
}

export const uniq = (array) => {
  return [...new Set(array)]
}

export const isEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const isPhoneNumber = (phone) => {
  const regex = /^\+?[\d\s-]{10,}$/
  return regex.test(phone)
}

export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const titleCase = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

export const truncate = (str, length = 100, suffix = '...') => {
  if (!str || str.length <= length) return str
  return str.substring(0, length) + suffix
}