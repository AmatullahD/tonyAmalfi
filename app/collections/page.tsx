"use client"

import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"

export default function CollectionsPage() {
  const collections = [
    {
      id: "dpm-bonsai",
      title: "DPM: Bonsai Tigerstripe",
      description:
        "A limited edition collection featuring our signature DPM pattern in exclusive tigerstripe colorway.",
      image: "/featured-collection.jpg",
      items: 12,
    },
    {
      id: "technical-outdoor",
      title: "Technical Outdoor",
      description: "Purpose-built gear for urban exploration and outdoor adventures. Water-resistant and durable.",
      image: "/outdoor-collection.jpg",
      items: 18,
    },
    {
      id: "urban-essentials",
      title: "Urban Essentials",
      description:
        "Timeless pieces designed for everyday wear. Quality basics that form the foundation of any wardrobe.",
      image: "/urban-essentials.jpg",
      items: 24,
    },
    {
      id: "seasonal-limited",
      title: "Seasonal Limited Edition",
      description: "Exclusive pieces released seasonally. Limited quantities available while stocks last.",
      image: "/limited-edition-stamp.png",
      items: 8,
    },
    {
      id: "collaborations",
      title: "Collaborations",
      description: "Special collections created in partnership with renowned designers and brands.",
      image: "/collaborative-brainstorm.png",
      items: 15,
    },
    {
      id: "archive",
      title: "Archive Collection",
      description: "Curated pieces from our archives. Vintage and classic items with historical significance.",
      image: "/digital-archive.png",
      items: 32,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Collections Header */}
        <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4">Collections</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our curated collections, each telling a unique story and representing different aspects of Tony
            Amalfi's design philosophy.
          </p>
        </section>

        {/* Collections Grid */}
        <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div key={collection.id} className="group">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <img
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-base group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-base flex items-end justify-start p-6">
                    <div>
                      <p className="text-white text-sm font-medium">{collection.items} Items</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-heading font-bold mb-2 uppercase tracking-wider">{collection.title}</h3>
                <p className="text-sm text-foreground/80 mb-4">{collection.description}</p>
                <Button variant="outline" className="w-full bg-transparent">
                  Explore Collection
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
