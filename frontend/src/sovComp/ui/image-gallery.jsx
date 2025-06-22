"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export function ImageGallery({ images, alt = "Gallery image" }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  if (!images || images.length === 0) return null

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
          onClick={openFullscreen}
        >
          <img
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  currentIndex === index ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${alt} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`${alt} ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
