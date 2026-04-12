"use client"

import React, { useState, useEffect } from "react"
import type { FormEvent } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (!auth) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/")
      }
    })

    return () => unsubscribe()
  }, [router])

  const getErrorMessage = (errorCode: string | undefined) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email address format."
      case "auth/user-disabled":
        return "This account has been disabled."
      case "auth/user-not-found":
        return "No account found with this email."
      case "auth/wrong-password":
        return "Incorrect password."
      case "auth/invalid-credential":
        return "Invalid email or password."
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later."
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed. Please try again."
      case "auth/cancelled-popup-request":
        return "Sign-in was cancelled. Please try again."
      default:
        return "Failed to login. Please try again."
    }
  }

  const validateEmail = (emailToValidate: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(emailToValidate.trim().toLowerCase())
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (!auth) {
      setError("Authentication not initialized. Please try again later.")
      return
    }

    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Update last login timestamp
      if (userCredential.user && db) {
        try {
          await setDoc(doc(db, "users", userCredential.user.uid), {
            lastLogin: serverTimestamp(),
          }, { merge: true })
        } catch (updateError) {
          console.error("Error updating last login:", updateError)
        }
      }

      router.push("/")
    } catch (err: any) {
      const errorMessage = getErrorMessage(err?.code)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError("")

    if (!auth) {
      setError("Authentication not initialized. Please try again later.")
      return
    }

    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Create or update user document in Firestore
      if (user && db) {
        try {
          const userRef = doc(db, "users", user.uid)
          const userSnap = await getDoc(userRef)

          if (!userSnap.exists()) {
            // New user - create document
            const nameParts = user.displayName?.split(" ") || []
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              firstName: nameParts[0] || "",
              lastName: nameParts.slice(1).join(" ") || "",
              displayName: user.displayName || "",
              photoURL: user.photoURL || "",
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              role: "user",
              isActive: true,
              emailVerified: user.emailVerified,
            })
          } else {
            // Existing user - update last login
            await setDoc(userRef, {
              lastLogin: serverTimestamp(),
              emailVerified: user.emailVerified,
            }, { merge: true })
          }
        } catch (firestoreError) {
          console.error("Error updating user document:", firestoreError)
        }
      }

      router.push("/")
    } catch (err: any) {
      const errorMessage = getErrorMessage(err?.code)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>

            {/* Relative wrapper so we can position the eye icon */}
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                className="pr-10" // make space for the toggle button
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-2 flex items-center justify-center px-2"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-4"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}
