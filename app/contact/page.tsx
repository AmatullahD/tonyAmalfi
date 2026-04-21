"use client"

import React, { useState } from "react"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons"
import { faPhone } from "@fortawesome/free-solid-svg-icons"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult("")

    try {
      const fd = new FormData()
      fd.append("name", formData.name)
      fd.append("email", formData.email)
      fd.append("phone", formData.phone)
      fd.append("message", formData.message)
      // web3forms access key (from your example)
      fd.append("access_key", "eace1f8d-e0e4-48d7-88f5-de21c672d00d")

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd,
      })

      const data = await res.json()

      if (data.success) {
        setResult("Success! Thank you — we received your message.")
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        setResult("Error sending message. Please try again later.")
      }
    } catch (err) {
      console.error(err)
      setResult("Error sending message. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Contacts
  const whatsappLink = "https://wa.me/+919119440992"
  const instagramLink = "http://instagram.com/tony.amalfi/"
  const phoneHref = "tel:+919119440992"

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea name="message" value={formData.message} onChange={handleChange} rows={6} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>

            <div className="text-center my-2">
             <span className="text-gray-500 font-semibold">OR</span>
            </div>

            {result && <p className="mt-3 text-sm">{result}</p>}
          </form>

          <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:shadow-sm">
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>

              <a href={instagramLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:shadow-sm">
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
                <span>Instagram</span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faPhone} className="w-5 h-5" />
              <a href={phoneHref} className="underline">+919119440992</a>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
