// lib/services/order-tracking.ts
import { db } from "@/lib/firebase"
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore"

export type OrderStatus = 
  | "created" 
  | "paid" 
  | "confirmed" 
  | "in_transit" 
  | "shipped" 
  | "delivered" 
  | "cancelled" 
  | "return_requested"
  | "returned" 
  | "refunded"

export interface OrderStatusHistory {
  status: OrderStatus
  timestamp: Date
  note?: string
  deliveryDate?: Date // Add delivery date to history
}

export interface ReturnRequest {
  requestedAt: Date
  reason: string
  status: "pending" | "approved" | "rejected"
  whatsappSent: boolean
}

export interface DeliveryInfo {
  deliveredAt?: Date
  deliveredBy?: string
}

/**
 * Update order status (Admin only)
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note?: string,
  deliveryDate?: Date
): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)
    
    if (!orderSnap.exists()) {
      throw new Error("Order not found")
    }

    const currentData = orderSnap.data()
    const statusHistory: OrderStatusHistory[] = currentData.statusHistory || []
    
    // Add new status to history - include note and delivery date if they exist
    const historyEntry: OrderStatusHistory = {
      status: newStatus,
      timestamp: new Date()
    }
    
    if (note && note.trim()) {
      historyEntry.note = note.trim()
    }
    
    // Add delivery date to history entry if it's a delivered status
    if (newStatus === "delivered" && deliveryDate) {
      historyEntry.deliveryDate = deliveryDate
    }
    
    statusHistory.push(historyEntry)

    const updateData: any = {
      status: newStatus,
      statusHistory,
      updatedAt: serverTimestamp()
    }

    // If status is delivered, add delivery info
    if (newStatus === "delivered" && deliveryDate) {
      updateData.deliveryInfo = {
        deliveredAt: deliveryDate,
        deliveredBy: "Admin"
      }
    }

    await updateDoc(orderRef, updateData)
    console.log(`[OrderTracking] Order ${orderId} status updated to ${newStatus}`)
  } catch (error) {
    console.error("[OrderTracking] Error updating order status:", error)
    throw error
  }
}

/**
 * Cancel order (User - within 2 hours of creation)
 */
export async function cancelOrder(orderId: string, userId: string): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)
    
    if (!orderSnap.exists()) {
      throw new Error("Order not found")
    }

    const orderData = orderSnap.data()
    
    // Verify user owns this order
    if (orderData.userId !== userId) {
      throw new Error("Unauthorized")
    }

    // Check if order is within 2 hours
    const createdAt = orderData.createdAt?.toDate()
    const now = new Date()
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceCreation > 2) {
      throw new Error("Cancellation period has expired")
    }

    // Check if order can be cancelled
    if (!["created", "paid"].includes(orderData.status)) {
      throw new Error("Order cannot be cancelled at this stage")
    }

    await updateOrderStatus(orderId, "cancelled", "Cancelled by customer")
    console.log(`[OrderTracking] Order ${orderId} cancelled by user`)
  } catch (error) {
    console.error("[OrderTracking] Error cancelling order:", error)
    throw error
  }
}

/**
 * Request return (User - after delivery)
 */
export async function requestReturn(
  orderId: string,
  userId: string,
  reason: string
): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)
    
    if (!orderSnap.exists()) {
      throw new Error("Order not found")
    }

    const orderData = orderSnap.data()
    
    // Verify user owns this order
    if (orderData.userId !== userId) {
      throw new Error("Unauthorized")
    }

    // Check if order is delivered
    if (orderData.status !== "delivered") {
      throw new Error("Order must be delivered to request return")
    }

    const returnRequest: ReturnRequest = {
      requestedAt: new Date(),
      reason,
      status: "pending",
      whatsappSent: false
    }

    await updateDoc(orderRef, {
      status: "return_requested",
      returnRequest,
      statusHistory: [
        ...(orderData.statusHistory || []),
        {
          status: "return_requested",
          timestamp: new Date(),
          note: `Return requested: ${reason}`
        }
      ],
      updatedAt: serverTimestamp()
    })

    console.log(`[OrderTracking] Return requested for order ${orderId}`)
  } catch (error) {
    console.error("[OrderTracking] Error requesting return:", error)
    throw error
  }
}

/**
 * Mark return as refunded (Admin only)
 */
export async function markReturnRefunded(orderId: string): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  try {
    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)
    
    if (!orderSnap.exists()) {
      throw new Error("Order not found")
    }

    const orderData = orderSnap.data()
    
   

    await updateOrderStatus(orderId, "refunded", "Refund processed")
    console.log(`[OrderTracking] Order ${orderId} marked as refunded`)
  } catch (error) {
    console.error("[OrderTracking] Error marking refund:", error)
    throw error
  }
}

/**
 * Check if order can be cancelled (within 2 hours)
 */
export function canCancelOrder(createdAt: Date): boolean {
  const now = new Date()
  const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
  return hoursSinceCreation <= 2
}

/**
 * Get time remaining for cancellation
 */
export function getCancellationTimeRemaining(createdAt: Date): string {
  const now = new Date()
  const twoHoursLater = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000)
  const msRemaining = twoHoursLater.getTime() - now.getTime()
  
  if (msRemaining <= 0) return "Expired"
  
  const hours = Math.floor(msRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
}