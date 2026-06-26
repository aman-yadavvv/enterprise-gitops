import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Running', 'Classic', 'Lifestyle', 'Limited Edition', 'Training', 'Casual']
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand'],
    trim: true
  },
  sizes: [{
    type: String,
    enum: ['US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 11.5', 'US 12']
  }],
  colors: [{
    name: String,
    hex: String,
    image: String
  }],
  images: [{
    url: String,
    publicId: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: true
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  tags: [String],
  specifications: {
    material: String,
    soleType: String,
    weight: String,
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex']
    },
    releaseDate: Date
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' })

// Indexes for query performance and sorting
productSchema.index({ category: 1 })
productSchema.index({ brand: 1 })
productSchema.index({ price: 1 })
productSchema.index({ isFeatured: 1 })
productSchema.index({ isNew: 1 })
productSchema.index({ isOnSale: 1 })
productSchema.index({ averageRating: -1 })
productSchema.index({ createdAt: -1 })
productSchema.index({ views: -1 })

// Pre-save middleware to calculate average rating
productSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, r) => sum + r.rating, 0)
    this.averageRating = total / this.ratings.length
    this.totalReviews = this.ratings.length
  }
  next()
})

// Method to check if product is in stock
productSchema.methods.isInStock = function(quantity = 1) {
  return this.stock >= quantity
}

// Virtual for discounted price
productSchema.virtual('finalPrice').get(function() {
  return this.discountPrice && this.discountPrice < this.price 
    ? this.discountPrice 
    : this.price
})

const Product = mongoose.model('Product', productSchema)
export default Product