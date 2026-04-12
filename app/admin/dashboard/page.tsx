"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getAdminSession, clearAdminSession } from "@/lib/admin-auth"
import { getAllProducts, Product, deleteProduct } from "@/lib/services/products"
import { getAllOrders, getAllUsers, type Order, type UserProfile } from "@/lib/services/admin"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Pencil, Trash2, Eye, Package, AlertCircle, ShoppingCart, Users, Settings } from "lucide-react"

export default function AdminDashboard() {
  // allow multiple possible fields from session (username/email/uid)
  const [session, setSession] = useState<{ username?: string; email?: string; uid?: string } | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const router = useRouter()

  // Date filter UI state
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "yesterday" | "range">("all")
  const [rangeFrom, setRangeFrom] = useState("") // yyyy-mm-dd
  const [rangeTo, setRangeTo] = useState("")

  // --- Auth check ---
  const checkAdminAccess = async () => {
    setLoading(true)
    try {
      const adminSession = await getAdminSession()
      if (!adminSession) {
        router.push("/admin/login")
        return
      }

      setSession(adminSession)
      // only fetch after we have a session
      fetchProducts()
      fetchOrders()
      fetchUsers()
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAdminAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const fetchProducts = async () => {
    // keep the product-level loading separate if you want more granular UI
    try {
      const fetchedProducts = await getAllProducts()
      setProducts(fetchedProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const fetchedOrders = await getAllOrders()

      // DO NOT include orders with "created" or "just_created" status
      const filtered = (fetchedOrders || []).filter(
        (o: Order) => {
          const s = (o.status || "").toString().toLowerCase()
          return s !== "created" && s !== "just_created"
        }
      )

      setOrders(filtered)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const fetchedUsers = await getAllUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setUsersLoading(false)
    }
  }

  const handleLogout = async () => {
    await clearAdminSession()
    router.push("/admin/login")
  }

  const handleDelete = async (productId: string) => {
    if (deleteConfirm !== productId) {
      setDeleteConfirm(productId)
      setTimeout(() => setDeleteConfirm(null), 3000)
      return
    }

    try {
      await deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
      setDeleteConfirm(null)
      alert("Product deleted successfully")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product")
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800"
      case "shipped": return "bg-blue-100 text-blue-800"
      case "in_transit": return "bg-purple-100 text-purple-800"
      case "confirmed": return "bg-blue-100 text-blue-800"
      case "paid": return "bg-yellow-100 text-yellow-800"
      case "cancelled": return "bg-red-100 text-red-800"
      case "return_requested": return "bg-orange-100 text-orange-800"
      case "returned": return "bg-orange-100 text-orange-800"
      case "refunded": return "bg-emerald-100 text-emerald-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // --- Date helpers ---
  const dateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const parseOrderDate = (order: Order) => {
    // handle if createdAt is Date or string or timestamp
    const d = order?.createdAt
    if (!d) return null
    const dt = d instanceof Date ? d : new Date(d)
    if (isNaN(dt.getTime())) return null
    return dateOnly(dt)
  }

  const today = dateOnly(new Date())
  const yesterday = dateOnly(new Date(Date.now() - 24 * 60 * 60 * 1000))

  // Compute filteredOrders based on dateFilter and range
  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return []

    return orders.filter(order => {
      const od = parseOrderDate(order)
      if (!od) return false

      if (dateFilter === "all") return true
      if (dateFilter === "today") {
        return od.getTime() === today.getTime()
      }
      if (dateFilter === "yesterday") {
        return od.getTime() === yesterday.getTime()
      }
      if (dateFilter === "range") {
        if (!rangeFrom || !rangeTo) return true // if incomplete range, don't hide
        const from = dateOnly(new Date(rangeFrom + "T00:00:00"))
        const to = dateOnly(new Date(rangeTo + "T00:00:00"))
        // inclusive
        return od.getTime() >= from.getTime() && od.getTime() <= to.getTime()
      }
      return true
    })
  }, [orders, dateFilter, rangeFrom, rangeTo, today, yesterday])

  const applyRangeFilter = () => {
    if (!rangeFrom || !rangeTo) {
      alert("Please pick both start and end dates for the range.")
      return
    }
    // ensure dateFilter set to range
    setDateFilter("range")
  }

  const clearDateFilter = () => {
    setDateFilter("all")
    setRangeFrom("")
    setRangeTo("")
  }

  // show top-level loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Checking admin session...</p>
        </div>
      </div>
    )
  }

  // if not authenticated, we already redirected — render nothing to avoid flicker
  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {session.username ?? session.email ?? session.uid}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Products Management</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {products.length} {products.length === 1 ? 'product' : 'products'} total
                </p>
              </div>
              <Link href="/admin/products/new">
                <Button>Add New Product</Button>
              </Link>
            </div>

            {products.length === 0 ? (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <Package className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                  <p className="text-gray-600 mb-4">Get started by adding your first product</p>
                  <Link href="/admin/products/new">
                    <Button>Add Product</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1 truncate">{product.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {product.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Price</p>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-bold text-green-600">
                                ₹{product.discountedPrice}
                              </p>
                              <p className="text-sm text-gray-500 line-through">
                                ₹{product.originalPrice}
                              </p>
                            </div>
                            <p className="text-xs text-green-600 font-medium">
                              {Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}% OFF
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Category</p>
                            <p className="text-sm font-medium">{product.category}</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Stock</p>
                            <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {product.stock} units
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sizes</p>
                            <p className="text-sm font-medium">
                              {product.sizeDetails?.length || 0} sizes
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link href={`/products/${product.id}`} target="_blank">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Button variant="default" size="sm" className="gap-2">
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleDelete(product.id)}
                          >
                            {deleteConfirm === product.id ? (
                              <>
                                <AlertCircle className="w-4 h-4" />
                                Confirm Delete?
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Orders Management</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredOrders.length} of {orders.length} {orders.length === 1 ? 'order' : 'orders'} visible
                </p>
              </div>
            </div>

            {/* Filters UI */}
            <Card className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={dateFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("all")}
                  >
                    All
                  </Button>

                  <Button
                    variant={dateFilter === "today" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("today")}
                  >
                    Today
                  </Button>

                  <Button
                    variant={dateFilter === "yesterday" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("yesterday")}
                  >
                    Yesterday
                  </Button>
                </div>

                {/* Range inputs */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">From</label>
                  <input
                    type="date"
                    value={rangeFrom}
                    onChange={(e) => setRangeFrom(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                    aria-label="Range from date"
                  />
                  <label className="text-sm text-gray-600">To</label>
                  <input
                    type="date"
                    value={rangeTo}
                    onChange={(e) => setRangeTo(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                    aria-label="Range to date"
                  />
                  <Button size="sm" onClick={applyRangeFilter}>Apply</Button>
                  <Button variant="outline" size="sm" onClick={clearDateFilter}>Clear</Button>
                </div>
              </div>
            </Card>

            {ordersLoading ? (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              </Card>
            ) : filteredOrders.length === 0 ? (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders</h3>
                  <p className="text-gray-600">No orders match the selected filters</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-bold text-lg">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
                            {order.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>User ID: {order.userId?.slice?.(0, 12)}...</p>
                          <p>
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          {order.shippingAddress && (
                            <p>Ship to: {order.shippingAddress.name} - {order.shippingAddress.city}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="font-bold text-2xl">₹{order.totalAmount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 mt-1">{order.items.length} items</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-3">Order Items:</p>
                      <ul className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <li key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                              <span className="font-medium">{item.name}</span>
                              {(item.color || item.size) && (
                                <span className="text-gray-600 text-xs ml-2">
                                  ({item.color && `${item.color}`}
                                  {item.color && item.size && ", "}
                                  {item.size && `${item.size}`})
                                </span>
                              )}
                              <span className="text-gray-600"> × {item.quantity}</span>
                            </div>
                            <span className="font-medium text-gray-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link href={`/order-confirmation/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View Invoice
                        </Button>
                      </Link>
                      <Link href={`/admin/orders/tracking/${order.id}`}>
                        <Button size="sm" className="gap-2">
                          <Settings className="w-4 h-4" />
                          Manage Tracking
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Users Management</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {users.length} {users.length === 1 ? 'user' : 'users'} registered
                </p>
              </div>
            </div>

            {usersLoading ? (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                  <p className="text-gray-600">Loading users...</p>
                </div>
              </Card>
            ) : users.length === 0 ? (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <Users className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users yet</h3>
                  <p className="text-gray-600">Registered users will appear here</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {users.map((user) => (
                  <Card key={user.uid} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{user.displayName || 'Anonymous User'}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">User ID</p>
                            <p className="text-sm font-mono">{user.uid.slice(0, 12)}...</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Joined</p>
                            <p className="text-sm">
                              {user.createdAt?.toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) || 'N/A'}
                            </p>
                          </div>
                          <div>
                           
                            
                          </div>
                        </div>

                        {user.phoneNumber && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                            <p className="text-sm">{user.phoneNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
