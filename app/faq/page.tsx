// app/(pages)/faq/page.jsx
"use client"

import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "What is your cancellation window after placing an order?",
      answer:
        "Orders can be cancelled only before they are processed and dispatched. To change or cancel an order (size, product, address, etc.) you must contact us within 2 hours of placing the order. Cancellation requests after the order has been processed or shipped will not be accepted.",
    },
    {
      question: "When can I request a return?",
      answer:
        "Returns are accepted only for defective, damaged, or incorrect products and must be requested within 24 hours of delivery. Items must be unused and in original condition with tags intact.",
    },
    {
      question: "How long does a refund take?",
      answer:
        "Approved returns are refunded. In rare cases (lost in transit, wrong/damaged product) refunds to the original payment method may take 7–14 days depending on the bank/payment provider. Prepaid cancellations are typically refunded within 24–48 hours.",
    },
    {
      question: "Can I exchange an item?",
      answer:
        "Yes — exchanges are offered for size only. Exchange requests must be raised within 48 hours of delivery. An exchange fee of ₹250 applies to cover reverse pickup + delivery (except when you must self-ship because your area is non-serviceable). Exchanges are subject to stock availability and allowed only once per order.",
    },
    {
      question: "What documents or photos do I need to raise an exchange/return?",
      answer:
        "You must upload clear photos of the product showing tags for authenticity checks when you raise an exchange/return request. Once the team accepts the query, you will receive a notification on your registered email.",
    },
    {
      question: "How long does the exchange process take?",
      answer:
        "Approved exchange pickups will be attempted within 24–48 hours from request, and the full exchange process generally takes about 6–7 working days. Estimated delivery of exchange queries normally falls between 7–10 working days.",
    },
    {
      question: "Are sale items eligible for exchange?",
      answer: "Products bought during sales or special promotions cannot be exchanged.",
    },
    {
      question: "What if my area is non-serviceable for reverse pickup?",
      answer:
        "If your area is non-serviceable for reverse pickup, you must ship the product to us yourself. In such cases the ₹250 exchange fee will not be charged, but you will be responsible for shipping the item to our returns address.",
    },
    {
      question: "Who can I contact for support?",
      answer: "For support regarding cancellations, returns, refunds or exchanges, email contact@tonyamalfi.com.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
