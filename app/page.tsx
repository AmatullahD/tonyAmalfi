"use client"

import { useEffect, useState, useRef } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button"
import { getProducts, Product } from "@/lib/services/products"
import Link from "next/link"
import ProductGrid from "@/src/components/ProductGrid";
import BannerSlider from "@/src/components/BannerSlider";
import NewInSection from "@/src/components/NewInSection";

const journalBanners = [
  { id: 1, image: "/journal-1.jpg" },
  { id: 2, image: "/journal-2.jpg" },
  { id: 3, image: "/journal-3.jpg" },
  { id: 4, image: "/journal-4.jpg" },
];

const banners = [
  {
    id: 1,
    image: "/hero-banner-1.jpg",
    title: "TRENDING T-SHIRTS",
    subtitle: "EXPLORE THE COLLECTION",
    href: "/shop",
  },
  {
    id: 2,
    image: "/hero-banner-2.jpg",
    title: "TIMELESS POLOS",
    subtitle: "EXPLORE THE COLLECTION",
    href: "/shop",
  },
  {
    id: 3,
    image: "/hero-banner-3.jpg",
    title: "EVERYDAY BOTTOMWEAR",
    subtitle: "EXPLORE THE COLLECTION",
    href: "/shop",
  },
];


export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [activeBanner, setActiveBanner] = useState(0);
  const [isHoveringBanner, setIsHoveringBanner] = useState(false);
  const [isHoveringJournal, setIsHoveringJournal] = useState(false);




  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        setLoading(true)
        const products = await getProducts()

        // Sort by createdAt (newest first) and take only 3
        const sortedProducts = products.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })

        setNewArrivals(sortedProducts.slice(0, 3))
      } catch (error) {
        console.error("Error fetching new arrivals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewArrivals()
  }, [])

  useEffect(() => {
    if (isHoveringJournal) return; // ⛔ stop when hovering

    const interval = setInterval(() => {
      if (!sliderRef.current) return;

      const container = sliderRef.current;
      const width = container.offsetWidth;

      let next = activeSlide + 1;
      if (next >= journalBanners.length) next = 0;

      setActiveSlide(next);

      container.scrollTo({
        left: next * width,
        behavior: "smooth",
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [activeSlide, isHoveringJournal]);

  useEffect(() => {
    if (isHoveringBanner) return; // ⛔ stop when hovering

    const interval = setInterval(() => {
      if (!bannerRef.current) return;

      const container = bannerRef.current;
      const width = container.offsetWidth;

      let next = activeBanner + 1;
      if (next >= banners.length) next = 0;

      setActiveBanner(next);

      container.scrollTo({
        left: next * width,
        behavior: "smooth",
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeBanner, isHoveringBanner]);



  const journalArticles = [
    {
      id: "golden-spines-bomber",
      title: "GOLDEN SPINES BOMBER",
      excerpt:
        "A bold black denim bomber featuring gold ray-like spines and a structured baggy fit, blending luxury aesthetics with streetwear edge.",
      image: "/journal-1.jpg",
    },
    {
      id: "blue-pullover",
      title: "BLUE PULLOVER",
      excerpt:
        "A clean sky-tone half-zip sweatshirt crafted for minimal street style and everyday comfort, perfect for effortless layering.",
      image: "/journal-2.jpg",
    },
    {
      id: "white-pullover",
      title: "WHITE PULLOVER",
      excerpt:
        "A crisp and versatile white pullover with a relaxed silhouette, ribbed detailing, and clean minimal design for everyday wear.",
      image: "/journal-3.jpg",
    },
    {
      id: "tiger-crest-bomber",
      title: "TIGER CREST BOMBER",
      excerpt:
        "A light blue denim bomber featuring a bold crest-style embroidered tiger and palm motif, balancing street attitude with artisanal detail.",
      image: "/journal-4.jpg",
    },
  ];


  return (
    <div className="min-h-screen flex flex-col">

      <br></br>
      {/* Hero Section - Split Layout */}
      <section className="w-full bg-[#ffffff] overflow-hidden">
        <div className="relative">
          {/* SLIDER TRACK */}
          <div
            ref={bannerRef}
            className="flex overflow-hidden"
            onMouseEnter={() => setIsHoveringBanner(true)}
            onMouseLeave={() => setIsHoveringBanner(false)}
          >
            {banners.map((item) => (
              <div key={item.id} className="min-w-full flex-shrink-0">
                <div className="flex flex-col md:flex-row items-center min-h-[340px] md:min-h-[420px]">

                  {/* LEFT: Text */}
                  <div className="flex flex-col items-start justify-center px-8 md:px-16 py-10 md:py-0 md:w-[38%] flex-shrink-0 z-10">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-black leading-tight mb-3 uppercase">
                      {item.title}
                    </h1>
                    <Link href={item.href}>
                      <span className="text-sm md:text-base font-semibold tracking-widest text-black uppercase border-b-2 border-black pb-0.5 hover:opacity-70 transition-opacity cursor-pointer">
                        {item.subtitle}
                      </span>
                    </Link>
                  </div>

                  {/* RIGHT: Image */}
                  <div className="md:w-[62%] w-full h-[260px] md:h-[420px] flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain object-center"
                    />
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* LEFT ARROW */}
          <button
            onClick={() => {
              const prev = activeBanner === 0 ? banners.length - 1 : activeBanner - 1;
              setActiveBanner(prev);
              if (bannerRef.current) {
                bannerRef.current.scrollTo({ left: prev * bannerRef.current.offsetWidth, behavior: "smooth" });
              }
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shadow-md transition"
            aria-label="Previous"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={() => {
              const next = activeBanner === banners.length - 1 ? 0 : activeBanner + 1;
              setActiveBanner(next);
              if (bannerRef.current) {
                bannerRef.current.scrollTo({ left: next * bannerRef.current.offsetWidth, behavior: "smooth" });
              }
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shadow-md transition"
            aria-label="Next"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {/* DOTS */}
        <div className="flex justify-center py-3 gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveBanner(i);
                if (bannerRef.current) {
                  bannerRef.current.scrollTo({ left: i * bannerRef.current.offsetWidth, behavior: "smooth" });
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${activeBanner === i ? "w-6 bg-black" : "w-2 bg-gray-300"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>




      {/* {Product Grid} */}
      <ProductGrid />

      {/* ===== 3rd SECTION BANNER ===== */}

      <BannerSlider />

      {/* New In Section */}
      <NewInSection />



      <section className="flex flex-col md:flex-row md:justify-center md:items-stretch gap-4 md:gap-0 w-full overflow-hidden">

        {/* Collection Section */}
        <div className="relative w-full md:w-[640px] h-[300px] md:h-[700px] overflow-hidden group">
          <img
            src="/featured-collection.jpg"
            alt="DPM: Bonsai Tigerstripe Collection"
            className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-12 z-10">

            <h3 className="text-white text-lg md:text-xl font-[500] tracking-[4px] font-poppins mb-3 uppercase">
              TIGER CREST BOMBER
            </h3>

            <Link href="/shop">
              <Button
                variant="default"
                size="lg"
                className="px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-semibold bg-black text-white"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Video Section */}
        <div className="relative w-full md:w-[640px] h-[300px] md:h-[700px] overflow-hidden group">
          <video
            src="/video-2.mp4"
            poster="/featured-trouser.jpg"
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            playsInline
            autoPlay
            muted
            loop />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-12 z-10">
            {/* Add title here if needed… */}
          </div>
        </div>

        {/* Golden Spines Section */}
        <div className="relative w-full md:w-[640px] h-[300px] md:h-[700px] overflow-hidden group">
          <img
            src="/featured-outdoor.jpg"
            alt="Tony Amalfi Outdoor Collection"
            className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-12 z-10">

            <h3 className="text-white text-lg md:text-xl font-[500] tracking-[4px] font-poppins mb-3 uppercase">
              GOLDEN SPINES BOMBER
            </h3>

            <Link href="/shop">
              <Button
                variant="default"
                size="lg"
                className="px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-semibold bg-black text-white"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>

      </section>

      {/* Journal Section */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold">JOURNAL</h2>
          <Button variant="link" className="text-foreground hover:text-foreground/80 text-base">
            VIEW ALL
          </Button>
        </div>

        <div className="flex flex-col items-center">

          {/* SLIDER */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory w-[280px] md:w-[340px] no-scrollbar"
            onMouseEnter={() => setIsHoveringJournal(true)}
            onMouseLeave={() => setIsHoveringJournal(false)}
          >
            {journalBanners.map((item) => (
              <div key={item.id} className="min-w-full flex-shrink-0 snap-start">
                <div className="relative rounded-xl overflow-hidden shadow-md">

                  {/* IMAGE */}
                  <div className="h-[380px] md:h-[460px]">
                    <img
                      src={item.image}
                      alt="journal"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* TEXT OVERLAY */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h2 className="text-2xl font-bold tracking-widest">
                      TONY AMALFI
                    </h2>
                    <p className="text-xs mt-1">
                      THE NEW COLLECTION
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* DOTS */}
          <div className="flex justify-center mt-4 gap-2">
            {journalBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!sliderRef.current) return;

                  const slider = sliderRef.current;
                  const width = slider.offsetWidth;

                  // 👉 force scroll to clicked slide
                  slider.scrollTo({
                    left: i * width,
                    behavior: "smooth",
                  });

                  // 👉 update active dot
                  setActiveSlide(i);
                }}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${activeSlide === i ? "bg-black scale-110" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>

        </div>
      </section>


      <Footer />


    </div>
  )
}