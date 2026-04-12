// lib/services/admin.ts
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import type { Order } from "./orders"
export type { Order } from "./orders"

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  phoneNumber: string | null
  photoURL: string | null
  createdAt: Date | null
  lastLoginAt: Date | null
  emailVerified: boolean
}

/**
 * Fetch all orders from Firestore (Admin only)
 */
export async function getAllOrders(): Promise<Order[]> {
  if (!db) {
    console.log("[v0] Database not initialized")
    return []
  }

  try {
    console.log("[v0] Fetching all orders...")
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    )
    const snapshot = await getDocs(q)

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      payment: {
        ...doc.data().payment,
        createdAt: doc.data().payment?.createdAt?.toDate(),
        verifiedAt: doc.data().payment?.verifiedAt?.toDate(),
      },
    })) as Order[]

    console.log("[v0] Successfully fetched orders:", orders.length)
    return orders
  } catch (error) {
    console.error("[v0] Error fetching all orders:", error)
    return []
  }
}

/**
 * Fetch all users from Firestore (Admin only)
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  if (!db) {
    console.log("[v0] Database not initialized")
    return []
  }

  try {
    console.log("[v0] Fetching all users...")
    const q = query(
      collection(db, "users"),
      orderBy("createdAt", "desc")
    )
    const snapshot = await getDocs(q)

    const users = snapshot.docs.map((doc) => ({
      uid: doc.id,
      email: doc.data().email || null,
      displayName: doc.data().displayName || null,
      phoneNumber: doc.data().phoneNumber || null,
      photoURL: doc.data().photoURL || null,
      emailVerified: doc.data().emailVerified || false,
      createdAt: doc.data().createdAt?.toDate() || null,
      lastLoginAt: doc.data().lastLoginAt?.toDate() || null,
    })) as UserProfile[]

    console.log("[v0] Successfully fetched users:", users.length)
    return users
  } catch (error) {
    console.error("[v0] Error fetching all users:", error)
    return []
  }
}

/**
 * Get order statistics (Admin only)
 */
export async function getOrderStatistics() {
  const orders = await getAllOrders()
  
  const totalOrders = orders.length
  const paidOrders = orders.filter(o => o.status === "paid").length
  const totalRevenue = orders
    .filter(o => o.status === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0)
  
  return {
    totalOrders,
    paidOrders,
    pendingOrders: totalOrders - paidOrders,
    totalRevenue,
    averageOrderValue: paidOrders > 0 ? totalRevenue / paidOrders : 0,
  }
}

/**
 * Get user statistics (Admin only)
 */
export async function getUserStatistics() {
  const users = await getAllUsers()
  
  const totalUsers = users.length
  const verifiedUsers = users.filter(u => u.emailVerified).length
  
  return {
    totalUsers,
    verifiedUsers,
    unverifiedUsers: totalUsers - verifiedUsers,
  }
}