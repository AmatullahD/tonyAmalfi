"use client"

import React, { useState } from "react"
import type { FormEvent } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const validateEmail = (emailToValidate: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(emailToValidate.trim().toLowerCase())
  }

  const getErrorMessage = (errorCode: string | undefined) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email address format."
      case "auth/user-not-found":
        return "No account found with this email address."
      case "auth/too-many-requests":
        return "Too many requests. Please try again later."
      case "auth/network-request-failed":
        return "Network error. Please check your connection."
      default:
        return "Failed to send reset email. Please try again."
    }
  }

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    if (!auth) {
      setError("Authentication not initialized. Please try again later.")
      return
    }

    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase())
      setSuccess(true)
      setEmail("")
    } catch (err: any) {
      const errorMessage = getErrorMessage(err?.code)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Reset Password</h1>
          <p className="text-sm text-gray-600 text-center mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm">
            Password reset email sent! Check your inbox and follow the instructions to reset
            your password.
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link href="/auth/login" className="text-sm text-blue-600 hover:underline block">
            Back to Login
          </Link>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}