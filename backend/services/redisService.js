import Redis from 'redis'

let redisClient = null

// Initialize Redis connection
export const connectRedis = async () => {
  try {
    const host = process.env.REDIS_HOST || 'localhost'
    const port = process.env.REDIS_PORT || 6379
    const password = process.env.REDIS_PASSWORD || ''
    
    // Construct the URL for Redis v4
    const url = password 
      ? `redis://:${password}@${host}:${port}`
      : `redis://${host}:${port}`

    redisClient = Redis.createClient({
      url,
      socket: {
        reconnectStrategy: (retries) => {
          // Retry connecting up to 10 times, then stop to avoid logging infinitely
          if (retries > 10) {
            console.error('Redis reconnect limits reached. Disabling cache.')
            return new Error('Redis connection retry limit reached')
          }
          console.log(`Redis reconnect attempt #${retries}`)
          return Math.min(retries * 100, 3000)
        }
      }
    })

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err.message || err)
    })

    redisClient.on('connect', () => {
      console.log('📡 Redis connection initialized')
    })

    redisClient.on('ready', () => {
      console.log('✅ Redis connected and ready')
    })

    await redisClient.connect()
    return redisClient
  } catch (error) {
    console.error('Failed to connect to Redis:', error.message || error)
    return null
  }
}

// Get Redis client
export const getRedisClient = () => {
  if (!redisClient || !redisClient.isOpen) {
    return null
  }
  return redisClient
}

// Set cache with expiry
export const setCache = async (key, value, expiryInSeconds = 3600) => {
  try {
    const client = getRedisClient()
    if (!client) return false
    
    const serialized = typeof value === 'string' ? value : JSON.stringify(value)
    await client.set(key, serialized, { EX: expiryInSeconds })
    return true
  } catch (error) {
    console.error('Redis set error:', error.message || error)
    return false
  }
}

// Get cache
export const getCache = async (key) => {
  try {
    const client = getRedisClient()
    if (!client) return null
    
    const data = await client.get(key)
    if (!data) return null
    
    // Try to parse JSON, return as string if parsing fails
    try {
      return JSON.parse(data)
    } catch {
      return data
    }
  } catch (error) {
    console.error('Redis get error:', error.message || error)
    return null
  }
}

// Delete cache
export const deleteCache = async (key) => {
  try {
    const client = getRedisClient()
    if (!client) return false
    
    await client.del(key)
    return true
  } catch (error) {
    console.error('Redis delete error:', error.message || error)
    return false
  }
}

// Check if key exists
export const existsCache = async (key) => {
  try {
    const client = getRedisClient()
    if (!client) return false
    
    return await client.exists(key) === 1
  } catch (error) {
    console.error('Redis exists error:', error.message || error)
    return false
  }
}

// Get TTL of key
export const getTTL = async (key) => {
  try {
    const client = getRedisClient()
    if (!client) return -1
    
    return await client.ttl(key)
  } catch (error) {
    console.error('Redis ttl error:', error.message || error)
    return -1
  }
}

// Clear all cache
export const clearAllCache = async () => {
  try {
    const client = getRedisClient()
    if (!client) return false
    
    await client.flushAll()
    return true
  } catch (error) {
    console.error('Redis flush error:', error.message || error)
    return false
  }
}

// Get cache keys by pattern
export const getKeys = async (pattern) => {
  try {
    const client = getRedisClient()
    if (!client) return []
    
    return await client.keys(pattern)
  } catch (error) {
    console.error('Redis keys error:', error.message || error)
    return []
  }
}

// Bulk delete by pattern
export const deleteByPattern = async (pattern) => {
  try {
    const client = getRedisClient()
    if (!client) return false
    
    const keys = await getKeys(pattern)
    if (keys.length === 0) return true
    
    await client.del(keys)
    return true
  } catch (error) {
    console.error('Redis delete pattern error:', error.message || error)
    return false
  }
}

// Cache middleware for Express
export const cacheMiddleware = (duration = 3600) => {
  return async (req, res, next) => {
    // If Redis is not connected, skip caching entirely
    const client = getRedisClient()
    if (!client) {
      return next()
    }
    
    const key = `cache:${req.originalUrl || req.url}`
    
    try {
      const cachedData = await getCache(key)
      if (cachedData) {
        return res.json(cachedData)
      }
      
      // Store original send function
      const originalSend = res.json.bind(res)
      
      // Override json method to cache response
      res.json = (data) => {
        setCache(key, data, duration)
        originalSend(data)
      }
      
      next()
    } catch (error) {
      console.error('Cache middleware error:', error.message || error)
      next()
    }
  }
}