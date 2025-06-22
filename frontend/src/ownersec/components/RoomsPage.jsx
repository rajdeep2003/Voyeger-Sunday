"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Bed, Users, Wifi, Car, Coffee, Tv, Bath } from "lucide-react"
import { useAppContext } from "../../context/AppContext"

export default function RoomsPage() {
  const { user } = useAppContext()
  const [hotelData, setHotelData] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    // Fetch individual hotel data by user name
    const fetchIndividualHotel = async () => {
      if (user?.name) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/hotels/name/${encodeURIComponent(
              user.name
            )}`
          )
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          setHotelData(data)
        } catch (error) {
          console.error("Error fetching individual hotel:", error)
        }
      }
    }
    fetchIndividualHotel()
  }, [user?.name])

  const transformRooms = (data) => {
    if (!data || !data.bookingstatus) {
      console.log("RoomsPage: 🟡 Waiting for hotelData...");
      return [];
    }
    console.log("RoomsPage: 🚀 Starting room transformation with hotelData:", data);

    const today = new Date();
    console.log(`RoomsPage: 📅 Current Date for status check: ${today.toISOString()}`);

    const transformed = data.bookingstatus.map((room, index) => {
      console.log(`RoomsPage: --- Processing Room #${index + 1} (ID: ${room.roomId}) ---`);
      
      const roomTypeDetails = data.roomTypes?.find(rt => rt.type === room.roomType) || {};
      if (!roomTypeDetails.type) {
        console.warn(`  ⚠️ No roomTypeDetails found for type: "${room.roomType}"`);
      }

      const checkInDate = room.checkIn ? new Date(room.checkIn) : null;
      const checkOutDate = room.checkOut ? new Date(room.checkOut) : null;
      
      let status = "available";
      let isOccupied = false;
      if (checkInDate && checkOutDate && checkInDate <= today && today < checkOutDate) {
        status = "occupied";
        isOccupied = true;
      }
      
      console.log(`  - Check-in: ${room.checkIn}, Check-out: ${room.checkOut}`);
      console.log(`  - Is Occupied? ${isOccupied} -> Status: ${status}`);

      return {
        id: room._id,
        number: room.roomId,
        type: room.roomType,
        price: roomTypeDetails.price || 0,
        status: status,
        currentGuest: status === 'occupied' ? (room.userId || "N/A") : null,
        checkOut: status === 'occupied' ? room.checkOut : null,
        amenities: data.amenities || ["wifi", "tv", "bathroom"], 
      };
    });

    console.log("RoomsPage: ✅ Transformation complete. Final `rooms` array:", transformed);
    return transformed;
  };
  
  const rooms = transformRooms(hotelData);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="w-4 h-4" />
      case "tv":
        return <Tv className="w-4 h-4" />
      case "parking":
        return <Car className="w-4 h-4" />
      case "minibar":
        return <Coffee className="w-4 h-4" />
      case "bathroom":
        return <Bath className="w-4 h-4" />
      default:
        return <Bed className="w-4 h-4" />
    }
  }

  const filteredRooms = rooms.filter((room) => {
    const matchesStatus = filterStatus === "all" || room.status === filterStatus
    const matchesType = filterType === "all" || room.type === filterType
    return matchesStatus && matchesType
  })

  console.log(`RoomsPage: 🔍 Filtering rooms with status: "${filterStatus}" and type: "${filterType}"`);
  console.log(`RoomsPage: 👉 Found ${filteredRooms.length} rooms after filtering.`);

  const roomStats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "available").length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    // Other statuses like 'cleaning', 'maintenance' are not in the API data
    cleaning: 0,
    maintenance: 0, 
  }
  
  console.log("RoomsPage: 📊 Calculated final room stats:", roomStats);

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508614999368-9260051292e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3JhZGllbnR8ZW58MHx8MHx8fDA%3D')" }}>
 
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Room Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{roomStats.total}</div>
            <div className="text-sm text-gray-600">Total Rooms</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{roomStats.available}</div>
            <div className="text-sm text-gray-600">Available</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{roomStats.occupied}</div>
            <div className="text-sm text-gray-600">Occupied</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{roomStats.cleaning}</div>
            <div className="text-sm text-gray-600">Cleaning</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{roomStats.maintenance}</div>
            <div className="text-sm text-gray-600">Maintenance</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-white">
        <CardHeader>
          <CardTitle>Filter Rooms</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <div className="flex gap-2">
              <Button variant={filterStatus === 'all' ? 'default' : 'outline'} onClick={() => setFilterStatus('all')} size="sm">All</Button>
              <Button variant={filterStatus === 'available' ? 'default' : 'outline'} onClick={() => setFilterStatus('available')} size="sm">Available</Button>
              <Button variant={filterStatus === 'occupied' ? 'default' : 'outline'} onClick={() => setFilterStatus('occupied')} size="sm">Occupied</Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Room Type</label>
            <div className="flex gap-2">
              <Button variant={filterType === 'all' ? 'default' : 'outline'} onClick={() => setFilterType('all')} size="sm">All Types</Button>
              {hotelData?.roomTypes?.map(rt => (
                <Button key={rt._id} variant={filterType === rt.type ? 'default' : 'outline'} onClick={() => setFilterType(rt.type)} size="sm">{rt.type}</Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Room {room.number}</CardTitle>
                <Badge className={getStatusColor(room.status)}>{room.status.toUpperCase()}</Badge>
              </div>
              <CardDescription>{room.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-lg font-semibold mb-4">
                ₹{room.price.toLocaleString()}{" "}
                <span className="text-sm font-normal text-gray-500 ml-1">/ night</span>
              </div>

              {room.status === 'occupied' && room.currentGuest && (
                <div className="mb-4 p-3 bg-red-50 rounded-md">
                  <p className="text-sm font-semibold text-red-800">Currently Occupied</p>
                  <p className="text-sm text-gray-700">Guest: {room.currentGuest}</p>
                  <p className="text-sm text-gray-700">Check-out: {new Date(room.checkOut).toLocaleDateString()}</p>
                </div>
              )}
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-800 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      {getAmenityIcon(amenity)}
                      <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">View Details</Button>
                {room.status === 'available' && <Button size="sm">Create Booking</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600">Try adjusting your filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
    </div>
  )
}
