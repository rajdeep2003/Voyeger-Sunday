"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination({ currentPage, totalPages, onPageChange, showPages = 5 }) {
  const getVisiblePages = () => {
    const pages = []
    const start = Math.max(1, currentPage - Math.floor(showPages / 2))
    const end = Math.min(totalPages, start + showPages - 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getVisiblePages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            page === currentPage ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
