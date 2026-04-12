import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { adminDb } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json()

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body)
      .digest("hex")

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Update order status in Firestore
    await adminDb.collection("orders").doc(orderId).update({
      status: "paid",
      "payment.razorpayPaymentId": razorpayPaymentId,
      "payment.signature": razorpaySignature,
      "payment.status": "paid",
      "payment.verifiedAt": new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, orderId })
  } catch (error: any) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
