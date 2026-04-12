import { initializeApp, type FirebaseApp, getApps } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

function initializeFirebase() {
  // Only initialize on client side
  if (typeof window === 'undefined') {
    console.log("[v0] Skipping Firebase client initialization on server")
    return { app: null, auth: null, db: null, storage: null }
  }

  // Check if already initialized
  if (getApps().length > 0) {
    app = getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    return { app, auth, db, storage }
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDmLRUsfT54Pf-EbU1S8TXQfxQNs4g-Alw",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tony-amalfi.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tony-amalfi",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tony-amalfi.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "793251923899",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:793251923899:web:6c18dc4c25f7c8ae9c669e",
  }

  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    console.log("[v0] Firebase initialized successfully with project:", firebaseConfig.projectId)
  } catch (error) {
    console.error("[v0] Firebase initialization error:", error)
  }

  return { app, auth, db, storage }
}

const { app: firebaseApp, auth: firebaseAuth, db: firebaseDb, storage: firebaseStorage } = initializeFirebase()

export { firebaseApp as app, firebaseAuth as auth, firebaseDb as db, firebaseStorage as storage }
export default firebaseApp