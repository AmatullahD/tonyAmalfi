// app/(pages)/returns/page.jsx
"use client"


import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col">
    

      <main className="flex-1">
        {/* Header */}
        <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            We aim to make returns and exchanges clear and fair. Please read the rules below carefully — they are applied as stated.
          </p>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
          <div className="max-w-3xl space-y-10">
            {/* Return Policy */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">Return Policy</h2>
              <ul className="space-y-2 text-foreground/80">
                <li>• Returns are accepted <strong>only</strong> for defective, damaged or incorrect products.</li>
                <li>• Return requests must be raised within <strong>24 hours</strong> of delivery.</li>
                <li>• Items must be in their original condition with all tags intact and original packaging.</li>
                <li>• Products that are visibly used, worn, or returned in poor condition will not be accepted and will not qualify for a refund.</li>
              </ul>
            </div>

            {/* Refunds */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">Refunds</h2>
              <ul className="space-y-2 text-foreground/80">
                <li>• Approved returns will be refunded.</li>
                <li>• In rare situations (lost in transit, wrong/damaged product) refunds to the original payment method may take <strong>7–14 days</strong> to reflect, depending on the bank/payment provider.</li>
                <li>• For prepaid order cancellations, refunds are typically processed within <strong>24–48 hours</strong>.</li>
              </ul>
            </div>

            {/* Exchanges */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">Exchange Policy (Size Only)</h2>
              <ul className="space-y-2 text-foreground/80">
                <li>• We offer exchanges for <strong>size only</strong>. No returns for cash refunds are applicable under this exchange policy.</li>
                <li>• Exchange requests must be raised within <strong>48 hours</strong> from delivery.</li>
                <li>• You must upload clear photos of the product with tags visible for authenticity checks when creating the exchange request.</li>
                <li>• Once your exchange/return query is accepted by our team, a notification will be sent to your registered email.</li>
                <li>• Approved exchange item pickups will be attempted within <strong>24–48 hours</strong> from the date of the request.</li>
                <li>• Keep the product unused and in its original packaging with all tags intact until pickup.</li>
                <li>• An exchange fee of <strong>₹250</strong> applies (covers reverse pickup + delivery) — except when you are required to ship the product yourself (see below).</li>
                <li>• The exchange process may take approximately <strong>6–7 working days</strong>.</li>
                <li>• The requested replacement product will be dispatched only after the reverse pickup is completed and accepted.</li>
                <li>• If your area is non-serviceable for reverse pickup, you must ship the product to us yourself — in that case the ₹250 exchange fee will <strong>not</strong> be charged.</li>
                <li>• Exchange is allowed only one time per order.</li>
                <li>• Exchanges are subject to stock availability. If the requested size is unavailable, we will inform you and advise next steps.</li>
                <li>• Estimated delivery for completed exchange queries typically falls between <strong>7–10 working days</strong>.</li>
                <li>• Products bought during sales or special promotions <strong>cannot</strong> be exchanged.</li>
              </ul>
            </div>

            {/* Important Notes */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">Important Notes</h2>
              <ul className="space-y-2 text-foreground/80">
                <li>• We are not responsible for delays caused by courier companies or unforeseen events (weather, strikes, force majeure).</li>
                <li>• Products returned in used, damaged, or tagless condition will not be accepted.</li>
                <li>• Please double-check your size before placing the order to avoid unnecessary exchanges.</li>
                <li>• Delivery timelines may vary due to courier delays, weather conditions, or factors beyond our control.</li>
              </ul>
            </div>

            <div>
              <p className="text-foreground/80 mb-4">
                For assistance with returns or exchanges, contact our customer service at <strong>contact@tonyamalfi.com</strong>.
              </p>
              <Button variant="default">Contact Customer Service</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
