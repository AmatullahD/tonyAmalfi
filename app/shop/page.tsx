"use client"

import { useEffect, useState } from "react"
import Footer from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"
import { getProducts, Product } from "@/lib/services/products"

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        console.log("Fetching products...")
        const fetchedProducts = await getProducts()
        console.log("Fetched products:", fetchedProducts)
        console.log("First product:", fetchedProducts[0])
        setProducts(fetchedProducts)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
     

      <main className="flex-1">
        {/* Shop Header */}
        <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4">Shop</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our complete collection of technical apparel and accessories designed for modern urban exploration.
          </p>
        </section>

        {/* Products Grid */}
        <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id!}
                  name={product.title}
                  price={product.discountedPrice}
                  originalPrice={product.originalPrice}
                  image={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                  hoverImage={product.images && product.images.length > 1 ? product.images[1] : undefined}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}