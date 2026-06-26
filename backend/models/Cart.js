import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1'],
    default: 1
  },
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
})

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  totalItems: {
    type: Number,
    default: 0,
    min: 0
  },
  couponCode: {
    type: String,
    default: null
  },
  discount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Method to calculate totals
cartSchema.methods.updateTotals = async function() {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0)
  this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Apply discount if coupon exists
  if (this.discount > 0) {
    this.totalPrice = Math.max(0, this.totalPrice - this.discount)
  }
  
  return this.save()
}

// Method to check if cart is empty
cartSchema.methods.isEmpty = function() {
  return this.items.length === 0
}

const Cart = mongoose.model('Cart', cartSchema)
export default Cart