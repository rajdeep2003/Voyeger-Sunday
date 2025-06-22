"use client"
import { MapPin, Star, ShoppingCart } from "lucide-react"

export default function SouvenirCard({ souvenir, onClick }) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={souvenir.thumbnail}
          alt={souvenir.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold">
          ${souvenir.price}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          {souvenir.region}
        </div>

        <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {souvenir.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{souvenir.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{souvenir.rating}</span>
            <span className="text-sm text-gray-500">({souvenir.reviews})</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <ShoppingCart className="w-4 h-4" />
            {souvenir.inStock ? "In Stock" : "Out of Stock"}
          </div>
        </div>
      </div>
    </div>
  )
}
