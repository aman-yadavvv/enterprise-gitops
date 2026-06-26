import { seedProducts } from './products.js'
import { seedCategories } from './categories.js'
import { seedUsers } from './users.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const runSeeders = async () => {
  console.log('🚀 Starting database seeding...')
  console.log('📦 Environment:', process.env.NODE_ENV || 'development')
  console.log('')

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Run user seeder
    console.log('📝 Seeding users...')
    await seedUsers()
    console.log('')

    // Run product seeder
    console.log('📝 Seeding products...')
    await seedProducts()
    console.log('✅ Products seeded successfully')
    console.log('')

    // Run category seeder
    console.log('📝 Seeding categories...')
    await seedCategories()
    console.log('✅ Categories seeded successfully')
    console.log('')

    console.log('🎉 All seeders completed successfully!')
    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    try {
      await mongoose.connection.close()
    } catch (e) {}
    process.exit(1)
  }
}

// Run seeders
runSeeders()