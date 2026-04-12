// app/(pages)/shipping/page.jsx
"use client"

import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-6">Shipping, Order Cancellation & Refunds</h1>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="font-semibold">
              BY AGREEING TO USE THE TONY AMALFI EXCHANGES PORTAL AND/OR INITIATING A REQUEST FOR PURCHASE OF PRODUCT(S) ON THE PORTAL, YOU AGREE TO BE BOUND BY THE TERMS CONTAINED IN THIS POLICY. IF YOU DO NOT AGREE TO THESE TERMS, PLEASE DO NOT TRANSACT ON TONYAMALFI.COM.
            </p>

            <h2 className="text-2xl font-bold">Order Cancellation Policy</h2>
            <ul>
              <li>• Orders can only be cancelled before they are processed and dispatched.</li>
              <li>• Once an order is processed and shipped, it cannot be cancelled.</li>
              <li>• If you wish to make changes to your order (size, product, address, etc.), you must contact us within <strong>2 hours</strong> of placing your order.</li>
              <li>• Cancellation requests after shipping will not be accepted.</li>
              <li>• For prepaid order cancellations, refunds will be issued within <strong>24–48 hours</strong>.</li>
            </ul>

            <h2 className="text-2xl font-bold">Shipping</h2>
            <p>
              We offer standard shipping. Orders are typically processed within 1–2 business days. Delivery times vary by location and courier performance.
            </p>
            <p className="text-sm text-muted-foreground">
              Note: We are not responsible for delays caused by courier companies or unforeseen events.
            </p>

            <h2 className="text-2xl font-bold">Returns & Refunds (summary)</h2>
            <p>Returns are accepted only for defective, damaged, or incorrect products and must be requested within <strong>24 hours</strong> of delivery.</p>
            <p>Approved returns are refunded. In rare cases (lost in transit, wrong/damaged product), refunds to the original payment method may take <strong>7–14 days</strong> to complete depending on the payment provider and bank.</p>

            <p className="text-sm">
              Items must be in their original condition with intact tags. Products that are visibly used, worn, or returned in poor condition will not qualify for a refund.
            </p>

            <p className="mt-4 text-foreground/80">
              For any questions related to cancellations, shipping or refunds please contact: <strong>contact@tonyamalfi.com</strong>
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
