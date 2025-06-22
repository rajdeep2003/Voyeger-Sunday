"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge } from "../vendorsec/ui-components"

export function RecentOrders({ orders }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{order.customer}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{order.total.toFixed(2)}</p>
                <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
