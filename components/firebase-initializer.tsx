"use client"

import { useEffect } from "react"
import { initializeFirebaseCollections } from "@/lib/firebase-init"

/**
 * Client component that initializes Firebase collections on app load
 * This runs once when the app first loads
 */
export function FirebaseInitializer() {
  useEffect(() => {
    initializeFirebaseCollections()
  }, [])

  return null
}
