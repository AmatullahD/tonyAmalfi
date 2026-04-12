import { db, auth } from "@/lib/firebase"
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"

export interface CartItem {
  productId: string
  qty: number
  priceAtAdd: number
  variant?: {
    color?: string
    size?: string
  }
}

export interface Cart {
  userId: string
  items: CartItem[]
  updatedAt: Date
}

export async function getCart(): Promise<Cart | null> {
  // Check if running on client side
  if (typeof window === 'undefined' || !auth?.currentUser || !db) {
    return null
  }

  try {
    const cartRef = doc(db, "carts", auth.currentUser.uid)
    const cartSnap = await getDoc(cartRef)

    if (!cartSnap.exists()) return null

    return {
      userId: auth.currentUser.uid,
      ...cartSnap.data(),
      updatedAt: cartSnap.data().updatedAt?.toDate(),
    } as Cart
  } catch (error) {
    console.error("[v0] Error fetching cart:", error)
    return null
  }
}

export async function addToCart(item: CartItem): Promise<void> {
  if (typeof window === 'undefined' || !auth?.currentUser || !db) {
    throw new Error("User not authenticated")
  }

  try {
    const cartRef = doc(db, "carts", auth.currentUser.uid)
    const cartSnap = await getDoc(cartRef)

    if (!cartSnap.exists()) {
      await setDoc(cartRef, {
        userId: auth.currentUser.uid,
        items: [item],
        updatedAt: new Date(),
      })
    } else {
      const existingItems = cartSnap.data().items as CartItem[]
      const existingItemIndex = existingItems.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.variant?.color === item.variant?.color &&
          i.variant?.size === item.variant?.size,
      )

      let updatedItems: CartItem[]
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        updatedItems = [...existingItems]
        updatedItems[existingItemIndex].qty += item.qty
      } else {
        // Add new item
        updatedItems = [...existingItems, item]
      }

      await updateDoc(cartRef, {
        items: updatedItems,
        updatedAt: new Date(),
      })
    }
    console.log("[v0] Item added to cart successfully")
  } catch (error) {
    console.error("[v0] Error adding to cart:", error)
    throw error
  }
}

export async function updateCartItemQuantity(
  productId: string,
  qty: number,
  variant?: { color?: string; size?: string },
): Promise<void> {
  if (typeof window === 'undefined' || !auth?.currentUser || !db) {
    throw new Error("User not authenticated")
  }

  try {
    const cartRef = doc(db, "carts", auth.currentUser.uid)
    const cartSnap = await getDoc(cartRef)

    if (cartSnap.exists()) {
      const items = cartSnap.data().items as CartItem[]
      const updatedItems = items
        .map((item) => {
          if (
            item.productId === productId &&
            item.variant?.color === variant?.color &&
            item.variant?.size === variant?.size
          ) {
            return { ...item, qty }
          }
          return item
        })
        .filter((item) => item.qty > 0) // Remove items with qty 0

      await updateDoc(cartRef, {
        items: updatedItems,
        updatedAt: new Date(),
      })
      console.log("[v0] Cart item quantity updated")
    }
  } catch (error) {
    console.error("[v0] Error updating cart item quantity:", error)
    throw error
  }
}

export async function removeFromCart(productId: string, variant?: { color?: string; size?: string }): Promise<void> {
  if (typeof window === 'undefined' || !auth?.currentUser || !db) {
    throw new Error("User not authenticated")
  }

  try {
    const cartRef = doc(db, "carts", auth.currentUser.uid)
    const cartSnap = await getDoc(cartRef)

    if (cartSnap.exists()) {
      const items = cartSnap.data().items as CartItem[]
      const updatedItems = items.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.variant?.color === variant?.color &&
            item.variant?.size === variant?.size
          ),
      )

      await updateDoc(cartRef, {
        items: updatedItems,
        updatedAt: new Date(),
      })
      console.log("[v0] Item removed from cart")
    }
  } catch (error) {
    console.error("[v0] Error removing from cart:", error)
    throw error
  }
}

export async function clearCart(): Promise<void> {
  if (typeof window === 'undefined' || !auth?.currentUser || !db) {
    throw new Error("User not authenticated")
  }

  try {
    const cartRef = doc(db, "carts", auth.currentUser.uid)
    await deleteDoc(cartRef)
    console.log("[v0] Cart cleared")
  } catch (error) {
    console.error("[v0] Error clearing cart:", error)
    throw error
  }
}