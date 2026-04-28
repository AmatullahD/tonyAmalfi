"use client";

import React, { useEffect, useRef, useState } from "react";

const products = [
  {
    id: 1,
    name: "Classic Pullover",
    price: "₹1,299",
    category: "Pullover",
    image: "/collection-outerwear.jpg",
  },
  {
    id: 2,
    name: "Winter Hoodie",
    price: "₹1,499",
    category: "Hoodie",
    image: "/featured-collection.jpg",
  },
  {
    id: 3,
    name: "Oversized Sweatshirt",
    price: "₹1,799",
    category: "Sweatshirt",
    image: "/featured-outdoor.jpg",
  },
  {
    id: 4,
    name: "Street Style Pullover",
    price: "₹1,999",
    category: "Pullover",
    image: "/featured-trouser.jpg",
  },
];

export default function NewInSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const CARD_PER_VIEW = 2;

  // ✅ AUTOPLAY (clean, single source)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;

      const container = scrollRef.current;
      const cardWidth = container.offsetWidth / CARD_PER_VIEW;

      let next = activeIndex + 1;

      if (next > products.length - CARD_PER_VIEW) {
        next = 0;
      }

      setActiveIndex(next);

      container.scrollTo({
        left: next * cardWidth,
        behavior: "smooth",
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // ✅ SYNC DOT when user scrolls (important)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = container.offsetWidth / CARD_PER_VIEW;
      const index = Math.round(container.scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full py-8">
      {/* Heading */}
      <h2 className="text-center text-xl md:text-2xl font-semibold mb-5">
        New In
      </h2>

      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth px-4 gap-4 no-scrollbar"
      >
        {products.map((item) => (
          <div key={item.id} className="min-w-[50%] flex-shrink-0">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">

              {/* IMAGE */}
              <div className="w-full h-[260px]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* TEXT */}
              <div className="p-3">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.category}</p>
                <p className="text-sm font-semibold mt-1">
                  {item.price}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="flex justify-center mt-5 gap-2">
        {Array.from({
          length: products.length - (CARD_PER_VIEW - 1),
        }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (!scrollRef.current) return;

              const container = scrollRef.current;
              const cardWidth = container.offsetWidth / CARD_PER_VIEW;

              // ✅ instant jump on click
              container.scrollTo({
                left: i * cardWidth,
                behavior: "smooth",
              });

              setActiveIndex(i);
            }}
            className={`h-2 w-2 rounded-full transition-all duration-200 ${
              activeIndex === i ? "bg-black scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}