import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { adminDb } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Create order endpoint called")
    
    const body = await request.json()
    console.log("[v0] Request body:", { ...body, items: `${body.items?.length} items` })
    
    const { amount, currency = "INR", userId, items, shippingAddress } = body

    // Validate required fields
    if (!amount || !userId) {
      console.error("[v0] Missing required fields:", { amount, userId })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!items || items.length === 0) {
      console.error("[v0] Cart is empty")
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Validate Razorpay credentials
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("[v0] Razorpay credentials not configured")
      console.error("[v0] RAZORPAY_KEY_ID:", razorpayKeyId ? "Set" : "Missing")
      console.error("[v0] RAZORPAY_KEY_SECRET:", razorpayKeySecret ? "Set" : "Missing")
      return NextResponse.json(
        { error: "Payment gateway not configured. Please contact support." }, 
        { status: 500 }
      )
    }

    console.log("[v0] Initializing Razorpay with key:", razorpayKeyId.substring(0, 10) + "...")

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })

    // Create Razorpay order
    console.log("[v0] Creating Razorpay order for amount:", amount)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise (INR smallest unit)
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId,
        customerName: shippingAddress?.name || "N/A",
      },
    })

    console.log("[v0] Razorpay order created:", razorpayOrder.id)

    // Verify Firebase Admin DB is initialized
    if (!adminDb) {
      console.error("[v0] Firebase Admin DB not initialized")
      return NextResponse.json(
        { error: "Database not available. Please contact support." }, 
        { status: 500 }
      )
    }

    // Create order document in Firestore
    console.log("[v0] Creating order document in Firestore...")
    const orderRef = await adminDb.collection("orders").add({
      userId,
      items,
      totalAmount: amount,
      currency,
      status: "created",
      payment: {
        razorpayOrderId: razorpayOrder.id,
        status: "created",
        createdAt: new Date(),
      },
      shippingAddress: shippingAddress || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("[v0] Order document created:", orderRef.id)

    return NextResponse.json({
      orderId: orderRef.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: razorpayKeyId,
    })
  } catch (error: any) {
    console.error("[v0] Error creating order:", error)
    console.error("[v0] Error stack:", error.stack)
    console.error("[v0] Error name:", error.name)
    console.error("[v0] Error message:", error.message)
    
    // Return a proper JSON error response
    return NextResponse.json(
      { 
        error: error.message || "Failed to create order",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      }, 
      { status: 500 }
    )
  }
}