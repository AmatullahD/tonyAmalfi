
"use client"

import Link from "next/link"
import { useState } from "react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  hoverImage?: string
}

export const ProductCard = ({ id, name, price, originalPrice, image, hoverImage }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Safety check for price
  const displayPrice = price || 0
  const displayOriginalPrice = originalPrice || 0
  
  const discount = displayOriginalPrice && displayOriginalPrice > displayPrice 
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : 0

  return (
    <Link
      href={`/products/${id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[3/4] bg-secondary mb-4 overflow-hidden">
        <img
          src={isHovered && hoverImage ? hoverImage : image}
          alt={name}
          className="w-full h-full object-cover transition-base group-hover:scale-105"
        />
      </div>
      <div className="text-center">
        <h3 className="font-medium text-sm mb-2">{name}</h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <p className="text-base font-semibold">₹{displayPrice.toFixed(2)}</p>
          {displayOriginalPrice && displayOriginalPrice > displayPrice && (
            <>
              <p className="text-sm text-muted-foreground line-through">₹{displayOriginalPrice.toFixed(2)}</p>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                ₹{displayOriginalPrice - displayPrice} OFF
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}