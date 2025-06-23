"use client"

import { useState, useMemo, useEffect } from "react"
import SearchBar from "./SearchBar"
import FilterSidebar from "./FilterSidebar"
import SouvenirCard from "./SouvenirCard"
import { Search, Filter, MapPin } from "lucide-react"
import { useAppContext } from "../context/AppContext"
export default function SouvenirListing({ souvenirs, onSouvenirClick }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [showFilters, setShowFilters] = useState(false)
  const { souvenirLocation } = useAppContext()

  useEffect(() => {
    if (souvenirLocation) {
      setSearchTerm(souvenirLocation);
    }
  }, [souvenirLocation]);

  const filteredSouvenirs = useMemo(() => {
    return souvenirs.filter((souvenir) => {
      const matchesSearch =
        souvenir.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        souvenir.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        souvenir.region.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRegion = !selectedRegion || souvenir.region === selectedRegion
      const matchesCategory = !selectedCategory || souvenir.category === selectedCategory
      const matchesPrice = souvenir.price >= priceRange[0] && souvenir.price <= priceRange[1]

      return matchesSearch && matchesRegion && matchesCategory && matchesPrice
    })
  }, [souvenirs, searchTerm, selectedRegion, selectedCategory, priceRange])

  const regions = [...new Set(souvenirs.map((s) => s.region))]
  const categories = [...new Set(souvenirs.map((s) => s.category))]
  //
  //
  //
  //1``

  return (
    <div className="container mx-auto p-10 mt-20 ">
      {/* Header */}
      <div className="text-center mb-8 ">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Regional Souvenirs</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover authentic souvenirs from around the world. Each item tells a story of its region's culture and
          craftsmanship.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              {filteredSouvenirs.length} items found
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 flex-shrink-0">
            <FilterSidebar
              regions={regions}
              categories={categories}
              selectedRegion={selectedRegion}
              selectedCategory={selectedCategory}
              priceRange={priceRange}
              onRegionChange={setSelectedRegion}
              onCategoryChange={setSelectedCategory}
              onPriceRangeChange={setPriceRange}
            />
          </div>
        )}

        {/* Souvenirs Grid */}
        <div className="flex-1">
          {filteredSouvenirs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No souvenirs found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSouvenirs.map((souvenir) => (
                <SouvenirCard key={souvenir.id} souvenir={souvenir} onClick={() => onSouvenirClick(souvenir)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
