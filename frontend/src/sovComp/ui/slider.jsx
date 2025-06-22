"use client"

import { useState, useRef, useEffect } from "react"

export function Slider({ value = [0], onValueChange, min = 0, max = 100, step = 1, className = "" }) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragIndex, setDragIndex] = useState(0)
  const sliderRef = useRef(null)

  const handleMouseDown = (index) => (e) => {
    setIsDragging(true)
    setDragIndex(index)
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const newValue = min + percentage * (max - min)
    const steppedValue = Math.round(newValue / step) * step

    const newValues = [...value]
    newValues[dragIndex] = Math.max(min, Math.min(max, steppedValue))

    // Ensure values don't cross over
    if (newValues.length === 2) {
      if (dragIndex === 0 && newValues[0] > newValues[1]) {
        newValues[0] = newValues[1]
      } else if (dragIndex === 1 && newValues[1] < newValues[0]) {
        newValues[1] = newValues[0]
      }
    }

    onValueChange(newValues)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging])

  const getPercentage = (val) => ((val - min) / (max - min)) * 100

  return (
    <div className={`relative w-full ${className}`}>
      <div ref={sliderRef} className="relative h-2 bg-gray-200 rounded-full cursor-pointer">
        {/* Track fill */}
        {value.length === 2 ? (
          <div
            className="absolute h-2 bg-blue-600 rounded-full"
            style={{
              left: `${getPercentage(value[0])}%`,
              width: `${getPercentage(value[1]) - getPercentage(value[0])}%`,
            }}
          />
        ) : (
          <div
            className="absolute h-2 bg-blue-600 rounded-full"
            style={{
              width: `${getPercentage(value[0])}%`,
            }}
          />
        )}

        {/* Thumbs */}
        {value.map((val, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 bg-white border-2 border-blue-600 rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 top-1/2"
            style={{ left: `${getPercentage(val)}%` }}
            onMouseDown={handleMouseDown(index)}
          />
        ))}
      </div>
    </div>
  )
}
