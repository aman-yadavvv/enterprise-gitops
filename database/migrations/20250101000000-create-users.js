export const up = async (db) => {
  await db.createCollection('users', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'email', 'password', 'role'],
        properties: {
          name: {
            bsonType: 'string',
            description: 'User name - required'
          },
          email: {
            bsonType: 'string',
            pattern: '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$',
            description: 'User email - required and must be valid'
          },
          password: {
            bsonType: 'string',
            description: 'User password - required'
          },
          role: {
            enum: ['user', 'admin'],
            description: 'User role - required'
          },
          profileImage: {
            bsonType: 'string'
          },
          addresses: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              properties: {
                street: { bsonType: 'string' },
                city: { bsonType: 'string' },
                state: { bsonType: 'string' },
                zipCode: { bsonType: 'string' },
                country: { bsonType: 'string' },
                isDefault: { bsonType: 'bool' }
              }
            }
          },
          wishlist: {
            bsonType: 'array',
            items: {
              bsonType: 'objectId'
            }
          },
          isVerified: {
            bsonType: 'bool'
          },
          lastLogin: {
            bsonType: 'date'
          },
          resetPasswordToken: {
            bsonType: 'string'
          },
          resetPasswordExpire: {
            bsonType: 'date'
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
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
  await db.collection('users').createIndex({ role: 1 })
  await db.collection('users').createIndex({ createdAt: -1 })
}

export const down = async (db) => {
  await db.collection('users').drop()
}