// lib/admin-auth.ts
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

/**
 * Check if a user has admin role
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!db) {
    console.error("Database not initialized")
    return false
  }
  
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    const userData = userDoc.data()
    
    // User must exist and have role === "admin"
    return userDoc.exists() && userData?.role === "admin"
  } catch (error) {
    console.error("Error checking admin role:", error)
    return false
  }
}

/**
 * Login admin user with email and password
 */
export async function loginAdmin(email: string, password: string): Promise<void> {
  if (!auth) {
    throw new Error("Authentication not initialized")
  }
  
  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Verify user has admin role
    const isAdmin = await checkIsAdmin(userCredential.user.uid)
    
    if (!isAdmin) {
      // If not admin, sign them out immediately
      await signOut(auth)
      throw new Error("Unauthorized: Admin access required")
    }
    
    console.log("Admin logged in successfully")
  } catch (error: any) {
    console.error("Login error:", error)
    throw new Error(error.message || "Login failed")
  }
}

/**
 * Logout admin user
 */
export async function logoutAdmin(): Promise<void> {
  if (!auth) {
    console.error("Authentication not initialized")
    return
  }
  
  try {
    await signOut(auth)
    console.log("Admin logged out successfully")
  } catch (error) {
    console.error("Logout error:", error)
  }
}

/**
 * Get current admin session
 * Returns the current logged-in user if they're an admin
 */
export async function getAdminSession(): Promise<{ uid: string; email: string } | null> {
  // capture auth into a local const so TS can narrow it
  const a = auth
  if (!a) return null

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(a, async (user) => {
      // immediately unsubscribe to avoid leftover listeners
      unsubscribe()

      if (!user) {
        resolve(null)
        return
      }

      try {
        const isAdmin = await checkIsAdmin(user.uid)

        if (isAdmin) {
          resolve({
            uid: user.uid,
            email: user.email || ""
          })
        } else {
          resolve(null)
        }
      } catch (err) {
        console.error("Error during admin check:", err)
        resolve(null)
      }
    })
  })
}


/**
 * Clear admin session (same as logout)
 */
export async function clearAdminSession(): Promise<void> {
  await logoutAdmin()
}