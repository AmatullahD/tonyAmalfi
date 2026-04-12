// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { CartProvider } from "./providers"
import { AuthProvider } from "@/lib/auth-context"
import { FirebaseInitializer } from "@/components/firebase-initializer"
import TrackPageViews from "@/components/track-pageviews"
import Header from "@/components/Header"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Tony Amalfi - Premium Fashion",
  description: "Discover Tony Amalfi's latest collection of premium fashion items.",
  generator: "v0.app",
}

// set your GA id in .env.local as NEXT_PUBLIC_GA_ID
const GA_ID = "G-7WBQHCVZM8"
const isProd = process.env.NODE_ENV === "production"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* only load analytics in production by default; remove check if you want it in dev */}
        {isProd && (
          <>
            {/* Google tag (gtag.js) */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
              id="gtag-js"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <FirebaseInitializer />

            <div className="fixed top-0 left-0 w-full z-50 bg-white">
              <Header />
            </div>

            {/* client component that reports client-side navigations */}
            {isProd && <TrackPageViews gaId={GA_ID} />}
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
