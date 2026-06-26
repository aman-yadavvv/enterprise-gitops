import dotenv from 'dotenv'
dotenv.config()

import app from './index.js'
import connectDB from './config/db.js'
import { connectRedis } from './services/redisService.js'
import { autoSeedIfEmpty } from './config/autoSeed.js'

const PORT = process.env.PORT || 5000

// Connect to MongoDB
await connectDB()

// Auto-seed database if empty
await autoSeedIfEmpty()

// Connect to Redis
await connectRedis()

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

export default server