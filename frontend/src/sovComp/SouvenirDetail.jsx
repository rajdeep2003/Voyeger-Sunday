"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"

export default function SouvenirDetail({ souvenir, onBack, onBookNow }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="container mx-auto p-12 mt-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Souvenirs
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={souvenir.images?.[selectedImage] || souvenir.image}
              alt={souvenir.name}
              className="w-full h-full object-cover"
            />
          </div>

          {souvenir.images && souvenir.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {souvenir.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${souvenir.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              {souvenir.region} • {souvenir.category}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{souvenir.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{souvenir.rating}</span>
                <span className="text-gray-500">({souvenir.reviews} reviews)</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-3xl font-bold text-blue-600 mb-6">${souvenir.price}</div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{souvenir.description}</p>
          </div>

          {souvenir.features && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Features</h3>
              <ul className="space-y-2">
                {souvenir.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onBookNow({ ...souvenir, quantity })}
                disabled={!souvenir.inStock}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {souvenir.inStock ? "Book Now" : "Out of Stock"}
              </button>
            </div>
          </div>

          {/* Shipping & Returns */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="w-5 h-5" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="w-5 h-5" />
              <span>Authentic guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <RotateCcw className="w-5 h-5" />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
