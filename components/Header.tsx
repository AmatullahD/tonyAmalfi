"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, Menu, X, Plus, Minus, LogIn, LogOut } from "lucide-react"
import { useCart } from "@/app/providers"
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase"

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { items, removeItem, updateQuantity, total } = useCart()
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [shopOpen, setShopOpen] = useState(false)



  useEffect(() => {
    if (!auth) return
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return () => unsub()
  }, [])



  const handleSignOut = async () => {
    try {
      if (auth) {
        await signOut(auth)
        setCurrentUser(null)
      }
    } catch (err) {
      console.error("Sign out error:", err)
    }
  }

  const goToCheckout = () => {
    // Allow checkout for both logged in and guest users
    router.push("/checkout")
    setCartOpen(false)
  }

  const handleIncreaseQuantity = async (itemId: string, currentQuantity: number) => {
    await updateQuantity(itemId, currentQuantity + 1)
  }

  const handleDecreaseQuantity = async (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      await updateQuantity(itemId, currentQuantity - 1)
    }
  }

  return (
    <>
      {/* Promo Banner */}
      <div className="w-full bg-white border-b border-gray-200 py-2 flex items-center justify-center">
        <span className="border border-gray-400 rounded-full px-5 py-1 text-xs font-medium tracking-wide text-gray-700">
          Get ₹100 OFF on Prepaid Orders!
        </span>
      </div>

      <header className="w-full bg-white border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Desktop Layout */}
          <div className="relative hidden md:flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex items-center z-10">
              <Link href="/" className="flex items-center">
                <img src="/logo.svg" alt="Tony Amalfi Logo" className="h-10 w-auto" />
                <span className="sr-only">Tony Amalfi</span>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-8 z-20"
              aria-label="Primary navigation"
            >
              <div className="relative flex items-center gap-1">

                {/* 👉 Shop page link */}
                <Link
                  href="/shop"
                  className="text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-base"
                >
                  Shop
                </Link>

                {/* 👉 Dropdown toggle arrow */}
                <button onClick={() => setShopOpen(!shopOpen)}>
                  <span className={`text-xs transition-transform ${shopOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {/* 👉 Dropdown menu */}
                {shopOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                    <Link href="/shop/Denim-Jackets" className="block px-4 py-2 hover:bg-gray-100">Denim Jackets</Link>
                    <Link href="/shop/Pullover" className="block px-4 py-2 hover:bg-gray-100">Pullover</Link>
                    <Link href="/shop/Jeans" className="block px-4 py-2 hover:bg-gray-100">Jeans</Link>
                    <Link href="/shop/T-Shirts" className="block px-4 py-2 hover:bg-gray-100">T-Shirts</Link>
                    <Link href="/shop/Shirts" className="block px-4 py-2 hover:bg-gray-100">Shirts</Link>
                  </div>
                )}
              </div>
              <Link
                href="/"
                className="text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-base"
              >
                Home
              </Link>

              <Link
                href="/contact"
                className="text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-base"
              >
                Contact
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-base"
              >
                About
              </Link>
              {currentUser && (
                <Link
                  href="/orders"
                  className="text-sm font-medium uppercase tracking-wider hover:text-muted-foreground transition-base"
                >
                  Orders
                </Link>
              )}
            </nav>

            {/* Right: Icons / Auth */}
            <div className="flex items-center space-x-4 ml-auto z-10">
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="p-2 hover:bg-secondary transition-base"
                  aria-label="Sign out"
                  title={currentUser.email ?? "Sign out"}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="p-2 hover:bg-secondary transition-base"
                  aria-label="Sign in"
                  title="Sign in"
                >
                  <LogIn className="h-5 w-5" />
                </Link>
              )}

              <Link href="/cart" className="p-2 hover:bg-secondary transition-base relative">
                <ShoppingBag className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute top-0 right-0 bg-foreground text-background text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Layout */}

          <div className="flex md:hidden items-center justify-between h-16 px-4">

            {/* Left: Logo */}
            <Link href="/" className="flex items-center z-10 -ml-2">
              <img src="/logo.svg" alt="Tony Amalfi Logo" className="h-8 w-auto" />
            </Link>

            {/* Right: Cart and Menu */}
            <div className="flex items-center space-x-2 z-10">


              {/* Cart */}
              <Link
                href="/cart"
                className="w-9 h-9 flex items-center justify-center hover:bg-secondary rounded-md transition-base relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>

              {/* Menu */}
              <button
                type="button"
                className="w-9 h-9 flex items-center justify-center hover:bg-secondary rounded-md transition-base"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Cart Panel */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/50"
            onClick={() => setCartOpen(false)}
            aria-hidden="true"
          />

          <aside
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-border flex flex-col z-[9999] shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold uppercase tracking-wider">Shopping Cart</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <button
                    onClick={() => {
                      setCartOpen(false)
                      router.push("/shop")
                    }}
                    className="mt-4 px-6 py-2 bg-foreground text-background rounded hover:opacity-90"
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-border">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        {(item.color || item.size) && (
                          <p className="text-xs text-muted-foreground">
                            {item.color && `${item.color}`}
                            {item.color && item.size && " / "}
                            {item.size && `${item.size}`}
                          </p>
                        )}
                        <p className="text-sm font-medium mt-2">₹{(item.price * item.quantity).toFixed(2)}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs text-muted-foreground">Qty:</span>
                          <div className="flex items-center gap-2 border border-gray-300 rounded">
                            <button
                              type="button"
                              onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                              className="p-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                              className="p-1 hover:bg-gray-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs uppercase tracking-wider hover:text-red-600 transition-base self-start"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border p-6 space-y-4">


                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={goToCheckout}
                    className="w-full bg-foreground text-background py-3 font-medium uppercase tracking-wider hover:opacity-90 transition-base"
                  >
                    Checkout
                  </button>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="w-full border border-foreground text-foreground py-3 font-medium uppercase tracking-wider hover:bg-gray-50 transition-base"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </aside>
        </>
      )}

      {/* Mobile Menu Dropdown - Horizontal Layout */}
      {mobileMenuOpen && (
        <div className="fixed top-[calc(4rem+36px)] left-0 right-0 md:hidden bg-white border-b border-border z-40 shadow-lg">
          <nav className="px-4 py-4 space-y-3">
            {/* Login / Logout */}
            {currentUser ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm uppercase"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm uppercase"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}

            <hr />

            {/* SHOP DROPDOWN */}
            <div>
              <div className="flex justify-between items-center">

                {/* 👉 Shop page link */}
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium uppercase tracking-wider"
                >
                  Shop
                </Link>

                {/* 👉 Dropdown arrow */}
                <button onClick={() => setShopOpen(!shopOpen)}>
                  <span className={`text-xs transition-transform ${shopOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
              </div>

              {/* 👉 Dropdown items */}
              {shopOpen && (
                <div className="mt-2 ml-3 flex flex-col space-y-2 text-sm">
                  <Link href="/shop/Denim-Jackets" onClick={() => setMobileMenuOpen(false)}>Denim Jackets</Link>
                  <Link href="/shop/Pullover" onClick={() => setMobileMenuOpen(false)}>Pullover</Link>
                  <Link href="/shop/Jeans" onClick={() => setMobileMenuOpen(false)}>Jeans</Link>
                  <Link href="/shop/T-Shirts" onClick={() => setMobileMenuOpen(false)}>T-Shirts</Link>
                  <Link href="/shop/Shirts" onClick={() => setMobileMenuOpen(false)}>Shirts</Link>
                </div>
              )}
            </div>

            {/* OTHER LINKS */}
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm uppercase">
              Home
            </Link>

            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-sm uppercase">
              Contact
            </Link>

            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-sm uppercase">
              About
            </Link>

            {currentUser && (
              <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="block text-sm uppercase">
                Orders
              </Link>
            )}
          </nav>
        </div>
      )}

    </>
  )
}

export default Header