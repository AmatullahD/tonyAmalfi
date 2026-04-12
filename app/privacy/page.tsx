"use client"

import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none space-y-4">
            <h2 className="text-2xl font-bold">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, make a purchase, or
              contact us for support.
            </p>

            <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, process transactions,
              and send you related information.
            </p>

            <h2 className="text-2xl font-bold">3. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
