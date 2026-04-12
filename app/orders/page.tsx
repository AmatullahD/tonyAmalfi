"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getUserOrders, type Order } from "@/lib/services/orders"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }

    async function fetchOrders() {
      if (user) {
        console.log("[Orders] Fetching orders for user:", user.uid)
        const userOrders = await getUserOrders(user.uid)
        setOrders(userOrders)
        console.log("[Orders] Fetched", userOrders.length, "orders")
      }
      setLoading(false)
    }

    fetchOrders()
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading your orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">View and track all your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
            <Button onClick={() => router.push("/shop")}>Start Shopping</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-lg">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : order.status === "created"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        Placed on {order.createdAt.toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p>
                        {order.createdAt.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="font-bold text-2xl">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Items ({order.items.length}):</p>
                  <ul className="space-y-3">
                    {order.items.map((item: any, idx: number) => (
                      <li key={idx} className="flex gap-3 items-center">
                        {item.image && (
                          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-200 rounded">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.name}</p>
                          {(item.color || item.size) && (
                            <p className="text-gray-600 text-xs mt-1">
                              {item.color && `${item.color}`}
                              {item.color && item.size && " • "}
                              {item.size && `${item.size}`}
                            </p>
                          )}
                          <p className="text-gray-600 text-xs mt-1">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium text-gray-900 text-sm">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex gap-3">
                  <Link href={`/order-confirmation/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  {order.status === "paid" && (
                    <Button variant="outline" size="sm" disabled>
                      Track Order
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}