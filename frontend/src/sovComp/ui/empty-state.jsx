"use client"

import { Package, Search, ShoppingCart } from "lucide-react"

const emptyStateTypes = {
  search: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search or filter criteria",
  },
  products: {
    icon: Package,
    title: "No products available",
    description: "Check back later for new items",
  },
  cart: {
    icon: ShoppingCart,
    title: "Your cart is empty",
    description: "Add some items to get started",
  },
}

export function EmptyState({ type = "search", title, description, action, className = "" }) {
  const config = emptyStateTypes[type] || emptyStateTypes.search
  const Icon = config.icon

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-gray-400 mb-4">
        <Icon className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title || config.title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description || config.description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
