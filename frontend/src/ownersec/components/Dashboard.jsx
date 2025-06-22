"use client";

import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar, Users, Bed, TrendingUp } from "lucide-react";

export default function Dashboard({ onNavigate }) {
  const { user, setUser, setProfileOpen, isLoading, setIsLoading } =
    useAppContext();
  console.log("user", user);
  
  const [hotelData, setHotelData] = useState(null);

  // Console log hotelData whenever it changes
  console.log("hotelData state:", hotelData);

  // Utility: Get today's date in IST (YYYY-MM-DD)
  function getTodayIST() {
    return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  }

  // 1. Total Bookings (only valid bookings)
  function getTotalBookings(hotelData) {
    if (!hotelData?.bookingstatus) {
      console.log("❌ No bookingstatus found in hotelData");
      return 0;
    }
    
    const validBookings = hotelData.bookingstatus.filter(
      (b) => b.bookingId && b.checkIn && b.checkOut
    );
    
    console.log("📊 Total Bookings Calculation:");
    console.log("  - Total bookings in data:", hotelData.bookingstatus.length);
    console.log("  - Valid bookings (with bookingId):", validBookings.length);
    console.log("  - Invalid bookings:", hotelData.bookingstatus.length - validBookings.length);
    
    return validBookings.length;
  }

  // 2. Occupancy Rate (%)
  function getOccupancyRate(hotelData) {
    if (!hotelData?.bookingstatus || !hotelData?.roomTypes) {
      console.log("❌ Missing bookingstatus or roomTypes");
      return 0;
    }
    
    const today = getTodayIST();
    console.log("📅 Today's date (IST):", today);
    
    const totalRooms = hotelData.roomTypes.reduce(
      (sum, r) => sum + parseInt(r.total),
      0
    );
    console.log("🏨 Total rooms from roomTypes:", totalRooms);

    const currentlyOccupied = hotelData.bookingstatus.filter((b) => {
      if (!b.bookingId || !b.checkIn || !b.checkOut) return false;
      
      // Fix date comparison
      const checkInDate = new Date(b.checkIn);
      const checkOutDate = new Date(b.checkOut);
      const todayDate = new Date(today);
      
      const isOccupied = checkInDate <= todayDate && todayDate < checkOutDate;
      
      if (isOccupied) {
        console.log(`  ✅ Room ${b.roomId} (${b.roomType}) occupied: ${b.checkIn} to ${b.checkOut}`);
      }
      
      return isOccupied;
    }).length;

    console.log("📊 Occupancy Calculation:");
    console.log("  - Currently occupied rooms:", currentlyOccupied);
    console.log("  - Total rooms:", totalRooms);
    console.log("  - Occupancy rate:", totalRooms > 0 ? ((currentlyOccupied / totalRooms) * 100).toFixed(2) : "0.00");

    return totalRooms > 0 ? ((currentlyOccupied / totalRooms) * 100).toFixed(2) : "0.00";
  }

  // 3. Available Rooms
  function getAvailableRooms(hotelData) {
    if (!hotelData?.bookingstatus || !hotelData?.roomTypes) {
      console.log("❌ Missing bookingstatus or roomTypes for available rooms");
      return 0;
    }
    
    const today = getTodayIST();
    const totalRooms = hotelData.roomTypes.reduce(
      (sum, r) => sum + parseInt(r.total),
      0
    );

    const currentlyOccupied = hotelData.bookingstatus.filter((b) => {
      if (!b.bookingId || !b.checkIn || !b.checkOut) return false;
      
      const checkInDate = new Date(b.checkIn);
      const checkOutDate = new Date(b.checkOut);
      const todayDate = new Date(today);
      
      return checkInDate <= todayDate && todayDate < checkOutDate;
    }).length;

    const available = totalRooms - currentlyOccupied;
    console.log("🏠 Available Rooms:", available, `(${totalRooms} total - ${currentlyOccupied} occupied)`);

    return available;
  }

  // 4. Revenue (USD)
  function getRevenue(hotelData) {
    if (!hotelData?.bookingstatus || !hotelData?.roomTypes) {
      console.log("❌ Missing bookingstatus or roomTypes for revenue");
      return 0;
    }
    
    const priceMap = {};
    hotelData.roomTypes.forEach((r) => {
      priceMap[r.type] = parseInt(r.price);
    });
    console.log("💰 Room type prices:", priceMap);

    let totalRevenue = 0;
    const revenueBreakdown = [];

    hotelData.bookingstatus.forEach((b) => {
      if (!b.bookingId || !b.checkIn || !b.checkOut) return;

      const checkInDate = new Date(b.checkIn);
      const checkOutDate = new Date(b.checkOut);
      const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
      const rate = priceMap[b.roomType] || 0;
      const bookingRevenue = nights * rate;

      totalRevenue += bookingRevenue;
      
      revenueBreakdown.push({
        roomId: b.roomId,
        roomType: b.roomType,
        nights: nights,
        rate: rate,
        revenue: bookingRevenue,
        dates: `${b.checkIn} to ${b.checkOut}`
      });
    });

    console.log("💰 Revenue Calculation:");
    console.log("  - Total revenue:", totalRevenue);
    console.log("  - Revenue breakdown:", revenueBreakdown);

    return totalRevenue;
  }

  // 5. Today's Check-ins
  function getTodaysCheckins(hotelData) {
    if (!hotelData?.bookingstatus) {
      console.log("❌ No bookingstatus for check-ins");
      return 0;
    }
    
    const today = getTodayIST();
    const todaysCheckins = hotelData.bookingstatus.filter((b) => 
      b.bookingId && b.checkIn === today
    );
    
    console.log("📥 Today's Check-ins:", todaysCheckins.length);
    if (todaysCheckins.length > 0) {
      todaysCheckins.forEach(b => {
        console.log(`  - ${b.roomId} (${b.roomType}) - ${b.email}`);
      });
    }
    
    return todaysCheckins.length;
  }

  // 6. Today's Check-outs
  function getTodaysCheckouts(hotelData) {
    if (!hotelData?.bookingstatus) {
      console.log("❌ No bookingstatus for check-outs");
      return 0;
    }
    
    const today = getTodayIST();
    const todaysCheckouts = hotelData.bookingstatus.filter((b) => 
      b.bookingId && b.checkOut === today
    );
    
    console.log("📤 Today's Check-outs:", todaysCheckouts.length);
    if (todaysCheckouts.length > 0) {
      todaysCheckouts.forEach(b => {
        console.log(`  - ${b.roomId} (${b.roomType}) - ${b.email}`);
      });
    }
    
    return todaysCheckouts.length;
  }

  // Calculate dynamic stats
  const stats = {
    totalBookings: getTotalBookings(hotelData),
    todayCheckIns: getTodaysCheckins(hotelData),
    todayCheckOuts: getTodaysCheckouts(hotelData),
    occupancyRate: getOccupancyRate(hotelData),
    availableRooms: getAvailableRooms(hotelData),
    totalRooms: hotelData?.roomTypes ? hotelData.roomTypes.reduce((sum, r) => sum + parseInt(r.total), 0) : 0,
    revenue: getRevenue(hotelData),
  };

  // Log calculated stats
  console.log("Total Bookings:", stats.totalBookings);
  console.log("Occupancy Rate (%):", stats.occupancyRate);
  console.log("Available Rooms:", stats.availableRooms);
  console.log("Total Revenue ($):", stats.revenue);
  console.log("Today's Check-ins:", stats.todayCheckIns);
  console.log("Today's Check-outs:", stats.todayCheckOuts);

  // Fetch hotels on component mount
  useEffect(() => {
    // Fetch individual hotel data by user name
    const fetchIndividualHotel = async () => {
      if (user?.name) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/hotels/name/${encodeURIComponent(
              user.name
            )}`
          );
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("Individual hotel data for user:", data);
          setHotelData(data);
          
          // Log the data directly instead of the state variable
          console.log("Hotel data set:", data);
        } catch (error) {
          console.error("Error fetching individual hotel:", error);
        }
      }
    };
    fetchIndividualHotel();
  }, [user?.name]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1508614999368-9260051292e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3JhZGllbnR8ZW58MHx8MHx8fDA%3D')",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {/* Hotel Info Header */}
        {hotelData && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{hotelData.name}</h1>
            <p className="text-white/80">{hotelData.location}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
          <Card className="bg-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Occupancy Rate
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalRooms - stats.availableRooms} of {stats.totalRooms}{" "}
                rooms occupied
              </p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Rooms
              </CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableRooms}</div>
              <p className="text-xs text-muted-foreground">Ready for booking</p>
            </CardContent>
          </Card>

          <Card className="bg-green-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{stats.revenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-green-100">
            <CardHeader>
              <CardTitle>Today's Check-ins</CardTitle>
              <CardDescription>Guests arriving today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.todayCheckIns}
              </div>
              <p className="text-sm text-gray-600">Expected arrivals</p>
            </CardContent>
          </Card>

          <Card className="bg-indigo-100">
            <CardHeader>
              <CardTitle>Today's Check-outs</CardTitle>
              <CardDescription>Guests departing today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.todayCheckOuts}
              </div>
              <p className="text-sm text-gray-600">Expected departures</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your hotel operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
              <Button
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-1 border-black bg-blue-100 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:border-blue-500 rounded-lg p-4 active:scale-95 cursor-pointer"
                onClick={() => onNavigate("bookings")}
              >
                <Calendar className="w-6 h-6" />
                <span>View Bookings</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-amber-100 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:border-blue-500  rounded-lg p-4 active:scale-95 cursor-pointer"
                onClick={() => onNavigate("rooms")}
              >
                <Bed className="w-6 h-6" />
                <span>Manage Rooms</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-purple-100 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:border-blue-500  rounded-lg p-4 active:scale-95 cursor-pointer"
                onClick={() => onNavigate("analytics")}
              >
                <TrendingUp className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
