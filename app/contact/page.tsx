"use client"

import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Linkedin } from "lucide-react"
import Footer from "@/components/Footer"

export default function ContactPage() {
  return (
    <>
      <main className="container mx-auto px-4 py-14">

        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 md:p-8 border border-gray-100">

          {/* Main Heading */}
          <h1 className="text-xl md:text-2xl font-semibold uppercase tracking-wide mb-2 text-gray-900">
            Contact Us
          </h1>

          {/* Subheading */}
          <p className="text-md text-gray-500 mb-8">
           For queries and assistance, feel free to reach out to our -
          </p>

          <div className="space-y-6">

            {/* WhatsApp */}
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 mt-1 text-green-600" />
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                  Quick Support (WhatsApp)
                </h2>
                <a
                  href="https://wa.me/911234567890"
                  target="_blank"
                  className="text-md text-gray-600 hover:text-black hover:underline"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Call */}
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 mt-1 text-gray-700" />
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                  Call Us At
                </h2>
                <a
                  href="tel:+911234567890"
                  className="text-md text-gray-600 hover:text-black hover:underline"
                >
                  +91 12345 67890
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 mt-1 text-gray-700" />
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                  Email Us
                </h2>
                <a
                  href="mailto:customercare@gmail.com"
                  className="text-md text-gray-600 hover:text-black hover:underline"
                >
                  customercare@gmail.com
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-1 text-gray-700" />
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                  Address
                </h2>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  className="text-md text-gray-600 hover:text-black hover:underline"
                >
                  Your Full Address Here
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-start gap-3">
              <Instagram className="w-5 h-5 mt-1 text-gray-700" />
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800 mb-1">
                  Reach Us At
                </h2>

                <div className="flex gap-6 text-md text-gray-600 whitespace-nowrap">
                  <a href="#" className="hover:text-black hover:underline flex items-center gap-1">
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                  <a href="#" className="hover:text-black hover:underline flex items-center gap-1">
                    <Facebook className="w-4 h-4" /> Facebook
                  </a>
                  <a href="#" className="hover:text-black hover:underline flex items-center gap-1">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>


      <Footer />
    </>
  )
}