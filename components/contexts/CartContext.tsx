"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"

// Updated CartItem type with _id as string
interface CartItem {
  _id: string // _id should be a string
  name: string
  price: number
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i._id === item._id)
      if (existingItem) {
        return prevCart.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => { // id is a string
    setCart((prevCart) => prevCart.filter((item) => item._id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const increaseQuantity = (id: string) => { // id is a string
    setCart((prevCart) => prevCart.map((item) => (item._id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decreaseQuantity = (id: string) => { // id is a string
    setCart((prevCart) =>
      prevCart
        .map((item) => (item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
