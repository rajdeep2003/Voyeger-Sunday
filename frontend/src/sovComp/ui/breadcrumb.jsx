"use client"

import { ChevronRight, Home } from "lucide-react"

export function Breadcrumb({ items, separator = <ChevronRight className="w-4 h-4 text-gray-400" /> }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <button className="flex items-center hover:text-gray-900 transition-colors">
        <Home className="w-4 h-4" />
      </button>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {separator}
          {item.href ? (
            <button onClick={() => item.onClick && item.onClick()} className="hover:text-gray-900 transition-colors">
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
