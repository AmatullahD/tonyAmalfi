import React from "react"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
     

      <main className="flex-1 container mx-auto px-4 py-16">
        <Card className="max-w-5xl mx-auto p-8 md:p-12 rounded-2xl shadow-lg">
          {/* Hero */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
            <div className="flex-1">
              

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                About
              </h1>
              <p className="text-lg text-gray-600">
                Wear your spotlight — live fierce, feel radiant.
              </p>
            </div>

            {/* Optional hero image — replace src with your art */}
          
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-gray-700 text-base leading-7 text-justify">
                Tony Amalfi is contemporary fashion where style meets freedom. We design for people who want to be
                seen, felt, and remembered — clothes that amplify the wearer’s aura, ambition, and direction.
                Our pieces blend technical innovation with a bold sensibility so you always step out with confidence
                and edge.
              </p>

              <p className="text-gray-700 text-base leading-7 text-justify">
                Inspired by a dual spirit — the tiger’s fearless momentum and the sun’s warm radiance — Tony Amalfi
                invites you to <strong>live like a tiger, feel like the sun</strong>. Move through your day with
                courage and warmth: unapologetic, luminous, and alive. "Wear your spotlight" is not just a tagline;
                it’s an invitation to own your presence.
              </p>

              <p className="text-gray-700 text-base leading-7 text-justify">
                From streetwear to elevated tailoring, each piece is crafted to highlight individuality. Whether you’re
                composing a quiet, minimal look or stacking bold layers, our garments are made to be mixed, adapted,
                and lived in. We prioritize quality materials and considered construction so what you wear keeps
                performing as you move and grow.
              </p>

              <blockquote className="border-l-4 pl-4 italic text-gray-600">
                "Join us and unlock your potential — fierce and luminous. Live fierce. Feel radiant. Wear your
                spotlight."
              </blockquote>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-white shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">Our Philosophy</h3>
                <p className="text-sm text-gray-700 text-justify">
                  Celebrate self-expression over rules. Champion strength with warmth. Combine craft with
                  contemporary function — Tony Amalfi exists at the intersection of culture, history, and the present
                  moment.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">What We Value</h3>
                <ul className="mt-2 space-y-3 text-sm text-gray-700">
                  <li>
                    <strong>Confidence:</strong> Clothes that help you stand tall.
                  </li>
                  <li>
                    <strong>Individuality:</strong> Designs meant to be interpreted your way.
                  </li>
                  <li>
                    <strong>Craft:</strong> Attention to technical details and quality construction.
                  </li>
                  <li>
                    <strong>Radiance:</strong> Style that energizes both wearer and room.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-white shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">How We Work</h3>
                <p className="text-sm text-gray-700 text-justify">
                  Our design process pairs intentional silhouettes with practical finishes. Collections are created
                  to be versatile — mixable across seasons and wardrobes — so pieces remain meaningful as your life
                  evolves.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md font-medium shadow-sm hover:opacity-95"
            >
              Shop the Collection
            </Link>
          </div>
        </Card>
      </main>

    <Footer />
    </div>
  )
}
