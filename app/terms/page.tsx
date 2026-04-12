"use client"

import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <div className="prose prose-lg max-w-none space-y-4">
            <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this
              agreement.
            </p>

            <h2 className="text-2xl font-bold">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on Tony
              Amalfi's website for personal, non-commercial transitory viewing only.
            </p>

            <h2 className="text-2xl font-bold">3. Disclaimer</h2>
            <p>
              The materials on Tony Amalfi's website are provided on an 'as is' basis. Tony Amalfi makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
