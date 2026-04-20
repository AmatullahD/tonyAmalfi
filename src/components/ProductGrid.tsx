"use client";

import React from "react";
import Image from "next/image";

const categories = [
  { image: "/collection-outerwear.jpg", name: "Outerwear" },
  { image: "/collection-pants.jpg", name: "Pants" },
  { image: "/collection-pants.jpg", name: "Jeans" },
  { image: "/collection-outerwear.jpg", name: "Jackets" },
];


export default function ProductGrid() {
  return (
    <div className="w-full max-w-sm mx-auto p-2">

      {/* ✅ MOBILE VIEW */}
      <div className="grid grid-cols-2 gap-1 md:hidden">
        {categories.map((item, index) => (
          <div key={index} className="flex flex-col">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />

            {/* Category Name */}
            <p className="text-xs text-center mt-1 font-medium">
              {item.name}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ DESKTOP VIEW */}
      <div className="hidden md:grid grid-cols-2 gap-1">
        {categories.map((item, index) => (
          <div key={index} className="flex flex-col">

            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Category Name */}
            <p className="text-sm text-center mt-2 font-medium">
              {item.name}
            </p>

          </div>
        ))}
      </div>

    </div>
  );
}

