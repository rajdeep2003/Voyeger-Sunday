"use client"

import { Star } from "lucide-react"

export function Rating({ rating, maxRating = 5, size = "sm", showValue = true, interactive = false, onRatingChange }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const handleStarClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= rating
          const isHalfFilled = starValue - 0.5 <= rating && starValue > rating

          return (
            <button
              key={index}
              onClick={() => handleStarClick(starValue)}
              disabled={!interactive}
              className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled || isHalfFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                } transition-colors`}
              />
            </button>
          )
        })}
      </div>
      {showValue && <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>}
    </div>
  )
}
