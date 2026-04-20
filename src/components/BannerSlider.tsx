"use client"

import { useState, useEffect } from "react"

const banners = [
  "/banner2-img1.jpg",
  "/banner2-img2.jpg",
  "/banner2-img3.jpg",
]

export default function BannerSlider() {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <div className="w-full mt-10 px-4">
      <div
        className="relative w-full aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/6] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        {banners.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="banner"
            className={`absolute w-full h-full object-cover sm:object-cover transition-opacity duration-700 ${current === index ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}


        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 w-2 rounded-full cursor-pointer ${current === index ? "bg-white w-4" : "bg-white/50"
                } transition-all`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}