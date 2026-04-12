"use client"

import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4">Sustainability</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            At Tony Amalfi, we're committed to creating fashion that respects both people and the planet.
          </p>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
          <div className="max-w-3xl">
            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Our Commitment</h2>
              <p className="text-foreground/80 mb-4">
                Sustainability is not just a buzzword for us—it's a core principle that guides every decision we make.
                From material sourcing to manufacturing processes, we prioritize environmental responsibility and
                ethical practices.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Responsible Materials</h2>
              <p className="text-foreground/80 mb-4">
                We carefully select materials that minimize environmental impact. Our suppliers are vetted for their
                commitment to sustainable practices, and we continuously explore innovative alternatives to traditional
                fabrics.
              </p>
              <ul className="space-y-2 text-foreground/80">
                <li>• Organic cotton and recycled fibers</li>
                <li>• Water-resistant coatings without harmful chemicals</li>
                <li>• Deadstock and surplus fabric utilization</li>
                <li>• Partnerships with certified sustainable suppliers</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Ethical Manufacturing</h2>
              <p className="text-foreground/80 mb-4">
                Our manufacturing partners maintain fair labor practices and safe working conditions. We conduct regular
                audits and maintain transparent relationships with all production facilities.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Carbon Neutral Shipping</h2>
              <p className="text-foreground/80 mb-4">
                We offset the carbon footprint of all shipments through verified environmental projects. Every order
                contributes to reforestation and renewable energy initiatives.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Durability & Longevity</h2>
              <p className="text-foreground/80 mb-4">
                The most sustainable garment is one that lasts. We design for durability and timelessness, creating
                pieces that transcend seasonal trends and remain relevant for years.
              </p>
            </div>

            <Button variant="default">Learn More About Our Practices</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
