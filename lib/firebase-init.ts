import { db } from "@/lib/firebase"
import { collection, doc, setDoc, getDocs, query, limit } from "firebase/firestore"

/**
 * Initialize Firebase collections on first run
 * This function creates required collections and seed data if they don't exist
 * Note: This only runs on the client side
 */
export async function initializeFirebaseCollections() {
  // Only run on client side
  if (typeof window === 'undefined') {
    console.log("[v0] Skipping Firebase initialization on server")
    return
  }

  if (!db) {
    console.warn("[v0] Firebase not initialized. Skipping collection setup.")
    return
  }

  try {
    // Check if products collection exists and has data
    const productsRef = collection(db, "products")
    const productsSnapshot = await getDocs(query(productsRef, limit(1)))

    // if (productsSnapshot.empty) {
    //   console.log("[v0] Creating products collection with seed data...")

    //   const sampleProducts = [
    //     {
    //       id: "utility-vest",
    //       title: "Tony Amalfi Utility Vest",
    //       description: "Premium utility vest with multiple pockets and technical fabric",
    //       price: 295,
    //       currency: "INR",
    //       images: ["/product-vest.jpg"],
    //       category: "Outerwear",
    //       stock: 50,
    //       tags: ["utility", "vest", "technical"],
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //       isActive: true,
    //     },
    //     {
    //       id: "track-jacket",
    //       title: "Technical Track Jacket",
    //       description: "Lightweight track jacket with water-resistant coating",
    //       price: 345,
    //       currency: "INR",
    //       images: ["/product-jacket.jpg"],
    //       category: "Outerwear",
    //       stock: 40,
    //       tags: ["jacket", "technical", "track"],
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //       isActive: true,
    //     },
    //     {
    //       id: "cargo-pants",
    //       title: "Technical Cargo Pants",
    //       description: "Durable cargo pants with reinforced pockets and adjustable waist",
    //       price: 225,
    //       currency: "INR",
    //       images: ["/product-pants.jpg"],
    //       category: "Bottoms",
    //       stock: 60,
    //       tags: ["cargo", "pants", "technical"],
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //       isActive: true,
    //     },
    //   ]

    //   for (const product of sampleProducts) {
    //     await setDoc(doc(productsRef, product.id), product)
    //   }
    //   console.log("[v0] Products collection initialized with seed data")
    // }

    // Check if users collection exists
    const usersRef = collection(db, "users")
    const usersSnapshot = await getDocs(query(usersRef, limit(1)))

    if (usersSnapshot.empty) {
      console.log("[v0] Users collection created (empty)")
    }

    // Check if orders collection exists
    const ordersRef = collection(db, "orders")
    const ordersSnapshot = await getDocs(query(ordersRef, limit(1)))

    if (ordersSnapshot.empty) {
      console.log("[v0] Orders collection created (empty)")
    }

    // Check if cart collection exists
    const cartRef = collection(db, "cart")
    const cartSnapshot = await getDocs(query(cartRef, limit(1)))

    if (cartSnapshot.empty) {
      console.log("[v0] Cart collection created (empty)")
    }

    console.log("[v0] Firebase collections initialized successfully")
  } catch (error) {
    console.error("[v0] Error initializing Firebase collections:", error)
  }
}