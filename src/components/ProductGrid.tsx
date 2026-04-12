"use client";

import React from "react";
import Image from "next/image";

const images: string[] = [
  "/collection-outerwear.jpg",
  "/collection-pants.jpg",
  "/collection-pants.jpg",
  "/collection-outerwear.jpg",
];


export default function ProductGrid() {
  return (
    <div className="w-full max-w-lg mx-auto p-2">

      {/* ✅ MOBILE VIEW */}
      <div className="grid grid-cols-2 gap-2 md:hidden">
        {images.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`product-${index}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* ✅ DESKTOP VIEW */}
      <div className="hidden md:grid grid-cols-2 gap-2">
        {images.map((img: string, index: number) => (
          <div
            key={index}
            className="relative aspect-square w-full overflow-hidden rounded-lg"
            >
            <Image
              src={img}
              alt={`product-${index}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

    </div>
  );
}

