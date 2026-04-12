import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

/**
 * Upload a product image to Firebase Storage
 * @param file - The image file to upload
 * @param productId - Optional product ID for organizing files
 * @returns The download URL of the uploaded image
 */
export async function uploadProductImage(file: File, productId?: string): Promise<string> {
  if (!storage) {
    throw new Error("Firebase Storage not initialized")
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image")
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error("File size must be less than 5MB")
  }

  try {
    // Create a unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const path = productId ? `products/${productId}/${filename}` : `products/${filename}`

    // Upload file
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log("[v0] Image uploaded successfully:", downloadURL)

    return downloadURL
  } catch (error) {
    console.error("[v0] Error uploading image:", error)
    throw new Error("Failed to upload image")
  }
}

/**
 * Delete a product image from Firebase Storage
 * @param imageUrl - The full download URL of the image to delete
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  if (!storage) {
    throw new Error("Firebase Storage not initialized")
  }

  try {
    // Extract the path from the URL
    const url = new URL(imageUrl)
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/)
    if (!pathMatch) {
      throw new Error("Invalid image URL")
    }

    const path = decodeURIComponent(pathMatch[1])
    const storageRef = ref(storage, path)

    await deleteObject(storageRef)
    console.log("[v0] Image deleted successfully:", path)
  } catch (error) {
    console.error("[v0] Error deleting image:", error)
    throw new Error("Failed to delete image")
  }
}

/**
 * Upload multiple product images
 * @param files - Array of image files to upload
 * @param productId - Optional product ID for organizing files
 * @returns Array of download URLs
 */
export async function uploadMultipleProductImages(files: File[], productId?: string): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadProductImage(file, productId))
  return Promise.all(uploadPromises)
}
