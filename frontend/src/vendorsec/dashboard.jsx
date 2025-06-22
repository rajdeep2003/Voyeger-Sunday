"use client"

import { DashboardStats } from "./dashboard-stats"
import { RecentOrders } from "./recent-orders"
import { TopSellingItems } from "./top-selling-items"

export function Dashboard({ souvenirs, orders, analytics }) {
  return (
    <div className="space-y-6">
      <DashboardStats souvenirs={souvenirs} orders={orders} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={orders} />
        <TopSellingItems souvenirs={souvenirs} />
      </div>
    </div>
  )
}
