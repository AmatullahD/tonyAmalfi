import * as admin from "firebase-admin"

let adminAuth: admin.auth.Auth | null = null
let adminDb: admin.firestore.Firestore | null = null
let adminStorage: admin.storage.Storage | null = null

if (!admin.apps.length) {
  try {
    let serviceAccount: any = null

    // Check if environment variable exists and is valid JSON
    if (process.env.FIREBASE_ADMIN_SDK_KEY) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY)
        console.log("[v0] Using FIREBASE_ADMIN_SDK_KEY from environment")
      } catch (parseError) {
        console.error("[v0] Failed to parse FIREBASE_ADMIN_SDK_KEY:", parseError)
        serviceAccount = null
      }
    }

    // Use default service account only if env variable is not set or parsing failed
    if (!serviceAccount) {
      console.warn("[v0] Using default Firebase Admin credentials (development only)")
      serviceAccount = {
        type: "service_account",
        project_id: "tony-amalfi",
        private_key_id: "e1f6a04fbe42ca169bea1a4d853af699eba88685",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCNp9Z04zKwvLd/\nhK8bIH85POU76yRnZr8Xph0+DTG21qu5XLue09+tD/J1q9As0+W6PK39pULuHowi\nQ7Q+Es4AZN3WHaR+6cR2otBzpIxAierYN1j/5NQpYLVm0VF0zgTUK5Qz1D/UBAFK\nZ7/gxWrbmfP8yf77z6rCcRZTdNV6KYIRwswUF0yMK0NrKsbtZUPd+OExFWmICSSu\n+VzfuBmRPD+5og7GFH4/ltYbLvFJtRRonLlbCVtRkKR4nv552VRi/INwH0wA/pCC\n3aHRLcY0eLqICBrS+tJI5rU4QGV5kovXSs5vqgqC3TQ5kSIfxGdC02Yiq9kUzPAk\nf5InFuwpAgMBAAECggEABB4UYgQZZEsP/ynIv9bqtaHxZAAOLRrMV7UigZ6BGcct\nuCAvgBmRqSF8f0uCLCcYKxjwNGMfGKdZWX/tw+DolyfNknoQfFY3HBDEoYdH8+jC\nD74DMNVJ5thO+xX/CvLJA4gbXZcTxeJ3dNRnlOim5NnBLT3aUvgBhu2/lQn6AXwb\nKDxhdGf6XNfetrEpCAvROtTfpQjsSxooloCC7pnJohefnYwOAJOC0y2gQkhTzTiU\nYidbqBTXFnFlw4JXLsihakJwGctQ6iKgoejXaikb9VqBb6ODzL6yrIyl+8KSbX3L\n82qjhfYodKzhuqXcao+i+4nWU+zk0Dq9B7iu02l5QwKBgQDEtJMrevfeGWbpyPS6\nkHax0UcT4/JFsJc+sRO3c9WVw3RAFPNCMTC+GeMkyqmOb4M1QFUphcjIuFq8maGn\nvshilbKDebTl9qO9WXD/t3RIH6VSNh08zVBBaeF8hDqN+TxGZiUfue74XQRPqJ0X\nf4okN6haa8hp8sl9/ErnFn1hNwKBgQC4WypIfDE81Q31ysVxuBd8JTYTu1m39mV1\nKd/ZwTykD+/eKIS0MZJOKZ8IEAZeq2XgF6/FyWlE1Bl0kfT7J+cL2KDU+XH/4KSa\nWQgPAnj8nalOSAqgdYr4Yy/dKu5wR3zJJyKRk3VpyjPOst0ATy+OjNauAciws6kA\nFZXX89ZNnwKBgQChQiQwjhPsKUj8ObmfxNT5u8aYYNP6G+YyB/tQ9w5PQ7fm3QX7\n6tW50wEq5VYRpgubuUzXyIytOK1yVkR3f2lJoM2DCWCq8gKUNWH00ZHrmr3uYtyf\nPvYfWkz3xnM2du/aCt0+YDCvvZnOMD3wyKcYP+StlBTt/pL+zLkfL4nECwKBgGMj\ni2J9ftDy1dYG3BTiZaa6MBF+X6oBE+Bky19DfkPP2jNC4NIyEjZ8RWxFiddhHqDa\nvAiF3llIIgRA9VgWxjXlod/F4Ns0R/BEzoOb1corUr+pGCXf8ALQ/A1Yp+6zUtSt\nefaFMM/aD/Ao2ZXv/2gOLuhWR0FW7BwCf5kpJGaLAoGAGk3HgCG4KDKt7xXgvZGK\nhowZDZ2U3+W8voC0JyESJsMyeaFGbgTTjTHlccGxM84mF7sxCeJwXCH3RFa2W9kd\nB/PiRm9vtQixeDHi7o7mBiWzzuhkcTdpAyGxqgv56fp0T7o19NGQr6Wkp3sV0xtT\nhmeSbzkYoWtl17HMfBhOSZk=\n-----END PRIVATE KEY-----\n",
        client_email: "firebase-adminsdk-fbsvc@tony-amalfi.iam.gserviceaccount.com",
        client_id: "108246135067786202108",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url:
          "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40tony-amalfi.iam.gserviceaccount.com",
        universe_domain: "googleapis.com",
      }
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "tony-amalfi.firebasestorage.app",
    })

    adminAuth = admin.auth()
    adminDb = admin.firestore()
    adminStorage = admin.storage()

    console.log("[v0] Firebase Admin initialized successfully with project:", serviceAccount.project_id)
  } catch (error) {
    console.error("[v0] Firebase Admin initialization error:", error)
    console.error("[v0] Error details:", error instanceof Error ? error.message : String(error))
  }
} else {
  // Apps already initialized, get references
  adminAuth = admin.auth()
  adminDb = admin.firestore()
  adminStorage = admin.storage()
}

export { adminAuth, adminDb, adminStorage }
export default admin