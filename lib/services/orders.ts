// lib/services/orders.ts
import { db } from "@/lib/firebase"
import { ReactNode } from "react"
import { collection, query, where, orderBy, getDocs, doc, getDoc } from "firebase/firestore"

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  color?: string
  size?: string
  image?: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: string
  payment: {
    razorpayOrderId: string
    razorpayPaymentId?: string
    razorpaySignature?: string
  }
  shippingAddress: {
    house: ReactNode
    road: ReactNode
    landmark: any
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  createdAt: Date
  updatedAt: Date
  deliveryInfo?: {
    deliveredAt?: Date
    deliveredBy?: string
  }
  statusHistory?: Array<{
    status: string
    timestamp: Date
    note?: string
    deliveryDate?: Date
    deliveredBy?: string
  }>
}

// Helper function to fetch product details
async function fetchProductDetails(productId: string) {
  try {
    if (!db) {
      console.error("Firestore is not initialized")
      return null
    }
    
    const productRef = doc(db, "products", productId)
    const productSnap = await getDoc(productRef)
    
    if (productSnap.exists()) {
      const productData = productSnap.data()
      return {
        name: productData.title || productData.name || "Product", // Use 'title' field
        image: productData.images?.[0] || productData.image || ""
      }
    }
    
    return null
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error)
    return null
  }
}

// Helper function to enrich order items with product data
async function enrichOrderItems(items: any[]): Promise<OrderItem[]> {
  const enrichedItems = await Promise.all(
    items.map(async (item) => {
      // If item already has a name, use it
      if (item.name) {
        return item as OrderItem
      }
      
      // Otherwise, fetch product details
      const productDetails = await fetchProductDetails(item.productId || item.id)
      
      return {
        ...item,
        name: productDetails?.name || item.name || "Unknown Product",
        image: item.image || productDetails?.image || ""
      } as OrderItem
    })
  )
  
  return enrichedItems
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    if (!db) {
      console.error("Firestore is not initialized")
      return []
    }

    const ordersRef = collection(db, "orders")
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )

    const querySnapshot = await getDocs(q)
    const orders: Order[] = []

    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data()
      
      // Enrich items with product names
      const enrichedItems = await enrichOrderItems(data.items || [])
      
      orders.push({
        id: docSnapshot.id,
        userId: data.userId,
        items: enrichedItems,
        totalAmount: data.totalAmount,
        status: data.status,
        payment: data.payment || {},
        shippingAddress: data.shippingAddress || {},
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        deliveryInfo: data.deliveryInfo ? {
          deliveredAt: data.deliveryInfo.deliveredAt?.toDate ? data.deliveryInfo.deliveredAt.toDate() : data.deliveryInfo.deliveredAt,
          deliveredBy: data.deliveryInfo.deliveredBy
        } : undefined,
        statusHistory: (data.statusHistory || []).map((h: any) => ({
          status: h.status,
          timestamp: h.timestamp?.toDate ? h.timestamp.toDate() : h.timestamp,
          note: h.note,
          deliveryDate: h.deliveryDate?.toDate ? h.deliveryDate.toDate() : h.deliveryDate,
          deliveredBy: h.deliveredBy
        })),
      })
    }

    return orders
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return []
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    if (!db) {
      console.error("Firestore is not initialized")
      return null
    }

    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)

    if (!orderSnap.exists()) {
      return null
    }

    const data = orderSnap.data()
    
    // Enrich items with product names
    const enrichedItems = await enrichOrderItems(data.items || [])

    return {
      id: orderSnap.id,
      userId: data.userId,
      items: enrichedItems,
      totalAmount: data.totalAmount,
      status: data.status,
      payment: data.payment || {},
      shippingAddress: data.shippingAddress || {},
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      deliveryInfo: data.deliveryInfo ? {
        deliveredAt: data.deliveryInfo.deliveredAt?.toDate ? data.deliveryInfo.deliveredAt.toDate() : data.deliveryInfo.deliveredAt,
        deliveredBy: data.deliveryInfo.deliveredBy
      } : undefined,
      statusHistory: (data.statusHistory || []).map((h: any) => ({
        status: h.status,
        timestamp: h.timestamp?.toDate ? h.timestamp.toDate() : h.timestamp,
        note: h.note,
        deliveryDate: h.deliveryDate?.toDate ? h.deliveryDate.toDate() : h.deliveryDate,
        deliveredBy: h.deliveredBy
      })),
    }
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}