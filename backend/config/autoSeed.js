import User from '../models/User.js'
import { seedUsers } from '../seeders/users.js'
import { seedProducts } from '../seeders/products.js'
import { seedCategories } from '../seeders/categories.js'

export const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments()
    if (userCount === 0) {
      console.log('🔄 Database is empty. Running auto-seeding...')
      await seedUsers()
      await seedProducts()
      await seedCategories()
      console.log('🎉 Auto-seeding completed successfully!')
    } else {
      console.log('✅ Database already contains data. Skipping auto-seed.')
    }
  } catch (error) {
    console.error('❌ Auto-seeding failed:', error.message || error)
  }
}
