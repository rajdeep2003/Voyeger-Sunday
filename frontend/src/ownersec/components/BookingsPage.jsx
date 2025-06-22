"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useEffect } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Calendar, Search, Phone, Mail } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function BookingsPage() {
  const { user, setUser, setProfileOpen, isLoading, setIsLoading } =
  useAppContext();
  console.log("user bkp", user);

  const [hotelData, setHotelData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Transform API data to match UI structure
  const transformBookings = (hotelData) => {
    if (!hotelData?.bookingstatus) return [];
    
    const totalBookings = hotelData.bookingstatus.length;
    
    // Filter out empty bookings (empty bookingId, checkIn, checkOut)
    const validBookings = hotelData.bookingstatus.filter(booking => {
      const hasValidBookingId = booking.bookingId && booking.bookingId.trim() !== "";
      const hasValidCheckIn = booking.checkIn && booking.checkIn.trim() !== "";
      const hasValidCheckOut = booking.checkOut && booking.checkOut.trim() !== "";
      
      return hasValidBookingId && hasValidCheckIn && hasValidCheckOut;
    });
    
    const emptyBookings = totalBookings - validBookings.length;
    
    console.log("📊 Booking Filtering:");
    console.log("  - Total rooms in data:", totalBookings);
    console.log("  - Valid bookings (occupied):", validBookings.length);
    console.log("  - Empty rooms (available):", emptyBookings);
    
    return validBookings.map(booking => {
      // Calculate nights
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      
      // Calculate total amount based on room type price
      const roomType = hotelData.roomTypes?.find(rt => rt.type === booking.roomType);
      const pricePerNight = roomType?.price || 0;
      const totalAmount = nights * pricePerNight;
      
      // Calculate status based on dates
      const today = new Date();
      const status = getBookingStatus(checkInDate, checkOutDate, today);
      
      return {
        id: booking.bookingId,
        _id: booking._id,
        guestName: booking.userId || "Guest",
        guestEmail: booking.email || "",
        guestPhone: booking.phone || "",
        roomNumber: booking.roomId,
        roomType: booking.roomType,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        status: status,
        totalAmount: totalAmount,
        nights: nights,
      };
    });
  };

  // Calculate booking status based on dates
  const getBookingStatus = (checkIn, checkOut, today) => {
    if (today < checkIn) return "confirmed";
    if (today >= checkIn && today < checkOut) return "checked-in";
    if (today >= checkOut) return "checked-out";
    return "confirmed";
  };

  // Get room statistics
  const getRoomStats = (hotelData) => {
    if (!hotelData?.bookingstatus) return { total: 0, occupied: 0, available: 0 };
    
    const totalRooms = hotelData.bookingstatus.length;
    const today = new Date();
    
    // Count occupied rooms (currently checked-in)
    const occupiedRooms = hotelData.bookingstatus.filter(booking => {
      const hasValidBookingId = booking.bookingId && booking.bookingId.trim() !== "";
      const hasValidCheckIn = booking.checkIn && booking.checkIn.trim() !== "";
      const hasValidCheckOut = booking.checkOut && booking.checkOut.trim() !== "";
      
      if (!hasValidBookingId || !hasValidCheckIn || !hasValidCheckOut) return false;
      
      // Check if room is currently occupied (checked-in but not checked-out)
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      
      return checkInDate <= today && today < checkOutDate;
    }).length;
    
    const availableRooms = totalRooms - occupiedRooms;
    
    console.log("🏨 Room Statistics:");
    console.log("  - Total rooms:", totalRooms);
    console.log("  - Currently occupied:", occupiedRooms);
    console.log("  - Available (including checked-out):", availableRooms);
    
    return {
      total: totalRooms,
      occupied: occupiedRooms,
      available: availableRooms
    };
  };

  // Get bookings from API data
  const bookings = transformBookings(hotelData);
  const roomStats = getRoomStats(hotelData);

  const filteredBookings = bookings.filter((booking) => {
    const searchTermLower = searchTerm.toLowerCase();
    
    // Check for search term match
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTermLower) ||
      booking.roomNumber.toLowerCase().includes(searchTermLower) ||
      booking.id.toLowerCase().includes(searchTermLower);
      
    // Check for status filter match
    const matchesFilter =
      filterStatus === "all" || booking.status === filterStatus;
      
    return matchesSearch && matchesFilter;
  });

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
          console.log("Individual hotel data for user bkp:", data);
          setHotelData(data);
          
          // Log the data directly instead of the state variable
          console.log("Hotel data set: bkp", data);
        } catch (error) {
          console.error("Error fetching individual hotel bkp:", error);
        }
      }
    };
    fetchIndividualHotel();
  }, [user?.name]);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "checked-in":
        return "bg-green-100 text-green-800";
      case "checked-out":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1508614999368-9260051292e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3JhZGllbnR8ZW58MHx8MHx8fDA%3D')",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Room Statistics */}
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle>Room Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{roomStats.total}</div>
                <div className="text-sm text-gray-600">Total Rooms</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{roomStats.occupied}</div>
                <div className="text-sm text-gray-600">Occupied Rooms</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{roomStats.available}</div>
                <div className="text-sm text-gray-600">Available Rooms</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle>Search & Filter Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by guest name, room number, or booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "confirmed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("confirmed")}
                  size="sm"
                >
                  Confirmed
                </Button>
                <Button
                  variant={
                    filterStatus === "checked-in" ? "default" : "outline"
                  }
                  onClick={() => setFilterStatus("checked-in")}
                  size="sm"
                >
                  Checked In
                </Button>
                <Button
                  variant={
                    filterStatus === "checked-out" ? "default" : "outline"
                  }
                  onClick={() => setFilterStatus("checked-out")}
                  size="sm"
                >
                  Checked Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card
              key={booking._id}
              className="hover:shadow-md transition-shadow bg-white"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {booking.guestName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Booking ID: {booking.id}
                        </p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Room</p>
                        <p className="font-medium">
                          {booking.roomNumber} - {booking.roomType}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Check-in</p>
                        <p className="font-medium">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Check-out</p>
                        <p className="font-medium">
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Amount</p>
                        <p className="font-medium">
                          ₹{booking.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{booking.guestEmail}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{booking.guestPhone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.nights} nights</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {booking.status === "confirmed" && (
                        <Button size="sm">Check In</Button>
                      )}
                      {booking.status === "checked-in" && (
                        <Button size="sm" variant="secondary">
                          Check Out
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
