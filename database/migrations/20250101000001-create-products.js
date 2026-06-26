export const up = async (db) => {
  await db.createCollection('products', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'slug', 'description', 'price', 'category', 'brand', 'stock'],
        properties: {
          name: {
            bsonType: 'string',
            maxLength: 100,
            description: 'Product name - required'
          },
          slug: {
            bsonType: 'string',
            description: 'Product slug - required and unique'
          },
          description: {
            bsonType: 'string',
            maxLength: 2000,
            description: 'Product description - required'
          },
          price: {
            bsonType: 'number',
            minimum: 0,
            description: 'Product price - required'
          },
          discountPrice: {
            bsonType: 'number',
            minimum: 0
          },
          category: {
            enum: ['Running', 'Classic', 'Lifestyle', 'Limited Edition', 'Training', 'Casual'],
            description: 'Product category - required'
          },
          brand: {
            bsonType: 'string',
            description: 'Product brand - required'
          },
          sizes: {
            bsonType: 'array',
            items: {
              enum: ['US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 11.5', 'US 12']
            }
          },
          colors: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              properties: {
                name: { bsonType: 'string' },
                hex: { bsonType: 'string' },
                image: { bsonType: 'string' }
              }
            }
          },
          images: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              properties: {
                url: { bsonType: 'string' },
                publicId: { bsonType: 'string' },
                isMain: { bsonType: 'bool' }
              }
            }
          },
          stock: {
            bsonType: 'number',
            minimum: 0,
            description: 'Product stock - required'
          },
          averageRating: {
            bsonType: 'number',
            minimum: 0,
            maximum: 5
          },
          totalReviews: {
            bsonType: 'number',
            minimum: 0
          },
          isFeatured: {
            bsonType: 'bool'
          },
          isNew: {
            bsonType: 'bool'
          },
          isOnSale: {
            bsonType: 'bool'
          },
          tags: {
            bsonType: 'array',
            items: { bsonType: 'string' }
          },
          specifications: {
            bsonType: 'object',
            properties: {
              material: { bsonType: 'string' },
              soleType: { bsonType: 'string' },
              weight: { bsonType: 'string' },
              gender: { enum: ['Men', 'Women', 'Unisex'] },
              releaseDate: { bsonType: 'date' }
            }
          },
          views: {
            bsonType: 'number',
            minimum: 0
          },
          createdAt: {
            bsonType: 'date'
          },
          updatedAt: {
            bsonType: 'date'
          }
        }
      }
    }
  })

  // Create indexes
  await db.collection('products').createIndex({ slug: 1 }, { unique: true })
  await db.collection('products').createIndex({ category: 1 })
  await db.collection('products').createIndex({ brand: 1 })
  await db.collection('products').createIndex({ price: 1 })
  await db.collection('products').createIndex({ isFeatured: 1 })
  await db.collection('products').createIndex({ isNew: 1 })
  await db.collection('products').createIndex({ averageRating: -1 })
  await db.collection('products').createIndex({ createdAt: -1 })
  await db.collection('products').createIndex({ 
    name: 'text', 
    description: 'text', 
    brand: 'text', 
    tags: 'text' 
  })
}

export const down = async (db) => {
  await db.collection('products').drop()
}