import { body, validationResult } from 'express-validator'
import { AppError } from '../utils/AppError.js'

// Middleware to check validation results
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg)
    return next(new AppError(errorMessages.join('. '), 400))
  }
  next()
}

// Register validation
export const validateRegister = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  
  validateRequest
]

// Login validation
export const validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  validateRequest
]

// Product validation
export const validateProduct = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
  
  body('description')
    .notEmpty().withMessage('Product description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Running', 'Classic', 'Lifestyle', 'Limited Edition', 'Training', 'Casual'])
    .withMessage('Invalid category'),
  
  body('brand')
    .notEmpty().withMessage('Brand is required'),
  
  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  
  validateRequest
]

// Order validation
export const validateOrder = [
  body('shippingAddress.street')
    .notEmpty().withMessage('Street address is required'),
  
  body('shippingAddress.city')
    .notEmpty().withMessage('City is required'),
  
  body('shippingAddress.state')
    .notEmpty().withMessage('State is required'),
  
  body('shippingAddress.zipCode')
    .notEmpty().withMessage('Zip code is required'),
  
  body('shippingAddress.country')
    .notEmpty().withMessage('Country is required'),
  
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['Card', 'PayPal', 'Apple Pay', 'Google Pay'])
    .withMessage('Invalid payment method'),
  
  validateRequest
]