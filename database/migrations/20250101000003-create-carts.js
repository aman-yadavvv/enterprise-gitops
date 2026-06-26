export const up = async (db) => {
  await db.createCollection('carts', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['user', 'items', 'totalPrice', 'totalItems'],
        properties: {
          user: {
            bsonType: 'objectId',
            description: 'User ID - required and unique'
          },
          items: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              required: ['product', 'quantity', 'price'],
              properties: {
                product: { bsonType: 'objectId' },
                quantity: { bsonType: 'number', minimum: 1 },
                size: { bsonType: 'string' },
                color: { bsonType: 'string' },
                price: { bsonType: 'number', minimum: 0 }
              }
            }
          },
          totalPrice: {
            bsonType: 'number',
            minimum: 0,
            description: 'Total cart price - required'
          },
          totalItems: {
            bsonType: 'number',
            minimum: 0,
            description: 'Total items in cart - required'
          },
          couponCode: {
            bsonType: 'string'
          },
          discount: {
            bsonType: 'number',
            minimum: 0,
            default: 0
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
  await db.collection('carts').createIndex({ user: 1 }, { unique: true })
  await db.collection('carts').createIndex({ updatedAt: -1 })
}

export const down = async (db) => {
  await db.collection('carts').drop()
}