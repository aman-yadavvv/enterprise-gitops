import mongoose from 'mongoose'
import User from '../models/User.js'

const users = [
  {
    name: 'SoleStyle Admin',
    email: 'admin@solestyle.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true
  },
  {
    name: 'John Doe',
    email: 'user@solestyle.com',
    password: 'user123',
    role: 'user',
    isVerified: true
  }
]

export const seedUsers = async () => {
  try {
    // Delete existing users (or at least the seeded ones)
    await User.deleteMany({ email: { $in: ['admin@solestyle.com', 'user@solestyle.com'] } })
    console.log('Cleared existing dev users')

    // Insert new users
    await User.create(users)
    console.log('✅ Default users (Admin & Test User) seeded successfully')
  } catch (error) {
    console.error('❌ User seeding error:', error.message || error)
    throw error
  }
}
