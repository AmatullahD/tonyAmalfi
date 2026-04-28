"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Footer from "@/components/Footer"
import { getProductById, Product } from "@/lib/services/products"
import { useCart } from "@/app/providers"
import { Button } from "@/components/ui/button"
import ReviewSection from "@/src/components/ReviewSection";

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [hoveredSize, setHoveredSize] = useState<string | null>(null)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)

  // For swipe/pointer handling
  const [pointerStartX, setPointerStartX] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const fetchedProduct = await getProductById(productId)
        setProduct(fetchedProduct)

        if (fetchedProduct) {
          if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
            setSelectedColor(fetchedProduct.colors[0].name)
          }
          if (fetchedProduct.sizeDetails && fetchedProduct.sizeDetails.length > 0) {
            setSelectedSize(fetchedProduct.sizeDetails[0].size)
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  useEffect(() => {
    // focus modal for keyboard navigation when zoomed
    if (isZoomed && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isZoomed])

  // Get the available stock for selected size
  const getAvailableStock = () => {
    if (!product || !selectedSize) return 0
    const sizeDetail = product.sizeDetails.find(s => s.size === selectedSize)
    return sizeDetail?.quantity || 0
  }

  const handleAddToCart = () => {
    if (!product) return

    const availableStock = getAvailableStock()
    if (quantity > availableStock) {
      alert(`Only ${availableStock} units available for size ${selectedSize}`)
      return
    }

    addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      name: product.title,
      price: product.discountedPrice,
      color: selectedColor,
      size: selectedSize,
      quantity,
      image: product.images?.[0]
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  // Check if size is out of stock
  const isSizeOutOfStock = (size: string) => {
    const sizeDetail = product?.sizeDetails.find(s => s.size === size)
    return !sizeDetail || sizeDetail.quantity === 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">

        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg">Loading product...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const discount = Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)
  const mainImages = product.images.slice(0, 4)
  const additionalImages = product.images.slice(4)
  const availableStock = getAvailableStock()

  // navigation helpers
  const goNextImage = (e?: React.SyntheticEvent) => {
    e?.stopPropagation()
    setSelectedImage((prev) => (product.images.length ? (prev + 1) % product.images.length : prev))
  }
  const goPrevImage = (e?: React.SyntheticEvent) => {
    e?.stopPropagation()
    setSelectedImage((prev) => (product.images.length ? (prev - 1 + product.images.length) % product.images.length : prev))
  }

  // pointer / touch handlers for swiping
  const onPointerDown = (e: React.PointerEvent) => {
    // only handle primary button / touch
    if ((e as any).pointerType === 'mouse' && e.button !== 0) return
    setPointerStartX(e.clientX)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStartX === null) return
    const delta = e.clientX - pointerStartX
    const threshold = 50 // px
    if (delta > threshold) {
      goPrevImage()
    } else if (delta < -threshold) {
      goNextImage()
    }
    setPointerStartX(null)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goNextImage()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goPrevImage()
    } else if (e.key === 'Escape') {
      setIsZoomed(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">


      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {mainImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-[2/3] bg-gray-100 cursor-pointer overflow-hidden group relative"
                  onClick={() => {
                    setSelectedImage(index)
                    setIsZoomed(true)
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.title} - View ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">Click to zoom</span>
                  </div>
                </div>
              ))}
            </div>

            {additionalImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {additionalImages.map((image, index) => (
                  <div
                    key={index + 4}
                    className="aspect-square bg-gray-100 cursor-pointer overflow-hidden group relative"
                    onClick={() => {
                      setSelectedImage(index + 4)
                      setIsZoomed(true)
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - View ${index + 5}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <h1 className="text-xl lg:text-2xl font-semibold mb-3">{product.title}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-2">
              <p className="text-xl font-semibold">₹{product.discountedPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-500 line-through">
                MRP ₹{product.originalPrice.toFixed(2)}
              </p>
              <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                (₹{(product.originalPrice - product.discountedPrice).toFixed(0)} OFF)
              </span>
            </div>

            <p className="text-sm text-green-600 mb-6">inclusive of all taxes</p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium uppercase tracking-wider mb-3">
                  Color: {selectedColor}
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.name ? "border-black scale-110 ring-2 ring-offset-2 ring-black" : "border-gray-300"
                        }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection - FIXED tooltip positioning */}
            {product.sizeDetails && product.sizeDetails.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium uppercase tracking-wider">SELECT SIZE</label>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="text-sm text-red-600 underline font-medium hover:text-red-700"
                  >
                    SIZE CHART →
                  </button>
                </div>

                {/* Wrapper with relative positioning and overflow visible */}
                <div className="relative">
                  <div className="flex gap-2 flex-wrap">
                    {product.sizeDetails.map((sizeDetail, index) => {
                      const isOutOfStock = isSizeOutOfStock(sizeDetail.size)
                      const isFirstSize = index === 0

                      return (
                        <div key={sizeDetail.size} className="relative">
                          <button
                            onClick={() => !isOutOfStock && setSelectedSize(sizeDetail.size)}
                            onMouseEnter={() => setHoveredSize(sizeDetail.size)}
                            onMouseLeave={() => setHoveredSize(null)}
                            disabled={isOutOfStock}
                            className={`w-10 h-10 rounded-full border text-sm font-medium transition-all relative ${isOutOfStock
                              ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                              : selectedSize === sizeDetail.size
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-gray-500"
                              }`}
                          >
                            {sizeDetail.size}

                            {isOutOfStock && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-0.5 bg-gray-400 rotate-45"></div>
                              </div>
                            )}
                          </button>

                          {/* Tooltip */}
                          {hoveredSize === sizeDetail.size && !isOutOfStock && (
                            <div
                              className={`absolute z-10 top-full mt-2 bg-white border border-gray-200 shadow-lg rounded-md p-3 w-48 ${isFirstSize ? "left-0" : "left-1/2 -translate-x-1/2"
                                }`}
                              style={{
                                maxWidth: "calc(100vw - 2rem)",
                              }}
                            >
                              <p className="font-medium mb-2 text-center border-b pb-1 text-sm">
                                Size {sizeDetail.size}
                              </p>

                              <div className="space-y-1 text-xs">
                                {sizeDetail.measurements.map((measurement, idx) => (
                                  <div key={idx} className="flex justify-between">
                                    <span className="text-gray-600">
                                      {measurement.name}:
                                    </span>
                                    <span className="font-medium">
                                      {measurement.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Stock indicator for selected size */}
                {selectedSize && (
                  <div className="mt-3">
                    {availableStock > 0 ? (
                      <p className="text-sm text-gray-600">
                        Available
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-red-600">
                        Out of stock in size {selectedSize}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-xs font-medium uppercase tracking-wide block mb-2">
                Quantity
              </label>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 border border-gray-300 hover:bg-gray-100 transition-colors text-base rounded"
                >
                  −
                </button>

                <span className="text-base font-medium w-8 text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock}
                  className="w-9 h-9 border border-gray-300 hover:bg-gray-100 transition-colors text-base rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              variant="default"
              size="lg"
              className="w-full mb-4 text-lg py-6"
              disabled={availableStock === 0}
            >
              {addedToCart ? "✓ Added to Cart!" : availableStock === 0 ? "Out of Stock" : "ADD TO BAG"}
            </Button>

            {/* Product Details */}


            {/* Product Details */}
            <div className="border-t mt-8 pt-6 space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2 uppercase tracking-wider">
                  Description
                </h3>

                <p
                  className={`text-sm text-gray-700 leading-relaxed transition-all duration-200 ${showFullDesc ? "" : "line-clamp-3"
                    }`}
                >
                  {product.description}
                </p>

                {product.description?.length > 120 && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="text-sm text-black font-semibold mt-2 hover:underline"
                  >
                    {showFullDesc ? "READ LESS" : "READ MORE"}
                  </button>
                )}
              </div>

              {/* Only show Materials section if it exists and is not empty */}
              {product.materials && product.materials.trim() && (
                <div>
                  <h3 className="font-bold text-lg mb-2 uppercase tracking-wider">Materials</h3>
                  <p className="text-sm text-gray-700">{product.materials}</p>
                </div>
              )}

              {/* Only show Care Instructions section if it exists and is not empty */}
              {product.care && product.care.trim() && (
                <div>
                  <h3 className="font-bold text-lg mb-2 uppercase tracking-wider">Care Instructions</h3>
                  <p className="text-sm text-gray-700">{product.care}</p>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-2 uppercase tracking-wider">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-lg font-medium mb-6 uppercase text-center tracking-wide">
            Recommended for You
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {product.images.slice(0, 4).map((img, index) => (
              <div key={index} className="group cursor-pointer">

                <div className="overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={img}
                    alt="Recommended Product"
                    className="w-full h-[250px] md:h-[320px] object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-600">
                    ₹{product.discountedPrice}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>



        {/* ⭐ REVIEW SECTION */}
        <div className="mt-16">
          <ReviewSection />
        </div>

      </main>

      {/* Image Zoom Modal (swipable + keyboard nav + arrows) */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-0 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 text-black text-5xl hover:text-gray-700 w-12 h-12 flex items-center justify-center"
            onClick={() => setIsZoomed(false)}
          >
            ×
          </button>

          <div
            ref={modalRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            className="relative max-w-7xl max-h-full outline-none"
            // stop propagation inside so clicks on the image area don't close the modal
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left arrow */}


            {/* Image */}
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="max-w-full max-h-[90vh] object-contain touch-none select-none"
              draggable={false}
            />

            {/* Right arrow */}


            {/* Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(index) }}
                    className={`w-3 h-3 rounded-full transition-all ${selectedImage === index ? "bg-white w-8" : "bg-white/50"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && product.sizeDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSizeChart(false)}
        >
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Size Chart</h2>
              <button
                className="text-4xl hover:text-gray-600 w-10 h-10 flex items-center justify-center"
                onClick={() => setShowSizeChart(false)}
              >
                ×
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold">Size</th>

                    {product.sizeDetails[0]?.measurements.map((measurement) => (
                      <th key={measurement.name} className="border border-gray-300 px-4 py-3 text-left font-bold">
                        {measurement.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {product.sizeDetails.map((sizeDetail) => (
                    <tr key={sizeDetail.size} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-lg">{sizeDetail.size}</td>

                      {sizeDetail.measurements.map((measurement) => (
                        <td key={measurement.name} className="border border-gray-300 px-4 py-3">
                          {measurement.value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p className="font-semibold mb-2">How to measure:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All measurements are in inches</li>
                <li>For best results, measure over the clothing you plan to wear</li>
                <li>If between sizes, we recommend sizing up</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
