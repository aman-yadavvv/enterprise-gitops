import React, { createContext, useReducer, useEffect, useContext } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { AuthContext } from './AuthContext'

export const CartContext = createContext()

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      )

      let updatedItems
      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }]
      }

      const updatedTotalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      )
      const updatedTotalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )

      return {
        items: updatedItems,
        totalItems: updatedTotalItems,
        totalAmount: updatedTotalAmount,
      }
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      )
      const updatedTotalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      )
      const updatedTotalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )

      return {
        items: updatedItems,
        totalItems: updatedTotalItems,
        totalAmount: updatedTotalAmount,
      }
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0)

      const updatedTotalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      )
      const updatedTotalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )

      return {
        items: updatedItems,
        totalItems: updatedTotalItems,
        totalAmount: updatedTotalAmount,
      }
    }

    case 'CLEAR_CART':
      return initialState

    case 'LOAD_CART':
      return action.payload

    default:
      return state
  }
}

// Map MongoDB cart item structures to unified frontend structure
const mapDbCartToState = (dbCart) => {
  if (!dbCart || !dbCart.items) return { items: [], totalAmount: 0, totalItems: 0 }
  
  const items = dbCart.items.map(item => ({
    id: item._id, // Cart item ID used for PATCH/DELETE API calls
    productId: item.product?._id || item.product,
    name: item.product?.name || 'Sneaker',
    price: item.price,
    image: item.product?.images?.[0]?.url || '/assets/placeholder.jpg',
    size: item.size,
    color: item.color,
    quantity: item.quantity
  }))

  return {
    items,
    totalItems: dbCart.totalItems || 0,
    totalAmount: dbCart.totalPrice || 0
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isAuthenticated } = useContext(AuthContext)

  // Sync cart when authentication status changes
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get('/cart')
          const mappedCart = mapDbCartToState(response.data.data.cart)
          dispatch({ type: 'LOAD_CART', payload: mappedCart })
        } catch (error) {
          console.error('Failed to load cart from database:', error)
        }
      } else {
        // Load guest cart from local storage
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          try {
            dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) })
          } catch (error) {
            console.error('Failed to load local cart:', error)
          }
        } else {
          dispatch({ type: 'CLEAR_CART' })
        }
      }
    }

    fetchCart()
  }, [isAuthenticated])

  // Save local storage cart ONLY for guests
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(state))
    }
  }, [state, isAuthenticated])

  const addToCart = async (product) => {
    if (isAuthenticated) {
      try {
        const response = await api.post('/cart', {
          productId: product.id || product._id,
          size: product.size,
          color: product.color,
          quantity: product.quantity || 1
        })
        const mappedCart = mapDbCartToState(response.data.data.cart)
        dispatch({ type: 'LOAD_CART', payload: mappedCart })
        toast.success(`${product.name} added to cart!`)
      } catch (error) {
        console.error('Failed to add to database cart:', error)
        toast.error(error.response?.data?.message || 'Failed to add item to cart')
      }
    } else {
      dispatch({ type: 'ADD_TO_CART', payload: product })
      toast.success(`${product.name} added to cart!`)
    }
  }

  const removeFromCart = async (id) => {
    if (isAuthenticated) {
      try {
        const response = await api.delete(`/cart/${id}`)
        const mappedCart = mapDbCartToState(response.data.data.cart)
        dispatch({ type: 'LOAD_CART', payload: mappedCart })
        toast.success('Item removed from cart')
      } catch (error) {
        console.error('Failed to remove from database cart:', error)
        toast.error('Failed to remove item from cart')
      }
    } else {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id })
      toast.success('Item removed from cart')
    }
  }

  const updateQuantity = async (id, quantity) => {
    if (isAuthenticated) {
      try {
        const response = await api.patch(`/cart/${id}`, { quantity })
        const mappedCart = mapDbCartToState(response.data.data.cart)
        dispatch({ type: 'LOAD_CART', payload: mappedCart })
      } catch (error) {
        console.error('Failed to update quantity in database:', error)
        toast.error('Failed to update quantity')
      }
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }
  }

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        const response = await api.delete('/cart')
        const mappedCart = mapDbCartToState(response.data.data.cart)
        dispatch({ type: 'LOAD_CART', payload: mappedCart })
        toast.success('Cart cleared')
      } catch (error) {
        console.error('Failed to clear database cart:', error)
        toast.error('Failed to clear cart')
      }
    } else {
      dispatch({ type: 'CLEAR_CART' })
      toast.success('Cart cleared')
    }
  }

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}