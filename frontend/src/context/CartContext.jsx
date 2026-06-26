import React, { createContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

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

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Failed to load cart:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (state.items.length > 0 || state.totalItems > 0) {
      localStorage.setItem('cart', JSON.stringify(state))
    }
  }, [state])

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
    toast.success(`${product.name} added to cart!`)
  }

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id })
    toast.success('Item removed from cart')
  }

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    toast.success('Cart cleared')
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