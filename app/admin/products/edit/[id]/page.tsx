// app/admin/products/edit/[id]/page.tsx
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getAdminSession } from "@/lib/admin-auth"
import { getProductById, updateProduct, SizeDetail, SizeMeasurement, deleteProduct } from "@/lib/services/products"
import { uploadMultipleProductImages } from "@/lib/services/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { X, Plus, Upload, Trash2 } from "lucide-react"

export default function EditProductPage() {
  const [session, setSession] = useState<{ uid: string; email: string } | null>(null)
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    category: "",
    tags: "",
    materials: "",
    care: "",
  })
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([])
  const [sizeDetails, setSizeDetails] = useState<SizeDetail[]>([])
  
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [editingSizeIndex, setEditingSizeIndex] = useState<number | null>(null)
  const [tempSize, setTempSize] = useState("")
  const [tempQuantity, setTempQuantity] = useState("") // NEW
  const [tempMeasurements, setTempMeasurements] = useState<SizeMeasurement[]>([
    { name: "Chest", value: "" },
    { name: "Length", value: "" },
    { name: "Shoulder", value: "" },
    { name: "Waist", value: "" }
  ])

  useEffect(() => {
    const checkSession = async () => {
      const adminSession = await getAdminSession()
      if (!adminSession) {
        router.push("/admin/login")
      } else {
        setSession(adminSession)
        loadProduct()
      }
    }
    checkSession()
  }, [router, productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const product = await getProductById(productId)
      
      if (!product) {
        alert("Product not found")
        router.push("/admin/dashboard")
        return
      }

      setFormData({
        title: product.title,
        description: product.description,
        originalPrice: product.originalPrice.toString(),
        discountedPrice: product.discountedPrice.toString(),
        category: product.category,
        tags: product.tags?.join(", ") || "",
        materials: product.materials || "",
        care: product.care || "",
      })
      
      setExistingImages(product.images || [])
      setColors(product.colors || [])
      setSizeDetails(product.sizeDetails || [])
    } catch (error) {
      console.error("Error loading product:", error)
      alert("Failed to load product")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setNewImageFiles((prev) => [...prev, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const addColor = (name: string, hex: string) => {
    if (name && hex) {
      setColors([...colors, { name, hex }])
    }
  }

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }

  const openSizeModal = (index?: number) => {
    if (index !== undefined) {
      setEditingSizeIndex(index)
      setTempSize(sizeDetails[index].size)
      setTempQuantity(sizeDetails[index].quantity.toString()) // NEW
      setTempMeasurements(sizeDetails[index].measurements)
    } else {
      setEditingSizeIndex(null)
      setTempSize("")
      setTempQuantity("") // NEW
      setTempMeasurements([
        { name: "Chest", value: "" },
        { name: "Length", value: "" },
        { name: "Shoulder", value: "" },
        { name: "Waist", value: "" }
      ])
    }
    setShowSizeModal(true)
  }

  const saveSizeDetail = () => {
    if (!tempSize) {
      alert("Please enter a size")
      return
    }

    // NEW: Validate quantity
    if (!tempQuantity || parseInt(tempQuantity) < 0) {
      alert("Please enter a valid quantity (0 or more)")
      return
    }

    const filledMeasurements = tempMeasurements.filter(m => m.value.trim() !== "")
    
    if (filledMeasurements.length === 0) {
      alert("Please add at least one measurement")
      return
    }

    const newSizeDetail: SizeDetail = { 
      size: tempSize, 
      measurements: filledMeasurements,
      quantity: parseInt(tempQuantity) // NEW
    }

    if (editingSizeIndex !== null) {
      const updated = [...sizeDetails]
      updated[editingSizeIndex] = newSizeDetail
      setSizeDetails(updated)
    } else {
      setSizeDetails([...sizeDetails, newSizeDetail])
    }

    setShowSizeModal(false)
  }

  const removeSizeDetail = (index: number) => {
    setSizeDetails(sizeDetails.filter((_, i) => i !== index))
  }

  const updateMeasurement = (index: number, field: 'name' | 'value', value: string) => {
    const updated = [...tempMeasurements]
    updated[index][field] = value
    setTempMeasurements(updated)
  }

  const addMeasurementField = () => {
    setTempMeasurements([...tempMeasurements, { name: "", value: "" }])
  }

  const removeMeasurementField = (index: number) => {
    setTempMeasurements(tempMeasurements.filter((_, i) => i !== index))
  }

  // NEW: Calculate total stock from all sizes
  const getTotalStock = () => {
    return sizeDetails.reduce((sum, size) => sum + size.quantity, 0)
  }

  // Replace the handleSubmit function in your edit page.tsx with this:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setSaving(true)

  try {
    console.log("Updating product...")

    // Upload new images if any
    let newImageUrls: string[] = []
    if (newImageFiles.length > 0) {
      console.log("Uploading", newImageFiles.length, "new images...")
      newImageUrls = await uploadMultipleProductImages(newImageFiles)
      console.log("New images uploaded:", newImageUrls)
    }

    // Combine existing and new images
    const allImages = [...existingImages, ...newImageUrls]

    // Calculate total stock from size quantities
    const totalStock = getTotalStock()

    const productData: any = {
      title: formData.title,
      description: formData.description,
      originalPrice: Number.parseFloat(formData.originalPrice),
      discountedPrice: Number.parseFloat(formData.discountedPrice),
      images: allImages,
      category: formData.category,
      stock: totalStock,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      sizeDetails: sizeDetails,
      isActive: true,
    }

    if (colors.length > 0) {
      productData.colors = colors
    }
    
    // Only add materials if not empty - FIXED
    if (formData.materials.trim()) {
      productData.materials = formData.materials.trim()
    } else {
      // Explicitly set to null to remove from database
      productData.materials = null
    }
    
    // Only add care if not empty - FIXED
    if (formData.care.trim()) {
      productData.care = formData.care.trim()
    } else {
      // Explicitly set to null to remove from database
      productData.care = null
    }

    await updateProduct(productId, productData)
    console.log("Product updated successfully")

    alert("Product updated successfully!")
    router.push("/admin/dashboard")
  } catch (error: any) {
    console.error("Error updating product:", error)
    alert(error.message || "Failed to update product")
  } finally {
    setSaving(false)
  }
}

  const handleDelete = async () => {
    setDeleting(true)

    try {
      await deleteProduct(productId)
      alert("Product deleted successfully!")
      router.push("/admin/dashboard")
    } catch (error: any) {
      console.error("Error deleting product:", error)
      alert(error.message || "Failed to delete product")
      setDeleting(false)
    }
  }

  if (!session || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📝 Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Title *</label>
                <Input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  className="text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows={4} 
                  required 
                  className="text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Input 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              💰 Pricing
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Original Price (₹) *</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  name="originalPrice" 
                  value={formData.originalPrice} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Discounted Price (₹) *</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  name="discountedPrice" 
                  value={formData.discountedPrice} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            {formData.originalPrice && formData.discountedPrice && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  💡 Discount: <strong>
                    {Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.discountedPrice)) / parseFloat(formData.originalPrice)) * 100)}% OFF
                  </strong> (₹{(parseFloat(formData.originalPrice) - parseFloat(formData.discountedPrice)).toFixed(2)} savings)
                </p>
              </div>
            )}
          </Card>

          {/* Product Images */}
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🖼️ Product Images
            </h2>
            
            <div className="space-y-4">
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Current Images</label>
                  <div className="grid grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Current ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              <div>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <div className="flex flex-col items-center">
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-600">Click to upload new images</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
                  </div>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleNewImageChange} 
                    className="hidden" 
                  />
                </label>
              </div>

              {newImagePreviews.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">New Images to Upload</label>
                  <div className="grid grid-cols-4 gap-4">
                    {newImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-green-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Colors */}
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🎨 Colors (Optional)
            </h2>
            
            <ColorPicker colors={colors} onAdd={addColor} onRemove={removeColor} />
          </Card>

          {/* Sizes - UPDATED */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  📏 Size Details *
                </h2>
                {sizeDetails.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Total Stock: <strong>{getTotalStock()} units</strong>
                  </p>
                )}
              </div>
              <Button 
                type="button" 
                onClick={() => openSizeModal()}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Size
              </Button>
            </div>

            {sizeDetails.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No sizes added yet. Click "Add Size" to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sizeDetails.map((sizeDetail, index) => (
                  <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">{sizeDetail.size}</span>
                        <p className="text-sm text-gray-600 mt-1">
                          Stock: <strong className={sizeDetail.quantity === 0 ? "text-red-600" : "text-green-600"}>
                            {sizeDetail.quantity} units
                          </strong>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openSizeModal(index)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSizeDetail(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      {sizeDetail.measurements.map((measurement, mIndex) => (
                        <div key={mIndex} className="flex justify-between text-gray-700">
                          <span className="font-medium">{measurement.name}:</span>
                          <span>{measurement.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Additional Details */}
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              ℹ️ Additional Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="casual, premium, cotton"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Materials</label>
                <Input 
                  name="materials" 
                  value={formData.materials} 
                  onChange={handleChange} 
                  placeholder="e.g., 100% Premium Cotton" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Care Instructions</label>
                <Input 
                  name="care" 
                  value={formData.care} 
                  onChange={handleChange} 
                  placeholder="e.g., Machine wash cold, tumble dry low" 
                />
              </div>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <div className="w-full max-w-5xl px-4 pointer-events-auto">
              <div className="flex gap-4 justify-end bg-white p-4 rounded-lg shadow-lg border">
                <Link href="/admin/dashboard">
                  <Button type="button" variant="outline" size="lg">
                    Cancel
                  </Button>
                </Link>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="gap-2 min-w-[160px] flex items-center justify-center bg-red-600 text-white hover:bg-red-700"
                  size="lg"
                  disabled={deleting}
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? "Deleting..." : "Delete Product"}
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                  size="lg"
                  className="min-w-[150px]"
                >
                  {saving ? "Saving..." : "Update Product"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Size Modal - UPDATED */}
      {showSizeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <h3 className="text-2xl font-bold mb-6">
              {editingSizeIndex !== null ? "Edit" : "Add"} Size Details
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Size Name *</label>
                  <Input
                    value={tempSize}
                    onChange={(e) => setTempSize(e.target.value.toUpperCase())}
                    placeholder="e.g., S, M, L, XL, XXL"
                    className="text-lg font-semibold"
                  />
                </div>
                
                {/* NEW: Quantity Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity *</label>
                  <Input
                    type="number"
                    min="0"
                    value={tempQuantity}
                    onChange={(e) => setTempQuantity(e.target.value)}
                    placeholder="e.g., 50"
                    className="text-lg font-semibold"
                  />
                  {editingSizeIndex !== null && sizeDetails[editingSizeIndex] && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current stock: {sizeDetails[editingSizeIndex].quantity} units
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium">Measurements *</label>
                  <Button 
                    type="button" 
                    onClick={addMeasurementField}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Field
                  </Button>
                </div>

                <div className="space-y-3">
                  {tempMeasurements.map((measurement, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        placeholder="Name (e.g., Chest)"
                        value={measurement.name}
                        onChange={(e) => updateMeasurement(index, 'name', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value (e.g., 38 inches)"
                        value={measurement.value}
                        onChange={(e) => updateMeasurement(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      {tempMeasurements.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeMeasurementField(index)}
                          variant="outline"
                          size="icon"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Update Warning */}
              {editingSizeIndex !== null && tempQuantity && sizeDetails[editingSizeIndex] && (
                parseInt(tempQuantity) !== sizeDetails[editingSizeIndex].quantity && (
                  <div className={`p-3 rounded-lg border ${
                    parseInt(tempQuantity) > sizeDetails[editingSizeIndex].quantity
                      ? "bg-green-50 border-green-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}>
                    <p className="text-sm font-medium">
                      {parseInt(tempQuantity) > sizeDetails[editingSizeIndex].quantity ? (
                        <span className="text-green-800">
                          ✓ Adding {parseInt(tempQuantity) - sizeDetails[editingSizeIndex].quantity} units to stock
                        </span>
                      ) : (
                        <span className="text-yellow-800">
                          ⚠️ Removing {sizeDetails[editingSizeIndex].quantity - parseInt(tempQuantity)} units from stock
                        </span>
                      )}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <Button
                type="button"
                onClick={() => setShowSizeModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={saveSizeDetail}
              >
                {editingSizeIndex !== null ? "Update" : "Add"} Size
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          role="presentation"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowDeleteConfirm(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 id="delete-product-title" className="text-xl font-bold">
                Delete Product
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{formData.title}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end mt-2 sm:flex-row flex-col-reverse">
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                disabled={deleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleDelete}
                variant="destructive"
                disabled={deleting}
                className="min-w-[120px] w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete Product"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Color Picker Component
function ColorPicker({ colors, onAdd, onRemove }: {
  colors: { name: string; hex: string }[]
  onAdd: (name: string, hex: string) => void
  onRemove: (index: number) => void
}) {
  const [colorName, setColorName] = useState("")
  const [colorHex, setColorHex] = useState("#000000")

  const handleAdd = () => {
    if (colorName) {
      onAdd(colorName, colorHex)
      setColorName("")
      setColorHex("#000000")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          placeholder="Color name (e.g., Black)"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Input
            type="color"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="w-16 h-10 cursor-pointer"
          />
          <Button type="button" onClick={handleAdd}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {colors.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full border border-gray-300">
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                style={{ backgroundColor: color.hex }} 
              />
              <span className="text-sm font-medium">{color.name}</span>
              <button 
                type="button" 
                onClick={() => onRemove(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}