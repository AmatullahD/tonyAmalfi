"use client"

import { use, useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getOrderById, type Order } from "@/lib/services/orders"
import { cancelOrder, requestReturn, canCancelOrder, getCancellationTimeRemaining } from "@/lib/services/order-tracking"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle, CheckCircle, Package, Truck, XCircle, RotateCcw, MessageCircle, Calendar } from "lucide-react"

const WHATSAPP_NUMBER = "919119440992"

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user, loading: authLoading } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [returnReason, setReturnReason] = useState("")
  const [submittingReturn, setSubmittingReturn] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("")

  useEffect(() => {
    async function fetchOrder() {
      const orderData = await getOrderById(resolvedParams.id)
      setOrder(orderData)
      console.log("🔍 Full order data:", JSON.stringify(orderData, null, 2))
      console.log("📦 Delivery info:", (orderData as any).deliveryInfo)
      console.log("📋 Status history:", (orderData as any).statusHistory)
      setLoading(false)
    }

    if (!authLoading) {
      fetchOrder()
    }
  }, [resolvedParams.id, authLoading])

  useEffect(() => {
    if (!order) return

    const updateTime = () => {
      if (canCancelOrder(order.createdAt)) {
        setTimeRemaining(getCancellationTimeRemaining(order.createdAt))
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [order])

  const handleCancelOrder = async () => {
    if (!order || !user) return

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    )

    if (!confirmed) return

    setCancelling(true)
    try {
      await cancelOrder(order.id, user.uid)
      alert("Order cancelled successfully")
      const orderData = await getOrderById(resolvedParams.id)
      setOrder(orderData)
    } catch (error: any) {
      alert(error.message || "Failed to cancel order")
    } finally {
      setCancelling(false)
    }
  }

  const handleRequestReturn = async () => {
    if (!order || !user || !returnReason.trim()) {
      alert("Please provide a reason for return")
      return
    }

    setSubmittingReturn(true)
    try {
      await requestReturn(order.id, user.uid, returnReason)
      
      const whatsappMessage = encodeURIComponent(
        `Hello, I would like to return my order.\n\n` +
        `Order ID: ${order.id}\n` +
        `Order Date: ${order.createdAt.toLocaleDateString()}\n` +
        `Reason: ${returnReason}\n\n` +
        `Please assist me with the return process.`
      )
      
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, '_blank')
      
      alert("Return request submitted successfully! Please contact us on WhatsApp.")
      setShowReturnForm(false)
      setReturnReason("")
      
      const orderData = await getOrderById(resolvedParams.id)
      setOrder(orderData)
    } catch (error: any) {
      alert(error.message || "Failed to submit return request")
    } finally {
      setSubmittingReturn(false)
    }
  }

  const formatDeliveryDate = (date: any) => {
    if (!date) {
      console.log("❌ No date to format")
      return null
    }
    
    console.log("📅 Formatting date:", date, "Type:", typeof date)
    
    try {
      if (typeof date === 'string') {
        const formatted = new Date(date).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        console.log("✅ Formatted string date:", formatted)
        return formatted
      }
      
      if (date.toDate && typeof date.toDate === 'function') {
        const formatted = date.toDate().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        console.log("✅ Formatted Firestore timestamp:", formatted)
        return formatted
      }
      
      if (date.seconds) {
        const formatted = new Date(date.seconds * 1000).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        console.log("✅ Formatted seconds timestamp:", formatted)
        return formatted
      }
      
      const formatted = new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      console.log("✅ Formatted Date object:", formatted)
      return formatted
    } catch (error) {
      console.error("❌ Error formatting date:", error)
      return null
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const canCancel = canCancelOrder(order.createdAt) && ["created", "paid"].includes(order.status)
  const canReturn = order.status === "delivered" && !(order as any).returnRequest
  const hasReturnRequest = order.status === "return_requested"
  const deliveryInfo = (order as any).deliveryInfo
  const statusHistory = (order as any).statusHistory || []
  
  // Find delivery date - CHECK BOTH deliveryInfo AND statusHistory
  let deliveryDate = null
  
  // First check deliveryInfo
  if (deliveryInfo?.deliveredAt) {
    deliveryDate = deliveryInfo.deliveredAt
    console.log("✅ Found delivery date in deliveryInfo:", deliveryDate)
  }
  
  // If not found, check statusHistory (look for the LAST delivered entry with deliveryDate)
  if (!deliveryDate && statusHistory.length > 0) {
    // Find all delivered entries with deliveryDate, get the last one
    const deliveredEntries = statusHistory.filter((h: any) => h.status === 'delivered' && h.deliveryDate)
    if (deliveredEntries.length > 0) {
      const lastDelivered = deliveredEntries[deliveredEntries.length - 1]
      deliveryDate = lastDelivered.deliveryDate
      console.log("✅ Found delivery date in statusHistory:", deliveryDate)
    }
  }

  // Determine who delivered the order: prefer deliveryInfo.deliveredBy, else check statusHistory entries
  let deliveredBy: string | null = deliveryInfo?.deliveredBy || null
  if (!deliveredBy && statusHistory.length > 0) {
    const deliveredEntries = statusHistory.filter((h: any) => h.status === 'delivered' && (h.deliveryDate || h.deliveredBy))
    if (deliveredEntries.length > 0) {
      const lastDelivered = deliveredEntries[deliveredEntries.length - 1]
      deliveredBy = lastDelivered.deliveredBy || null
      console.log("✅ Found deliveredBy in statusHistory:", deliveredBy)
    }
  }
  
  console.log("🎯 Final delivery date:", deliveryDate)
  console.log("📊 Order status:", order.status)
  console.log("📋 Status history entries:", statusHistory.length)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="w-5 h-5 text-green-600" />
      case "shipped": return <Truck className="w-5 h-5 text-blue-600" />
      case "in_transit": return <Truck className="w-5 h-5 text-purple-600" />
      case "confirmed": return <Package className="w-5 h-5 text-blue-600" />
      case "cancelled": return <XCircle className="w-5 h-5 text-red-600" />
      case "return_requested": return <RotateCcw className="w-5 h-5 text-orange-600" />
      case "returned": return <RotateCcw className="w-5 h-5 text-orange-600" />
      case "refunded": return <CheckCircle className="w-5 h-5 text-emerald-600" />
      default: return <Package className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "created": return "Order Created"
      case "paid": return "Payment Successful - Awaiting Confirmation"
      case "confirmed": return "Order Confirmed - Preparing for Dispatch"
      case "in_transit": return "Order in Transit"
      case "shipped": return "Order Shipped - On the Way"
      case "delivered": return "Order Delivered"
      case "cancelled": return "Order Cancelled"
      case "return_requested": return "Return Requested - Pending Approval"
      case "returned": return "Order Returned"
      case "refunded": return "Refund Processed"
      default: return "Order Status Unknown"
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formattedDeliveryDate = deliveryDate ? formatDeliveryDate(deliveryDate) : null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* DELIVERY BANNER - Show at the very top if delivered */}
        {order.status === "delivered" && formattedDeliveryDate && (
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl shadow-2xl p-8 mb-6 print:hidden border-4 border-green-400">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <CheckCircle className="w-12 h-12" />
                <h2 className="text-3xl font-bold">Order Delivered!</h2>
              </div>
             
            </div>
          </div>
        )}

        {/* Success Message for new orders */}
        {["created", "paid"].includes(order.status) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-6 text-center print:hidden">
            <div className="text-4xl sm:text-5xl mb-3">✓</div>
            <h1 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">Order Placed!</h1>
            <p className="text-sm sm:text-base text-green-700">Thank you for your purchase. Your order has been successfully placed.</p>
          </div>
        )}

        {/* Order Status Card */}
        <Card className="p-4 sm:p-6 mb-6 print:hidden">
          <div className="flex items-center gap-3 mb-4">
            {getStatusIcon(order.status)}
            <div className="flex-1">
              <h2 className="font-bold text-lg">{getStatusMessage(order.status)}</h2>
              <p className="text-sm text-gray-600">Order #{order.id.slice(0, 12).toUpperCase()}</p>
            </div>
            {/* Show delivery date badge next to status */}
            {order.status === "delivered" && formattedDeliveryDate && (
              <div className="bg-green-100 border-2 border-green-400 rounded-lg px-4 py-2">
                <p className="text-xs text-green-700 font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formattedDeliveryDate}
                </p>
              </div>
            )}
          </div>

          {/* Cancellation Notice */}
          {canCancel && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-yellow-800 mb-1">
                    You can cancel this order within 2 hours
                  </p>
                  <p className="text-sm text-yellow-700">
                    Time remaining: <strong>{timeRemaining}</strong>
                  </p>
                  <Button
  onClick={handleCancelOrder}
  disabled={cancelling}
  size="sm"
  className="
    mt-3 
    bg-red-600 
    text-white 
    hover:bg-red-700 
    disabled:bg-red-300 
    disabled:text-white
  "
>
  {cancelling ? "Cancelling..." : "Cancel Order"}
</Button>

                </div>
              </div>
            </div>
          )}

          {/* Return Request Notice */}
          {hasReturnRequest && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-orange-800 mb-1">
                    Return Request Submitted
                  </p>
                  <p className="text-sm text-orange-700">
                    Your return request has been submitted and is pending approval. Our team will contact you shortly via WhatsApp.
                  </p>
                  {(order as any).returnRequest && (
                    <p className="text-xs text-orange-600 mt-2">
                      Reason: {(order as any).returnRequest.reason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Cancellation & Refund Policy link — show after an order is cancelled */}
          {order.status === "cancelled" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-red-800 mb-1">
                    This order has been cancelled.
                  </p>
                  <p className="text-sm text-red-700">
                    For information on cancellations and refunds, please read our "
                    <Link href="/returns" className="font-medium underline text-red-700">
                      Returns & Refunds Policy
                    </Link>
                    ".
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Info Card - Prominent */}
          {order.status === "delivered" && formattedDeliveryDate && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5 mb-4">
              <div className="flex items-start gap-4">
                <div className="bg-green-600 text-white rounded-full p-3">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-green-800 mb-3">Delivery Completed</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">Delivered On</p>
                      <p className="text-base font-bold text-green-900">{formattedDeliveryDate}</p>
                    </div>
                    <div>
                               </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Timeline */}
          {statusHistory.length > 1 && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold text-sm mb-3">Order Timeline</h3>
              <div className="space-y-3">
                {statusHistory.slice().reverse().map((history: any, idx: number) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <div className="flex-shrink-0 w-20 text-gray-600">
                      {new Date(history.timestamp).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{getStatusMessage(history.status)}</p>
                      {history.note && (
                        <p className="text-xs text-gray-600 mt-1">{history.note}</p>
                      )}
                      {history.status === 'delivered' && history.deliveryDate && (
                        <div className="mt-2 bg-green-100 border border-green-300 rounded px-3 py-1.5 inline-block">
                          <p className="text-xs text-green-700 font-bold flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDeliveryDate(history.deliveryDate)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Invoice Card */}
        <Card className="p-4 sm:p-8 bg-white shadow-lg">
          {/* Invoice Header */}
          <div className="border-b-2 border-gray-300 pb-4 sm:pb-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <img src="/logo.svg" alt="Tony Amalfi" className="h-10 sm:h-12 mb-2" />
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider">Tax Invoice</h2>
              </div>
              <div className="sm:text-right">
                <p className="text-xs sm:text-sm text-gray-600">Order ID</p>
                <p className="font-mono font-bold text-base sm:text-lg">{order.id.slice(0, 12).toUpperCase()}</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  Placed: {order.createdAt.toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                {/* Delivery date in invoice header */}
                {order.status === "delivered" && formattedDeliveryDate && (
                  <div className="mt-3 bg-green-600 text-white rounded-lg px-3 py-2 inline-block">
                    <p className="text-xs font-semibold uppercase">Delivered</p>
                    <p className="text-sm font-bold">{formattedDeliveryDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Billing and Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-gray-700">From</h3>
              <div className="text-sm space-y-1">
                  <p className="font-bold">Tony Amalfi</p>
                  <p>Premium Fashion Store</p>
                  <p>Pune, Maharashtra</p>
                  <p>India</p>
                  <p className="text-xs text-gray-600">GSTIN: 27BGPPN2079G1ZZ</p>
                </div>
            </div>

            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-gray-700">Bill To</h3>
              {order.shippingAddress && Object.keys(order.shippingAddress).length > 0 ? (
                <div className="text-sm space-y-1">
                  <p className="font-bold">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                  <p>Email: {order.shippingAddress.email}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No address provided</p>
              )}
            </div>
          </div>

          {/* Order Items Table */}
          <div className="mb-6 sm:mb-8">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-700">Order Details</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-3 sm:px-4 py-3 text-xs font-bold uppercase tracking-wider">Item</th>
                    <th className="text-center px-3 sm:px-4 py-3 text-xs font-bold uppercase tracking-wider hidden md:table-cell">Qty</th>
                    <th className="text-right px-3 sm:px-4 py-3 text-xs font-bold uppercase tracking-wider">Price</th>
                    <th className="text-right px-3 sm:px-4 py-3 text-xs font-bold uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-4 py-4">
                        <div className="flex gap-2 sm:gap-3 items-start">
                          {item.image && (
                            <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-gray-200 rounded hidden md:block">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-xs sm:text-sm break-words">{item.name}</p>
                            {(item.color || item.size) && (
                              <p className="text-xs text-gray-600 mt-1">
                                {item.color && `Color: ${item.color}`}
                                {item.color && item.size && " • "}
                                {item.size && `Size: ${item.size}`}
                              </p>
                            )}
                            <p className="text-xs text-gray-600 mt-1 md:hidden">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-center text-sm hidden md:table-cell">{item.quantity}</td>
                      <td className="px-3 sm:px-4 py-4 text-right text-xs sm:text-sm whitespace-nowrap">₹{item.price.toFixed(2)}</td>
                      <td className="px-3 sm:px-4 py-4 text-right text-xs sm:text-sm font-semibold whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t-2 border-gray-300 pt-4 sm:pt-6">
            <div className="max-w-xs ml-auto space-y-2 sm:space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">Included</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-2 sm:pt-3 flex justify-between items-center">
                <span className="font-bold text-base sm:text-lg">Total Amount</span>
                <span className="font-bold text-xl sm:text-2xl">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 print:hidden">
            <Button onClick={handlePrint} variant="outline" className="w-full sm:w-auto">
              Print Invoice
            </Button>
            <Link href="/orders" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">View All Orders</Button>
            </Link>
            {canReturn && !showReturnForm && (
              <Button 
                onClick={() => setShowReturnForm(true)}
                variant="outline"
                className="w-full sm:w-auto border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Apply for Return
              </Button>
            )}
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </Card>

        {/* Return Request Form */}
        {canReturn && showReturnForm && (
          <Card className="p-6 sm:p-8 bg-white shadow-lg mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Request Return</h2>
              <p className="text-sm text-gray-600">Fill in the details below to initiate a return request</p>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-sm text-blue-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Return Instructions
              </h3>
              <ul className="text-xs text-blue-800 space-y-1.5">
                <li>• Please contact us on WhatsApp for return processing</li>
                <li>• Provide your order ID and reason for return</li>
                <li>• Our team will guide you through the return process</li>
                <li>• Returns are accepted within 24 hours of delivery</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="orderid" className="text-sm font-medium mb-2 block">
                  Order ID
                </Label>
                <Input
                  id="orderid"
                  value={order.id.slice(0, 12).toUpperCase()}
                  readOnly
                  className="bg-gray-100 font-mono"
                />
              </div>
              
              <div>
                <Label htmlFor="orderDate" className="text-sm font-medium mb-2 block">
                  Order Date
                </Label>
                <Input
                  id="orderDate"
                  value={order.createdAt.toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="returnReason" className="text-sm font-medium mb-2 block">
                Reason for Return <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="returnReason"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Please provide a detailed explanation of why you want to return this order..."
                rows={5}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please be as detailed as possible to help us process your return faster
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  setShowReturnForm(false)
                  setReturnReason("")
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestReturn}
                disabled={!returnReason.trim() || submittingReturn}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                {submittingReturn ? "Submitting..." : "Submit & Contact on WhatsApp"}
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* Help Section */}
      <div className="text-center mt-6 sm:mt-8 pb-8 text-xs sm:text-sm text-gray-600 print:hidden container mx-auto px-4">
        <p>Need help with your order?</p>
        <Link href="/contact" className="text-blue-600 hover:underline">
          Contact Support
        </Link>
      </div>

      <Footer />

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          header, footer, .print\\:hidden {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}