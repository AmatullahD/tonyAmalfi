// lib/services/products.ts
import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore"

export interface SizeMeasurement {
  name: string
  value: string
}

export interface SizeDetail {
  size: string
  measurements: SizeMeasurement[]
  quantity: number // NEW: Quantity for this specific size
}

export interface Product {
  id: string
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  currency: string
  images: string[]
  category: string
  stock: number // DEPRECATED: Keep for backward compatibility, but calculate from sizeDetails
  tags: string[]
  colors?: { name: string; hex: string }[]
  sizeDetails: SizeDetail[]
  materials?: string
  care?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export async function createProduct(
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  if (!db) throw new Error("Firestore not initialized")

  try {
    // Calculate total stock from size quantities
    const totalStock = productData.sizeDetails.reduce((sum, size) => sum + size.quantity, 0)
    
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      stock: totalStock, // Store calculated total for backward compatibility
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    console.log("[v0] Product created with ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    throw error
  }
}

export async function getProducts(): Promise<Product[]> {
  if (!db) return []

  try {
    const q = query(
      collection(db, "products"),
      where("isActive", "==", true)
    )
    const snapshot = await getDocs(q)
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Product[]
    
    console.log("[v0] Fetched products:", products.length)
    return products
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (!db) {
    console.log("[v0] Database not initialized")
    return []
  }

  try {
    console.log("[v0] Fetching all products...")
    const q = query(
      collection(db, "products"),
      where("isActive", "==", true)
    )
    const snapshot = await getDocs(q)
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Product[]
    
    console.log("[v0] Successfully fetched products:", products.length)
    return products
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!db) return null

  try {
    const docRef = doc(db, "products", id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Product
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return null
  }
}

export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, "id" | "createdAt">>
): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const docRef = doc(db, "products", id)
    
    // Calculate total stock from size quantities if sizeDetails provided
    const updateData: any = { ...productData }
    if (productData.sizeDetails) {
      updateData.stock = productData.sizeDetails.reduce((sum, size) => sum + size.quantity, 0)
    }
    
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    })
    console.log("[v0] Product updated:", id)
  } catch (error) {
    console.error("[v0] Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const docRef = doc(db, "products", id)
    await updateDoc(docRef, {
      isActive: false,
      updatedAt: serverTimestamp(),
    })
    console.log("[v0] Product deleted (soft):", id)
  } catch (error) {
    console.error("[v0] Error deleting product:", error)
    throw error
  }
}

export async function hardDeleteProduct(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const docRef = doc(db, "products", id)
    await deleteDoc(docRef)
    console.log("[v0] Product permanently deleted:", id)
  } catch (error) {
    console.error("[v0] Error permanently deleting product:", error)
    throw error
  }
}

// NEW: Function to reduce stock for a specific size when order is placed
export async function reduceProductStock(
  productId: string,
  size: string,
  quantity: number
): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const docRef = doc(db, "products", productId)
    
    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(docRef)
      
      if (!productDoc.exists()) {
        throw new Error("Product not found")
      }
      
      const productData = productDoc.data() as Product
      const sizeDetails = productData.sizeDetails || []
      
      // Find the size and reduce quantity
      const sizeIndex = sizeDetails.findIndex(s => s.size === size)
      
      if (sizeIndex === -1) {
        throw new Error(`Size ${size} not found`)
      }
      
      if (sizeDetails[sizeIndex].quantity < quantity) {
        throw new Error(`Insufficient stock for size ${size}`)
      }
      
      // Update the size quantity
      sizeDetails[sizeIndex].quantity -= quantity
      
      // Calculate new total stock
      const totalStock = sizeDetails.reduce((sum, s) => sum + s.quantity, 0)
      
      transaction.update(docRef, {
        sizeDetails,
        stock: totalStock,
        updatedAt: serverTimestamp(),
      })
    })
    
    console.log(`[v0] Reduced stock for product ${productId}, size ${size} by ${quantity}`)
  } catch (error) {
    console.error("[v0] Error reducing product stock:", error)
    throw error
  }
}

// NEW: Check if a specific size has enough stock
export async function checkSizeStock(
  productId: string,
  size: string,
  requestedQuantity: number
): Promise<boolean> {
  if (!db) return false

  try {
    const product = await getProductById(productId)
    if (!product) return false
    
    const sizeDetail = product.sizeDetails.find(s => s.size === size)
    if (!sizeDetail) return false
    
    return sizeDetail.quantity >= requestedQuantity
  } catch (error) {
    console.error("[v0] Error checking size stock:", error)
    return false
  }
}