"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAdminSession } from "@/lib/admin-auth"
import { getOrderById, type Order } from "@/lib/services/orders"
import { updateOrderStatus, markReturnRefunded, type OrderStatus } from "@/lib/services/order-tracking"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, RotateCcw, DollarSign, Calendar } from "lucide-react"

export default function AdminOrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [session, setSession] = useState<{ username: string } | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState("")

  // Helper: format various date types (string, Firestore Timestamp, seconds object, Date)
  const formatDate = (date: any) => {
    if (!date) return null
    try {
      if (typeof date === 'string') return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
      if (date.toDate && typeof date.toDate === 'function') return date.toDate().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
      if (date.seconds) return new Date(date.seconds * 1000).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
      return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch (err) {
      return null
    }
  }

  // Helper: Get last delivered entry either from deliveryInfo or the last history entry with deliveryDate
  const getLastDeliveredEntry = (order: Order | null) => {
    if (!order) return null
    const deliveryInfo = (order as any).deliveryInfo
    if (deliveryInfo && deliveryInfo.deliveredAt) {
      return { date: deliveryInfo.deliveredAt, deliveredBy: deliveryInfo.deliveredBy }
    }

    const history = (order as any).statusHistory || []
    const deliveredEntries = history.filter((h: any) => h && h.status === 'delivered' && h.deliveryDate)
    if (deliveredEntries.length === 0) return null

    // Sort by timestamp if present, else use last in order
    const getTime = (e: any) => {
      const ts = e.timestamp || e.deliveryDate
      if (!ts) return 0
      if (ts.toDate && typeof ts.toDate === 'function') return ts.toDate().getTime()
      if (ts.seconds) return ts.seconds * 1000
      try {
        return new Date(ts).getTime()
      } catch (err) {
        return 0
      }
    }

    const sorted = deliveredEntries.slice().sort((a: any, b: any) => {
      const ta = getTime(a)
      const tb = getTime(b)
      return ta - tb
    })

    const last = sorted[sorted.length - 1]
    return { date: last.deliveryDate, deliveredBy: last.deliveredBy }
  }

  const lastDelivered = getLastDeliveredEntry(order)

  useEffect(() => {
    if (!order) return
    console.group("[AdminOrderTracking] Debug Order")
    console.log("Order id:", order.id)
    console.log("deliveryInfo:", (order as any).deliveryInfo)
    console.log("statusHistory:", (order as any).statusHistory)
    console.log("Computed lastDelivered:", lastDelivered)
    console.groupEnd()
  }, [order])

  useEffect(() => {
    const adminSession = getAdminSession()
    if (!adminSession) {
      router.push("/admin/login")
    } else {
      setSession(adminSession)
      fetchOrder()
    }
  }, [router, resolvedParams.id])

  const fetchOrder = async () => {
    setLoading(true)
    try {
      const orderData = await getOrderById(resolvedParams.id)
      setOrder(orderData)
    } catch (error) {
      console.error("Error fetching order:", error)
      alert("Failed to fetch order")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order) return

    // For delivered status, require delivery date
    if (newStatus === "delivered" && !deliveryDate) {
      alert("Please select a delivery date")
      return
    }

    const confirmMsg = `Are you sure you want to change order status to "${newStatus.replace(/_/g, ' ').toUpperCase()}"?`
    if (!window.confirm(confirmMsg)) {
      return
    }

    setUpdating(true)
    try {
      const deliveryDateObj = newStatus === "delivered" && deliveryDate 
        ? new Date(deliveryDate) 
        : undefined

      await updateOrderStatus(resolvedParams.id, newStatus, undefined, deliveryDateObj)
      
      // If marking as refunded, use special function
      if (newStatus === "refunded") {
        await markReturnRefunded(resolvedParams.id)
      }

      alert(`Order status updated to ${newStatus.replace(/_/g, ' ')}`)
      setDeliveryDate("")
      fetchOrder()
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update order status")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-xl font-bold mb-4">Order Not Found</h2>
          <Link href="/admin/dashboard/">
            <Button>Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const statusButtons: { status: OrderStatus; label: string; icon: any; color: string }[] = [
    { status: "confirmed", label: "Confirm Order", icon: CheckCircle, color: "bg-blue-600 hover:bg-blue-700" },
    { status: "in_transit", label: "Mark In Transit", icon: Truck, color: "bg-purple-600 hover:bg-purple-700" },
    { status: "shipped", label: "Mark Shipped", icon: Package, color: "bg-indigo-600 hover:bg-indigo-700" },
    { status: "delivered", label: "Mark Delivered", icon: CheckCircle, color: "bg-green-600 hover:bg-green-700" },
    { status: "cancelled", label: "Cancel Order", icon: XCircle, color: "bg-red-600 hover:bg-red-700" },
    { status: "returned", label: "Mark Returned", icon: RotateCcw, color: "bg-orange-600 hover:bg-orange-700" },
    { status: "refunded", label: "Mark Refunded", icon: DollarSign, color: "bg-emerald-600 hover:bg-emerald-700" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Order Tracking Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Order Info */}
        <Card className="p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Order #{order.id.slice(0, 12).toUpperCase()}</h2>
              <p className="text-sm text-gray-600">
                Placed on {order.createdAt.toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>

              {order.status === 'delivered' && (
                lastDelivered ? (
                  <p className="text-sm text-green-700 mt-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Delivered on: <strong className="text-sm text-green-900">{formatDate(lastDelivered.date)}</strong>
                  </p>
                ) : (
                  <p className="text-sm text-red-600 mt-2">Delivery date not found in deliveryInfo or statusHistory.</p>
                )
              )}
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                order.status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : order.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : order.status === "returned"
                  ? "bg-orange-100 text-orange-800"
                  : order.status === "refunded"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {order.status.replace(/_/g, ' ').toUpperCase()}
            </span>
            {/* Small delivered date shown near badge for visibility */}
            {order.status === 'delivered' && lastDelivered && (
              <div className="ml-4 text-sm text-green-700 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(lastDelivered.date)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="text-sm space-y-1">
                <p><strong>Name:</strong> {order.shippingAddress?.name}</p>
                <p><strong>Email:</strong> {order.shippingAddress?.email}</p>
                <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
                <p><strong>User ID:</strong> {order.userId.slice(0, 12)}...</p>
              </div>
            </div>

           <div>
  <h3 className="font-semibold mb-2">Shipping Address</h3>

  {order.shippingAddress ? (
    <div className="text-sm space-y-1">
      {/* House / Building */}
      {(order.shippingAddress.house || order.shippingAddress.address) && (
        <p>
          {order.shippingAddress.house || order.shippingAddress.address}
        </p>
      )}

      {/* Road / Area */}
      {order.shippingAddress.road && (
        <p>{order.shippingAddress.road}</p>
      )}

      {/* Landmark */}
      {order.shippingAddress.landmark && (
        <p className="text-gray-600">
          Landmark: {order.shippingAddress.landmark}
        </p>
      )}

      {/* City, State, Pincode */}
      <p>
        {order.shippingAddress.city}
        {order.shippingAddress.city && order.shippingAddress.state && ", "}
        {order.shippingAddress.state}
        {order.shippingAddress.pincode && ` - ${order.shippingAddress.pincode}`}
      </p>

      {/* Contact */}
      {order.shippingAddress.phone && (
        <p>Phone: {order.shippingAddress.phone}</p>
      )}
      {order.shippingAddress.email && (
        <p>Email: {order.shippingAddress.email}</p>
      )}
    </div>
  ) : (
    <p className="text-sm text-gray-500">No shipping address available</p>
  )}
</div>

          </div>

          <div className="mt-4 pt-4 border-t">
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {(item.color || item.size) && (
                      <p className="text-xs text-gray-600">
                        {item.color && `${item.color}`}
                        {item.color && item.size && " • "}
                        {item.size && `${item.size}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total Amount</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Return Request Info */}
          {order.status === "return_requested" && (order as any).returnRequest && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold mb-2 text-orange-700">Return Request</h3>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm mb-1">
                  <strong>Requested:</strong> {new Date((order as any).returnRequest.requestedAt).toLocaleString()}
                </p>
                <p className="text-sm">
                  <strong>Reason:</strong> {(order as any).returnRequest.reason}
                </p>
              </div>
            </div>
          )}

          {/* Delivery Info */}
          {lastDelivered && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold mb-2 text-green-700">Delivery Information</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm mb-2">
                  <strong>Delivered on:</strong>{" "}
                  {formatDate(lastDelivered.date)}
                </p>
                <p className="text-sm">
                  <strong>Delivered by:</strong> {lastDelivered?.deliveredBy || (order as any).deliveryInfo?.deliveredBy || 'Admin'}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Status Update Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Update Order Status</h3>
          
          {/* Delivery Date (for delivered status) */}
          <div className="mb-4">
            <Label htmlFor="deliveryDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Delivery Date (Required for "Delivered" status)
            </Label>
            <Input
              id="deliveryDate"
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="mt-1"
            />
          </div>

          {/* Status Action Buttons - Show ALL options */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {statusButtons.map(({ status, label, icon: Icon, color }) => {
              // Don't allow changing to current status
              if (status === order.status) return null

              return (
                <Button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={updating}
                  className={`${color} text-white gap-2`}
                >
                  <Icon className="w-4 h-4" />
                  {updating ? "Updating..." : label}
                </Button>
              )
            })}
          </div>

          <p className="text-xs text-gray-600 mt-4">
            <strong>Current Status:</strong> {order.status.replace(/_/g, ' ').toUpperCase()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Note: You can change to any status. Be careful as this may skip steps in the normal order flow.
          </p>
        </Card>

        {/* Status History */}
        {(order as any).statusHistory && (order as any).statusHistory.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Status History</h3>
            <div className="space-y-3">
              {(order as any).statusHistory.map((history: any, idx: number) => (
                <div key={idx} className="flex gap-4 pb-3 border-b last:border-b-0">
                  <div className="flex-shrink-0 w-24 text-sm text-gray-600">
                    {new Date(history.timestamp).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {history.status.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    {history.note && (
                      <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                    )}
                    {/* Show delivery date in history if status is delivered */}
                    {history.status === 'delivered' && history.deliveryDate && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        📦 Delivered on: {formatDate(history.deliveryDate)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}