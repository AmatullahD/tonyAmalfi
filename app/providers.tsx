"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import { getCart, addToCart as addToFirebaseCart, updateCartItemQuantity, removeFromCart as removeFromFirebaseCart, clearCart as clearFirebaseCart } from "@/lib/services/cart"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  color: string
  size: string
  quantity: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  total: number
  loading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const GUEST_CART_KEY = 'guest_cart'

// Helper function to fetch product details
async function fetchProductDetails(productId: string) {
  try {
    if (!db) {
      console.error("Firestore is not initialized")
      return { name: productId, image: "" }
    }
    
    const productRef = doc(db, "products", productId)
    const productSnap = await getDoc(productRef)
    
    if (productSnap.exists()) {
      const productData = productSnap.data()
      return {
        name: productData.title || productData.name || productId, // Use 'title' field
        image: productData.images?.[0] || productData.image || ""
      }
    }
    
    return { name: productId, image: "" }
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error)
    return { name: productId, image: "" }
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load guest cart from localStorage
  const loadGuestCart = () => {
    if (typeof window === 'undefined') return []
    try {
      const guestCart = localStorage.getItem(GUEST_CART_KEY)
      return guestCart ? JSON.parse(guestCart) : []
    } catch (error) {
      console.error("Error loading guest cart:", error)
      return []
    }
  }

  // Save guest cart to localStorage
  const saveGuestCart = (cartItems: CartItem[]) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems))
    } catch (error) {
      console.error("Error saving guest cart:", error)
    }
  }

  // Clear guest cart from localStorage
  const clearGuestCart = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(GUEST_CART_KEY)
    } catch (error) {
      console.error("Error clearing guest cart:", error)
    }
  }

  // Merge guest cart with Firebase cart when user logs in
  const mergeGuestCartWithFirebase = async (guestItems: CartItem[]) => {
    if (guestItems.length === 0 || !user) return

    try {
      // Add all guest items to Firebase
      for (const item of guestItems) {
        const variant: { color?: string; size?: string } = {}
        if (item.color) variant.color = item.color
        if (item.size) variant.size = item.size

        await addToFirebaseCart({
          productId: item.productId || item.id.split('-')[0],
          qty: item.quantity,
          priceAtAdd: item.price,
          ...(Object.keys(variant).length > 0 ? { variant } : {})
        })
      }

      // Clear guest cart after merge
      clearGuestCart()
      console.log("[CartProvider] Guest cart merged with Firebase cart")
    } catch (error) {
      console.error("Error merging guest cart:", error)
    }
  }

  // Load cart from Firebase when user logs in
  const refreshCart = async () => {
    if (!user) {
      // Load guest cart for non-authenticated users
      const guestCart = loadGuestCart()
      setItems(guestCart)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Check if there's a guest cart to merge
      const guestCart = loadGuestCart()
      if (guestCart.length > 0) {
        await mergeGuestCartWithFirebase(guestCart)
      }

      // Load Firebase cart
      const cart = await getCart()
      
      if (cart && cart.items) {
        // Transform Firebase cart items to CartItem format
        // Fetch product names in parallel for better performance
        const transformedItems = await Promise.all(
          cart.items.map(async (item) => {
            const productDetails = await fetchProductDetails(item.productId)
            
            return {
              id: `${item.productId}-${item.variant?.color || ''}-${item.variant?.size || ''}`,
              productId: item.productId,
              name: productDetails.name,
              price: item.priceAtAdd,
              color: item.variant?.color || '',
              size: item.variant?.size || '',
              quantity: item.qty,
              image: productDetails.image
            }
          })
        )
        setItems(transformedItems)
      } else {
        setItems([])
      }
    } catch (error) {
      console.error("Error loading cart:", error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      refreshCart()
    }
  }, [user, authLoading])

  const addItem = async (newItem: CartItem) => {
    // For guest users, use localStorage
    if (!user) {
      setItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.id === newItem.id && item.color === newItem.color && item.size === newItem.size,
        )

        let updatedItems: CartItem[]
        if (existingItem) {
          updatedItems = prevItems.map((item) =>
            item.id === newItem.id && item.color === newItem.color && item.size === newItem.size
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item,
          )
        } else {
          updatedItems = [...prevItems, newItem]
        }

        // Save to localStorage
        saveGuestCart(updatedItems)
        return updatedItems
      })
      return
    }

    // For authenticated users, use Firebase
    try {
      // Prepare variant object, only including defined values
      const variant: { color?: string; size?: string } = {}
      if (newItem.color) variant.color = newItem.color
      if (newItem.size) variant.size = newItem.size

      // Extract productId (handle both formats)
      const productId = newItem.productId || newItem.id.split('-')[0]

      // Add to Firebase
      await addToFirebaseCart({
        productId: productId,
        qty: newItem.quantity,
        priceAtAdd: newItem.price,
        ...(Object.keys(variant).length > 0 ? { variant } : {})
      })

      // Update local state
      setItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.id === newItem.id && item.color === newItem.color && item.size === newItem.size,
        )

        if (existingItem) {
          return prevItems.map((item) =>
            item.id === newItem.id && item.color === newItem.color && item.size === newItem.size
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item,
          )
        }

        return [...prevItems, newItem]
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add item to cart")
    }
  }

  const removeItem = async (id: string) => {
    // For guest users, use localStorage
    if (!user) {
      setItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== id)
        saveGuestCart(updatedItems)
        return updatedItems
      })
      return
    }

    // For authenticated users, use Firebase
    try {
      const item = items.find(i => i.id === id)
      if (!item) return

      const productId = item.productId || id.split('-')[0]
      
      // Prepare variant object, only including defined values
      const variant: { color?: string; size?: string } = {}
      if (item.color) variant.color = item.color
      if (item.size) variant.size = item.size

      await removeFromFirebaseCart(
        productId, 
        Object.keys(variant).length > 0 ? variant : undefined
      )

      setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error removing from cart:", error)
      alert("Failed to remove item from cart")
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    // For guest users, use localStorage
    if (!user) {
      if (quantity <= 0) {
        await removeItem(id)
      } else {
        setItems((prevItems) => {
          const updatedItems = prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
          saveGuestCart(updatedItems)
          return updatedItems
        })
      }
      return
    }

    // For authenticated users, use Firebase
    try {
      const item = items.find(i => i.id === id)
      if (!item) return

      const productId = item.productId || id.split('-')[0]

      if (quantity <= 0) {
        await removeItem(id)
      } else {
        // Prepare variant object, only including defined values
        const variant: { color?: string; size?: string } = {}
        if (item.color) variant.color = item.color
        if (item.size) variant.size = item.size

        await updateCartItemQuantity(
          productId, 
          quantity, 
          Object.keys(variant).length > 0 ? variant : undefined
        )

        setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      alert("Failed to update quantity")
    }
  }

  const clearCart = async () => {
    // For guest users, clear localStorage
    if (!user) {
      setItems([])
      clearGuestCart()
      return
    }

    // For authenticated users, clear Firebase
    try {
      await clearFirebaseCart()
      setItems([])
    } catch (error) {
      console.error("Error clearing cart:", error)
      alert("Failed to clear cart")
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, loading, refreshCart }}>
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