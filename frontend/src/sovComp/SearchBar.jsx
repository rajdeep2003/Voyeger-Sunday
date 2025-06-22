"use client"
import { Search, X } from "lucide-react"

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search souvenirs, regions, or descriptions..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {searchTerm && (
        <button onClick={() => onSearchChange("")} className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  )
}
