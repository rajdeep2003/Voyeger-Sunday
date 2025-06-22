"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { TrendingUp, TrendingDown, Calendar, DollarSign, Bed } from "lucide-react"

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [analyticsData] = useState({
    monthlyRevenue: [
      { month: "Aug", revenue: 180000 },
      { month: "Sep", revenue: 220000 },
      { month: "Oct", revenue: 195000 },
      { month: "Nov", revenue: 240000 },
      { month: "Dec", revenue: 280000 },
      { month: "Jan", revenue: 125000 },
    ],
    occupancyTrend: [
      { month: "Aug", occupancy: 75 },
      { month: "Sep", occupancy: 82 },
      { month: "Oct", occupancy: 68 },
      { month: "Nov", occupancy: 85 },
      { month: "Dec", occupancy: 92 },
      { month: "Jan", occupancy: 78 },
    ],
    roomTypePerformance: [
      { type: "Standard Room", bookings: 45, revenue: 180000 },
      { type: "Deluxe Room", bookings: 32, revenue: 192000 },
      { type: "Suite", bookings: 18, revenue: 216000 },
      { type: "Presidential Suite", bookings: 8, revenue: 160000 },
    ],
    guestOrigin: [
      { location: "Mumbai", count: 35 },
      { location: "Delhi", count: 28 },
      { location: "Bangalore", count: 22 },
      { location: "Chennai", count: 18 },
      { location: "International", count: 12 },
    ],
  })

  const currentMonthRevenue = analyticsData.monthlyRevenue[analyticsData.monthlyRevenue.length - 1]?.revenue || 0
  const previousMonthRevenue = analyticsData.monthlyRevenue[analyticsData.monthlyRevenue.length - 2]?.revenue || 0
  const revenueChange = (((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(1)

  const currentOccupancy = analyticsData.occupancyTrend[analyticsData.occupancyTrend.length - 1]?.occupancy || 0
  const previousOccupancy = analyticsData.occupancyTrend[analyticsData.occupancyTrend.length - 2]?.occupancy || 0
  const occupancyChange = (currentOccupancy - previousOccupancy).toFixed(1)

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508614999368-9260051292e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3JhZGllbnR8ZW58MHx8MHx8fDA%3D')" }}>
 
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Period Selector */}
      <Card className="mb-6 bg-white">
        <CardHeader>
          <CardTitle>Time Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === "3months" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("3months")}
              size="sm"
            >
              Last 3 Months
            </Button>
            <Button
              variant={selectedPeriod === "6months" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("6months")}
              size="sm"
            >
              Last 6 Months
            </Button>
            <Button
              variant={selectedPeriod === "1year" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("1year")}
              size="sm"
            >
              Last Year
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{currentMonthRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs">
              {Number.parseFloat(revenueChange) >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={Number.parseFloat(revenueChange) >= 0 ? "text-green-500" : "text-red-500"}>
                {revenueChange}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentOccupancy}%</div>
            <div className="flex items-center text-xs">
              {Number.parseFloat(occupancyChange) >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={Number.parseFloat(occupancyChange) >= 0 ? "text-green-500" : "text-red-500"}>
                {occupancyChange}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">103</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Daily Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,500</div>
            <p className="text-xs text-muted-foreground">Per room per night</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.monthlyRevenue.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{data.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(data.revenue / Math.max(...analyticsData.monthlyRevenue.map((d) => d.revenue))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm">₹{data.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Trend */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Occupancy Trend</CardTitle>
            <CardDescription>Monthly occupancy rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.occupancyTrend.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{data.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.occupancy}%` }} />
                    </div>
                    <span className="text-sm">{data.occupancy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Type Performance & Guest Origin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Type Performance */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Room Type Performance</CardTitle>
            <CardDescription>Bookings and revenue by room type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.roomTypePerformance.map((data) => (
                <div key={data.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{data.type}</span>
                    <span className="text-sm text-gray-600">{data.bookings} bookings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${(data.revenue / Math.max(...analyticsData.roomTypePerformance.map((d) => d.revenue))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm">₹{data.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Guest Origin */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Guest Origin</CardTitle>
            <CardDescription>Where your guests are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.guestOrigin.map((data) => (
                <div key={data.location} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{data.location}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{
                          width: `${(data.count / Math.max(...analyticsData.guestOrigin.map((d) => d.count))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm">{data.count} guests</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
