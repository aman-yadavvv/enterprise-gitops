export const up = async (db) => {
  await db.createCollection('orders', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['user', 'items', 'shippingAddress', 'paymentMethod', 'itemsPrice', 'totalPrice', 'status'],
        properties: {
          user: {
            bsonType: 'objectId',
            description: 'User ID - required'
          },
          items: {
            bsonType: 'array',
            minItems: 1,
            items: {
              bsonType: 'object',
              required: ['product', 'name', 'price', 'quantity'],
              properties: {
                product: { bsonType: 'objectId' },
                name: { bsonType: 'string' },
                price: { bsonType: 'number' },
                quantity: { bsonType: 'number', minimum: 1 },
                size: { bsonType: 'string' },
                color: { bsonType: 'string' },
                image: { bsonType: 'string' }
              }
            }
          },
          shippingAddress: {
            bsonType: 'object',
            required: ['street', 'city', 'state', 'zipCode', 'country'],
            properties: {
              street: { bsonType: 'string' },
              city: { bsonType: 'string' },
              state: { bsonType: 'string' },
              zipCode: { bsonType: 'string' },
              country: { bsonType: 'string' }
            }
          },
          paymentMethod: {
            enum: ['Card', 'PayPal', 'Apple Pay', 'Google Pay'],
            description: 'Payment method - required'
          },
          paymentResult: {
            bsonType: 'object',
            properties: {
              id: { bsonType: 'string' },
              status: { bsonType: 'string' },
              updateTime: { bsonType: 'string' },
              emailAddress: { bsonType: 'string' }
            }
          },
          itemsPrice: {
            bsonType: 'number',
            minimum: 0,
            description: 'Items price - required'
          },
          taxPrice: {
            bsonType: 'number',
            minimum: 0,
            default: 0
          },
          shippingPrice: {
            bsonType: 'number',
            minimum: 0,
            default: 0
          },
          totalPrice: {
            bsonType: 'number',
            minimum: 0,
            description: 'Total price - required'
          },
          discount: {
            bsonType: 'number',
            minimum: 0,
            default: 0
          },
          couponCode: {
            bsonType: 'string'
          },
          status: {
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
            description: 'Order status - required'
          },
          notes: {
            bsonType: 'string',
            maxLength: 500
          },
          isPaid: {
            bsonType: 'bool',
            default: false
          },
          paidAt: {
            bsonType: 'date'
          },
          isDelivered: {
            bsonType: 'bool',
            default: false
          },
          deliveredAt: {
            bsonType: 'date'
          },
          cancelledAt: {
            bsonType: 'date'
          },
          cancellationReason: {
            bsonType: 'string'
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
  await db.collection('orders').createIndex({ user: 1 })
  await db.collection('orders').createIndex({ status: 1 })
  await db.collection('orders').createIndex({ isPaid: 1 })
  await db.collection('orders').createIndex({ createdAt: -1 })
  await db.collection('orders').createIndex({ user: 1, createdAt: -1 })
}

export const down = async (db) => {
  await db.collection('orders').drop()
}