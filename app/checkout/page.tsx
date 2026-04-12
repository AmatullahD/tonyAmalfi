"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/app/providers"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"

declare global {
  interface Window {
    Razorpay: any
  }
}

const FIREBASE_FUNCTIONS_BASE_URL = "https://us-central1-tony-amalfi.cloudfunctions.net"
const CREATE_ORDER_URL = `${FIREBASE_FUNCTIONS_BASE_URL}/createRazorpayOrder`
const VERIFY_PAYMENT_URL = `${FIREBASE_FUNCTIONS_BASE_URL}/verifyRazorpayPayment`

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
]

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth()
  const { items, total, clearCart, loading: cartLoading, refreshCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [userDataLoading, setUserDataLoading] = useState(true)
  const formRef = useRef<HTMLFormElement | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    house: "",
    road: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  })

  // coupon states
  const [coupon, setCoupon] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponMessage, setCouponMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !db) {
        setUserDataLoading(false)
        return
      }

      try {
        const userDocRef = doc(db, "users", user.uid)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          const userData: any = userDocSnap.data()
          setFormData({
            name: userData.displayName || `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "",
            email: userData.email || user.email || "",
            phone: userData.phone || "",
            house: userData.address?.house || userData.address?.street || "",
            road: userData.address?.road || userData.address?.area || "",
            landmark: userData.address?.landmark || "",
            city: userData.address?.city || "",
            state: userData.address?.state || "",
            pincode: userData.address?.zipCode || "",
          })
        } else {
          setFormData(prev => ({ ...prev, email: user.email || "" }))
        }
      } catch (error) {
        console.error("[Checkout] Error fetching user data:", error)
        setFormData(prev => ({ ...prev, email: user.email || "" }))
      } finally {
        setUserDataLoading(false)
      }
    }

    if (!authLoading) {
      if (user) {
        fetchUserData()
      } else {
        setUserDataLoading(false)
      }
    }
  }, [authLoading, user])

  useEffect(() => {
    if (!authLoading && user) {
      refreshCart()
    }
  }, [authLoading, user])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setScriptLoaded(true)
    script.onerror = () => {
      console.error("[Checkout] Failed to load Razorpay script")
      alert("Failed to load payment gateway. Please refresh the page.")
    }
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script)
    }
  }, [])

  if (cartLoading || (authLoading || (user && userDataLoading))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <Button onClick={() => router.push("/shop")}>Continue Shopping</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const applyCoupon = () => {
    if (couponApplied) {
      setCouponMessage("Coupon already applied")
      return
    }

    // Example coupon logic (replace with server-side validation in production)
    const code = coupon.trim().toUpperCase()
    if (code === "SAVE10") {
      const discount = +(total * 0.10).toFixed(2)
      setDiscountAmount(discount)
      setCouponApplied(true)
      setCouponMessage(`Coupon applied: ₹${discount} off`)
    } else if (code === "FLAT50") {
      const discount = Math.min(50, total)
      setDiscountAmount(discount)
      setCouponApplied(true)
      setCouponMessage(`Coupon applied: ₹${discount} off`)
    } else {
      setCouponMessage("Invalid coupon")
      setDiscountAmount(0)
      setCouponApplied(false)
    }
  }

  const submitFormProgrammatically = () => {
    if (formRef.current) {
      const f: any = formRef.current
      if (typeof f.requestSubmit === "function") {
        f.requestSubmit()
      } else {
        f.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
      }
    }
  }

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault()

    // For this UI change PR - keep existing guard: require sign in
    if (!user) {
      alert("Please sign in or create an account to purchase.")
      return
    }

    if (!scriptLoaded) {
      alert("Payment gateway is still loading. Please wait a moment and try again.")
      return
    }

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.house || !formData.road || !formData.city || !formData.state || !formData.pincode) {
      alert("Please fill in all required fields")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email address")
      return
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number")
      return
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      alert("Please enter a valid 6-digit pincode")
      return
    }

    setLoading(true)

    try {
      const orderResponse = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total - discountAmount,
          currency: "INR",
          userId: user?.uid || "guest",
          items,
          shippingAddress: formData,
          coupon: couponApplied ? coupon : undefined,
          discountAmount,
        }),
      })

      if (!orderResponse.ok) {
        const contentType = orderResponse.headers.get("content-type")
        let errorMessage = "Failed to create order"

        if (contentType && contentType.includes("application/json")) {
          const errorData = await orderResponse.json()
          errorMessage = errorData.error || errorMessage
        } else {
          const errorText = await orderResponse.text()
          console.error("[Checkout] Non-JSON error response:", errorText)
          errorMessage = "Server error. Please try again."
        }

        throw new Error(errorMessage)
      }

      const orderData = await orderResponse.json()

      if (!orderData.razorpayOrderId) throw new Error("Failed to create order")

      const razorpayKeyId = orderData.keyId

      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: "Tony Amalfi",
        description: "Premium Fashion",
        image: "/logo.png",
        handler: async (response: any) => {
          try {
            setPaymentProcessing(true)
            const verifyResponse = await fetch(VERIFY_PAYMENT_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              await clearCart()
              router.push(`/order-confirmation/${verifyData.orderId}`)
            } else {
              setPaymentProcessing(false)
              alert("Payment verification failed. Please contact support with Order ID: " + orderData.orderId)
            }
          } catch (err) {
            console.error("Payment verification error:", err)
            setPaymentProcessing(false)
            alert("Payment verification failed. Please contact support.")
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          house: formData.house,
          road: formData.road,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        theme: { color: "#000000" },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on("payment.failed", function (response: any) {
        console.error("[Checkout] Payment failed:", response.error)
        alert(`Payment failed: ${response.error.description}`)
        setLoading(false)
      })
      razorpay.open()
    } catch (error: any) {
      console.error("Checkout error:", error)
      alert(error.message || "Checkout failed. Please try again.")
      setLoading(false)
    }
  }

  const payableTotal = Math.max(0, +(total - discountAmount).toFixed(2))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Checkout</h1>
                {!user && (
                  <div className="text-sm">
                    <span className="text-gray-600">Have an account? </span>
                    <Link href="/auth/login?redirect=/checkout" className="text-blue-600 hover:underline font-medium">
                      Sign in
                    </Link>
                  </div>
                )}
              </div>

              {!user && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    <span className="font-medium">Please sign in or create an account to purchase.</span>
                    {' '}<Link href="/auth/login?redirect=/checkout" className="underline font-medium">Sign in</Link>{' '}or{' '}
                    <Link href="/auth/signup" className="underline font-medium">create an account</Link>.
                  </p>
                </div>
              )}

              <form id="checkout-form" ref={formRef} onSubmit={handleCheckout} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} required maxLength={10} />
                  <p className="text-xs text-gray-500 mt-1">10-digit mobile number</p>
                </div>

                {/* Address broken into fields similar to screenshot */}
                <div>
                  <label className="block text-sm font-medium mb-2">House no. / Building name *</label>
                  <Input name="house" value={formData.house} onChange={handleChange}  required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Road name / Area / Colony *</label>
                  <Input name="road" value={formData.road} onChange={handleChange}  required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nearby Famous Place / Shop / School (optional)</label>
                  <Input name="landmark" value={formData.landmark} onChange={handleChange}  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <Input name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <select name="state" value={formData.state} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                      <option value="">Select state</option>
                      {INDIA_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Pincode *</label>
                    <Input name="pincode" value={formData.pincode} onChange={handleChange} required maxLength={6} />
                  </div>
                </div>

               

               

              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-4 mb-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="flex-1">{item.name} x {item.quantity}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span className="text-green-600">FREE</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Coupon:</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{payableTotal.toFixed(2)}</span>
                </div>

               

                {/* Quick coupon small input also here (redundant but handy on mobile) */}
                {!couponApplied && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-2">Have a coupon?</label>
                    <div className="flex gap-2">
                      <Input placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                      <Button onClick={applyCoupon} disabled={!coupon}>Apply</Button>
                    </div>
                    {couponMessage && <p className="text-sm mt-2 text-gray-600">{couponMessage}</p>}
                  </div>
                )}
                 {/* Proceed to payment visible here for phone users */}
                <div className="mt-4">
                  <Button onClick={submitFormProgrammatically} className="w-full" disabled={loading || !scriptLoaded || !user}>
                    {loading ? "Processing..." : !scriptLoaded ? "Loading Payment Gateway..." : !user ? "Sign in to purchase" : `Proceed to Payment - ₹${payableTotal.toFixed(2)}`}
                  </Button>
                </div>

              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
