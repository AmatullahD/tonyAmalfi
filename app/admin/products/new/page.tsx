"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAdminSession } from "@/lib/admin-auth"
import { createProduct, SizeDetail, SizeMeasurement } from "@/lib/services/products"
import { uploadMultipleProductImages } from "@/lib/services/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { X, Plus, Upload, Trash2 } from "lucide-react"

export default function NewProductPage() {
  const [session, setSession] = useState<{ username: string } | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
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
    const adminSession = getAdminSession()
    if (!adminSession) {
      router.push("/admin/login")
    } else {
      setSession(adminSession)
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles((prev) => [...prev, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
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
    if (!tempQuantity || parseInt(tempQuantity) <= 0) {
      alert("Please enter a valid quantity")
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

  // Replace the handleSubmit function in your new product page.tsx with this:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    console.log("Starting product creation...")

    let imageUrls: string[] = []
    if (imageFiles.length > 0) {
      console.log("Uploading", imageFiles.length, "images...")
      imageUrls = await uploadMultipleProductImages(imageFiles)
      console.log("Images uploaded:", imageUrls)
    }

    // Calculate total stock from size quantities
    const totalStock = getTotalStock()

    const productData: any = {
      title: formData.title,
      description: formData.description,
      originalPrice: Number.parseFloat(formData.originalPrice),
      discountedPrice: Number.parseFloat(formData.discountedPrice),
      currency: "INR",
      images: imageUrls,
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
    }
    
    // Only add care if not empty - FIXED
    if (formData.care.trim()) {
      productData.care = formData.care.trim()
    }

    const productId = await createProduct(productData)
    console.log("Product created successfully:", productId)

    alert("Product added successfully!")
    router.push("/admin/dashboard")
  } catch (error: any) {
    console.error("Error creating product:", error)
    alert(error.message || "Failed to add product")
  } finally {
    setLoading(false)
  }
}

  if (!session) return null

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
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Fill in the product details below</p>
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
                  placeholder="e.g., Premium Cotton T-Shirt"
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
                  placeholder="Describe your product..."
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
                  placeholder="e.g., T-Shirts"
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
                  placeholder="1299"
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
                  placeholder="498"
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
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                <div className="flex flex-col items-center">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-600">Click to upload images</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
                </div>
                <Input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
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
                          Stock: <strong>{sizeDetail.quantity} units</strong>
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

          {/* Submit */}
          <div className="flex gap-4 justify-end sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
            <Link href="/admin/dashboard">
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} size="lg" className="min-w-[150px]">
              {loading ? "Creating..." : "Create Product"}
            </Button>
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
    </div>
  )
}

// Color Picker Component (unchanged)
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