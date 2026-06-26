import mongoose from 'mongoose'
import Product from '../models/Product.js'
import dotenv from 'dotenv'

dotenv.config()

// This seeder updates products with category-specific data
export const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Update Running category products
    await Product.updateMany(
      { category: 'Running' },
      { 
        $set: { 
          tags: ['running', 'performance', 'athletic', 'cushioned'],
          'specifications.gender': 'Unisex'
        } 
      }
    )

    // Update Classic category products
    await Product.updateMany(
      { category: 'Classic' },
      { 
        $set: { 
          tags: ['classic', 'vintage', 'heritage', 'timeless'],
          'specifications.gender': 'Men'
        } 
      }
    )

    // Update Lifestyle category products
    await Product.updateMany(
      { category: 'Lifestyle' },
      { 
        $set: { 
          tags: ['lifestyle', 'casual', 'everyday', 'streetwear'],
          'specifications.gender': 'Unisex'
        } 
      }
    )

    // Update Limited Edition category products
    await Product.updateMany(
      { category: 'Limited Edition' },
      { 
        $set: { 
          tags: ['limited', 'exclusive', 'collector', 'rare'],
          'specifications.gender': 'Unisex'
        } 
      }
    )

    // Update Training category products
    await Product.updateMany(
      { category: 'Training' },
      { 
        $set: { 
          tags: ['training', 'gym', 'workout', 'durable'],
          'specifications.gender': 'Men'
        } 
      }
    )

    // Update Casual category products
    await Product.updateMany(
      { category: 'Casual' },
      { 
        $set: { 
          tags: ['casual', 'style', 'fashion', 'trendy'],
          'specifications.gender': 'Unisex'
        } 
      }
    )

    console.log('✅ Categories seeded successfully')
  } catch (error) {
    console.error('❌ Seeding error:', error)
    throw error
  }
}

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategories()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}