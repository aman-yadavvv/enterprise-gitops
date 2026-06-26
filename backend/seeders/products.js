import mongoose from 'mongoose'
import Product from '../models/Product.js'
import dotenv from 'dotenv'

dotenv.config()

const products = [
  {
    name: 'Air Max Pulse',
    slug: 'air-max-pulse',
    description: 'Experience ultimate comfort with the Air Max Pulse. Featuring responsive cushioning and a sleek modern design perfect for both performance and lifestyle.',
    price: 189.99,
    discountPrice: 159.99,
    category: 'Running',
    brand: 'Nike',
    sizes: ['US 7', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Red', hex: '#FF0000' }
    ],
    images: [
      { url: '/assets/sneaker-1.webp', isMain: true }
    ],
    stock: 50,
    isFeatured: true,
    isNew: true,
    tags: ['running', 'performance', 'cushioning'],
    specifications: {
      material: 'Mesh and synthetic',
      soleType: 'Rubber',
      weight: '280g',
      gender: 'Unisex'
    }
  },
  {
    name: 'Vintage Retro 85',
    slug: 'vintage-retro-85',
    description: 'A timeless classic reimagined. The Vintage Retro 85 combines heritage design with modern comfort for the perfect everyday sneaker.',
    price: 159.99,
    discountPrice: 129.99,
    category: 'Classic',
    brand: 'Adidas',
    sizes: ['US 7', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 11'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Grey', hex: '#808080' }
    ],
    images: [
      { url: '/assets/sneaker-2.webp', isMain: true }
    ],
    stock: 35,
    isFeatured: true,
    isNew: false,
    tags: ['classic', 'vintage', 'lifestyle'],
    specifications: {
      material: 'Leather',
      soleType: 'Rubber',
      weight: '320g',
      gender: 'Men'
    }
  },
  {
    name: 'Urban Runner Pro',
    slug: 'urban-runner-pro',
    description: 'Designed for the urban explorer. The Urban Runner Pro delivers exceptional comfort and style for the modern city dweller.',
    price: 219.99,
    discountPrice: 189.99,
    category: 'Lifestyle',
    brand: 'Puma',
    sizes: ['US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Blue', hex: '#0000FF' }
    ],
    images: [
      { url: '/assets/sneaker-3.webp', isMain: true }
    ],
    stock: 25,
    isFeatured: true,
    isNew: true,
    tags: ['urban', 'lifestyle', 'comfort'],
    specifications: {
      material: 'Knit',
      soleType: 'EVA foam',
      weight: '260g',
      gender: 'Unisex'
    }
  },
  {
    name: 'Speed Runner X',
    slug: 'speed-runner-x',
    description: 'Engineered for speed. The Speed Runner X features advanced cushioning and a lightweight design for peak performance.',
    price: 249.99,
    category: 'Running',
    brand: 'New Balance',
    sizes: ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10'],
    colors: [
      { name: 'Red', hex: '#FF0000' },
      { name: 'Black', hex: '#000000' }
    ],
    images: [
      { url: '/assets/sneaker-1.webp', isMain: true }
    ],
    stock: 20,
    isFeatured: false,
    isNew: true,
    tags: ['running', 'performance', 'speed'],
    specifications: {
      material: 'Engineered mesh',
      soleType: 'Carbon plate',
      weight: '230g',
      gender: 'Men'
    }
  },
  {
    name: 'Classic Leather 77',
    slug: 'classic-leather-77',
    description: 'The iconic Classic Leather 77 returns with premium materials and timeless design. A must-have for any sneaker collection.',
    price: 139.99,
    discountPrice: 119.99,
    category: 'Classic',
    brand: 'Reebok',
    sizes: ['US 7', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 11', 'US 12'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Red', hex: '#FF0000' }
    ],
    images: [
      { url: '/assets/sneaker-2.webp', isMain: true }
    ],
    stock: 40,
    isFeatured: false,
    isNew: false,
    tags: ['classic', 'leather', 'vintage'],
    specifications: {
      material: 'Full-grain leather',
      soleType: 'Rubber',
      weight: '340g',
      gender: 'Unisex'
    }
  },
  {
    name: 'Limited Edition Neon',
    slug: 'limited-edition-neon',
    description: 'Stand out from the crowd with this limited edition neon sneaker. Featuring vibrant colors and premium materials.',
    price: 299.99,
    discountPrice: 249.99,
    category: 'Limited Edition',
    brand: 'Converse',
    sizes: ['US 7', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10'],
    colors: [
      { name: 'Neon Green', hex: '#39FF14' },
      { name: 'Neon Pink', hex: '#FF1493' }
    ],
    images: [
      { url: '/assets/sneaker-3.webp', isMain: true }
    ],
    stock: 10,
    isFeatured: true,
    isNew: true,
    tags: ['limited', 'neon', 'exclusive'],
    specifications: {
      material: 'Canvas and synthetic',
      soleType: 'Rubber',
      weight: '290g',
      gender: 'Unisex'
    }
  }
]

export const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Delete existing products
    await Product.deleteMany({})
    console.log('Deleted existing products')

    // Insert new products
    await Product.insertMany(products)
    console.log('✅ Products seeded successfully')
  } catch (error) {
    console.error('❌ Seeding error:', error)
    throw error
  }
}

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProducts()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}