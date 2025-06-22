"use client"
import { Slider } from "./ui/slider"

export default function FilterSidebar({
  regions,
  categories,
  selectedRegion,
  selectedCategory,
  priceRange,
  onRegionChange,
  onCategoryChange,
  onPriceRangeChange,
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-6">Filters</h3>

      {/* Region Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Region</label>
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <Slider value={priceRange} onValueChange={onPriceRangeChange} max={1000} min={0} step={10} className="w-full" />
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          onRegionChange("")
          onCategoryChange("")
          onPriceRangeChange([0, 1000])
        }}
        className="w-full py-2 px-4 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )
}
