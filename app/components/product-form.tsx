"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import Image from "next/image"

const CATEGORIES = ["CLOTHING", "HATS", "ACCESSORIES", "MUGS"]
const SINGLE_VARIANT_CATEGORIES = ["HATS", "MUGS"]

interface FormData {
  name: string
  description: string
  category: string
  price: string
  printfulSyncId: string
  images: string[]
}

interface Variant {
  size: string | null
  color: string | null
  printfulVariantId: number
  price: number
}

interface CurrentVariant {
  size: string
  color: string
  printfulVariantId: string
  price: string
}

export default function ProductForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    price: "",
    images: [],
    printfulSyncId: ""
  })

  const [variants, setVariants] = useState<Variant[]>([])
  const [currentVariant, setCurrentVariant] = useState<CurrentVariant>({
    size: "",
    color: "",
    printfulVariantId: "",
    price: ""
  })
  const [imageUrl, setImageUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  // Reset variant form if category is single-variant type
  useEffect(() => {
    if (SINGLE_VARIANT_CATEGORIES.includes(formData.category)) {
      setCurrentVariant({
        size: "",
        color: "",
        printfulVariantId: "",
        price: ""
      })
      setVariants([])
    }
  }, [formData.category])

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleVariantChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentVariant((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }))
      setImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleAddVariant = () => {
    if (SINGLE_VARIANT_CATEGORIES.includes(formData.category)) {
      // For single-variant items, just need printful ID
      if (!currentVariant.printfulVariantId.trim()) {
        setError("Printful Variant ID is required")
        return
      }
      setVariants([
        {
          printfulVariantId: parseInt(currentVariant.printfulVariantId),
          price: currentVariant.price
            ? parseFloat(currentVariant.price)
            : parseFloat(formData.price),
          size: null,
          color: null
        }
      ])
      setCurrentVariant({
        size: "",
        color: "",
        printfulVariantId: "",
        price: ""
      })
    } else {
      // For multi-variant items
      if (!currentVariant.printfulVariantId.trim()) {
        setError("Printful Variant ID is required")
        return
      }
      setVariants((prev) => [
        ...prev,
        {
          size: currentVariant.size || null,
          color: currentVariant.color || null,
          printfulVariantId: parseInt(currentVariant.printfulVariantId),
          price: currentVariant.price
            ? parseFloat(currentVariant.price)
            : parseFloat(formData.price)
        }
      ])
      setCurrentVariant({
        size: "",
        color: "",
        printfulVariantId: "",
        price: ""
      })
      setError("")
    }
  }

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setError("")
    setSuccess("")
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.price ||
      !formData.printfulSyncId
    ) {
      setError("Please fill in all required fields")
      return
    }

    if (variants.length === 0) {
      setError("Please add at least one variant")
      return
    }

    if (formData.images.length === 0) {
      setError("Please add at least one image")
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        images: formData.images,
        variants: variants,
        printfulSyncId: formData.printfulSyncId
      }

      console.log({ payload })

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      await response.json()
      setSuccess("Product created successfully!")

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        images: [],
        printfulSyncId: ""
      })
      setVariants([])
      setCurrentVariant({
        size: "",
        color: "",
        printfulVariantId: "",
        price: ""
      })
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const isSingleVariant = SINGLE_VARIANT_CATEGORIES.includes(formData.category)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Add New Product</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
              className="space-y-6"
            >
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Classic T-Shirt"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description *
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Describe your product..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category *
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Base Price ($) *
                    </label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Printful Sync ID *
                    </label>
                    <Input
                      type="number"
                      name="printfulSyncId"
                      value={formData.printfulSyncId}
                      onChange={handleFormChange}
                      placeholder="e.g., 12345"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Images</h3>

                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image URL from Supabase..."
                  />
                  <Button onClick={handleAddImage} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <Image
                        src={img}
                        height={200}
                        width={200}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variants */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {isSingleVariant ? "Variant" : "Variants"}
                </h3>

                <div className="grid gap-4">
                  {!isSingleVariant && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Size
                          </label>
                          <Input
                            type="text"
                            name="size"
                            value={currentVariant.size}
                            onChange={handleVariantChange}
                            placeholder="e.g., M, L, XL"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Color
                          </label>
                          <Input
                            type="text"
                            name="color"
                            value={currentVariant.color}
                            onChange={handleVariantChange}
                            placeholder="e.g., Blue, Red"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Printful Variant ID *
                      </label>
                      <Input
                        type="number"
                        name="printfulVariantId"
                        value={currentVariant.printfulVariantId}
                        onChange={handleVariantChange}
                        placeholder="e.g., 12345"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Variant Price (optional, uses base price if empty)
                      </label>
                      <Input
                        type="number"
                        name="price"
                        value={currentVariant.price}
                        onChange={handleVariantChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleAddVariant}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variant
                  </Button>
                </div>

                {/* Variants List */}
                <div className="space-y-2">
                  {variants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <div className="text-sm">
                        <p className="font-medium text-slate-900">
                          {variant.size && variant.color
                            ? `${variant.size} - ${variant.color}`
                            : variant.size
                            ? `Size: ${variant.size}`
                            : variant.color
                            ? `Color: ${variant.color}`
                            : "Single Variant"}
                        </p>
                        <p className="text-slate-600">
                          ID: {variant.printfulVariantId} | Price: $
                          {variant.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2"
                size="lg"
              >
                {loading ? "Creating Product..." : "Create Product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
