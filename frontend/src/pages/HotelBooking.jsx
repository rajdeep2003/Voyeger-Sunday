"use client";
import { useState, useRef, useEffect } from "react";
import { HotelCard } from "./hotel-card";
import GameSelector from "./GameSelector";
import { MapPin } from "./icons";
import jsPDF from "jspdf";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

export default function HotelBooking() {
  const { userDetails } = useAppContext();
  const [hotels, setHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([200, 400]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [discount, setDiscount] = useState(null);
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [roomType, setRoomType] = useState("standard");
  const [sidebarRooms, setSidebarRooms] = useState(1);
  const gameSelectorRef = useRef(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentSimButtons, setShowPaymentSimButtons] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [activeGalleryCategory, setActiveGalleryCategory] = useState("all");
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: "Sarah M.",
      rating: 5,
      title: "Excellent Service",
      comment:
        "Amazing stay! The staff was incredibly helpful and the rooms were spotless. Great location and excellent amenities.",
      date: "2 days ago",
      verified: true,
    },
    {
      id: 2,
      userName: "John D.",
      rating: 4,
      title: "Great Value",
      comment:
        "Good hotel with comfortable rooms and friendly staff. The breakfast was delicious and the location is perfect for exploring the city.",
      date: "1 week ago",
      verified: true,
    },
    {
      id: 3,
      userName: "Maria L.",
      rating: 5,
      title: "Perfect Location",
      comment:
        "The hotel is perfectly located in the city center. Walking distance to all major attractions. The pool area is beautiful and well-maintained.",
      date: "2 weeks ago",
      verified: true,
    },
  ]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Enhanced gallery data structure
  const getEnhancedGallery = (hotel) => {
    // In a real application, this would come from the hotel data
    // For demo purposes, we'll create categorized images
    const baseImages = hotel.images || ["/placeholder.svg"];

    return {
      all: baseImages,
      hotel: [
        baseImages[0] ||
          "/placeholder.svg?height=400&width=600&text=Hotel+Exterior",
        "/placeholder.svg?height=400&width=600&text=Hotel+Lobby",
        "/placeholder.svg?height=400&width=600&text=Hotel+Reception",
        "/placeholder.svg?height=400&width=600&text=Hotel+Restaurant",
      ],
      rooms: [
        "/placeholder.svg?height=400&width=600&text=Standard+Room",
        "/placeholder.svg?height=400&width=600&text=Deluxe+Room",
        "/placeholder.svg?height=400&width=600&text=Suite+Room",
        "/placeholder.svg?height=400&width=600&text=Bathroom",
      ],
      amenities: [
        "/placeholder.svg?height=400&width=600&text=Swimming+Pool",
        "/placeholder.svg?height=400&width=600&text=Fitness+Center",
        "/placeholder.svg?height=400&width=600&text=Spa+Area",
        "/placeholder.svg?height=400&width=600&text=Restaurant+Dining",
      ],
      dining: [
        "/placeholder.svg?height=400&width=600&text=Main+Restaurant",
        "/placeholder.svg?height=400&width=600&text=Bar+Lounge",
        "/placeholder.svg?height=400&width=600&text=Breakfast+Area",
        "/placeholder.svg?height=400&width=600&text=Room+Service",
      ],
    };
  };

  // Enhanced attractions data
  const getNearbyAttractions = () => {
    return [
      {
        name: "City Museum",
        category: "Culture",
        distance: "0.8 km",
        walkTime: "10 min walk",
        rating: 4.5,
        description: "Historic museum showcasing local art and culture",
        icon: "🏛️",
      },
      {
        name: "Central Shopping Mall",
        category: "Shopping",
        distance: "1.2 km",
        walkTime: "15 min walk",
        rating: 4.3,
        description: "Large shopping complex with international brands",
        icon: "🛍️",
      },
      {
        name: "Riverside Park",
        category: "Nature",
        distance: "0.5 km",
        walkTime: "6 min walk",
        rating: 4.7,
        description: "Beautiful park with walking trails and lake views",
        icon: "🌳",
      },
      {
        name: "Historic Cathedral",
        category: "Religious",
        distance: "1.5 km",
        walkTime: "18 min walk",
        rating: 4.6,
        description: "Stunning 18th-century cathedral with guided tours",
        icon: "⛪",
      },
      {
        name: "Night Market",
        category: "Food & Dining",
        distance: "0.7 km",
        walkTime: "8 min walk",
        rating: 4.4,
        description: "Vibrant night market with local street food",
        icon: "🍜",
      },
      {
        name: "Art Gallery District",
        category: "Culture",
        distance: "2.1 km",
        walkTime: "25 min walk",
        rating: 4.2,
        description: "Contemporary art galleries and studios",
        icon: "🎨",
      },
    ];
  };

  // Enhanced transportation data
  const getTransportationOptions = () => {
    return {
      airports: [
        {
          name: "International Airport",
          distance: "15 km",
          travelTime: "25-30 min",
          transportModes: ["Taxi", "Airport Shuttle", "Metro"],
          cost: "₹300-500",
          icon: "✈️",
        },
        {
          name: "Domestic Airport",
          distance: "22 km",
          travelTime: "35-40 min",
          transportModes: ["Taxi", "Bus"],
          cost: "₹400-600",
          icon: "🛩️",
        },
      ],
      railways: [
        {
          name: "Central Railway Station",
          distance: "3.2 km",
          travelTime: "8-12 min",
          transportModes: ["Taxi", "Metro", "Bus"],
          cost: "₹50-150",
          icon: "🚂",
        },
        {
          name: "Metro Station (Blue Line)",
          distance: "300 m",
          travelTime: "3-5 min walk",
          transportModes: ["Walking"],
          cost: "Free",
          icon: "🚇",
        },
      ],
      busStations: [
        {
          name: "City Bus Terminal",
          distance: "2.8 km",
          travelTime: "10-15 min",
          transportModes: ["Taxi", "Local Bus"],
          cost: "₹30-100",
          icon: "🚌",
        },
        {
          name: "Interstate Bus Stand",
          distance: "5.5 km",
          travelTime: "15-20 min",
          transportModes: ["Taxi", "Metro + Bus"],
          cost: "₹80-200",
          icon: "🚐",
        },
      ],
      ports: [
        {
          name: "City Port",
          distance: "8.5 km",
          travelTime: "20-25 min",
          transportModes: ["Taxi", "Bus"],
          cost: "₹150-300",
          icon: "🚢",
        },
      ],
      localTransport: [
        {
          name: "Taxi Stand",
          distance: "100 m",
          travelTime: "1 min walk",
          transportModes: ["Walking"],
          cost: "Free",
          icon: "🚕",
        },
        {
          name: "Bus Stop",
          distance: "150 m",
          travelTime: "2 min walk",
          transportModes: ["Walking"],
          cost: "Free",
          icon: "🚏",
        },
        {
          name: "Bike Rental Station",
          distance: "200 m",
          travelTime: "2 min walk",
          transportModes: ["Walking"],
          cost: "Free",
          icon: "🚲",
        },
      ],
    };
  };

  // Fetch hotels on component mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/hotels");
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  // Sync sidebarRooms and rooms
  useEffect(() => {
    setRooms(sidebarRooms);
  }, [sidebarRooms]);

  // Filter hotels based on search query and price range
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase());

    const hasRoomInPriceRange = hotel.roomTypes.some(
      (rt) => rt.price >= priceRange[0] && rt.price <= priceRange[1]
    );

    const desiredCheckIn = new Date(checkInDate);
    const desiredCheckOut = new Date(checkOutDate);

    const matchingRooms = hotel.bookingstatus.filter((room) => {
      if (room.roomType.toLowerCase() !== roomType.toLowerCase()) return false;

      if (!room.bookingId) return true;

      const roomIn = new Date(room.checkIn);
      const roomOut = new Date(room.checkOut);

      const noOverlap = desiredCheckOut <= roomIn || desiredCheckIn >= roomOut;

      return noOverlap;
    });

    const hasEnoughAvailableRooms =
      !checkInDate || !checkOutDate || !roomType || !sidebarRooms
        ? true
        : matchingRooms.length >= sidebarRooms;

    return matchesSearch && hasRoomInPriceRange && hasEnoughAvailableRooms;
  });

  useEffect(() => {
    if (selectedHotel) {
      // Set main image
      const gallery = getEnhancedGallery(selectedHotel);
      setMainImage(gallery.all[0] || null);

      // Set default room type
      const defaultType = selectedHotel.roomTypes.find(
        (rt) => rt.available > 0
      );
      if (defaultType) setRoomType(defaultType.type);
    }
  }, [selectedHotel]);

  const calculateDays = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const getBasePrice = () => {
    if (!selectedHotel) return 0;
    const selectedRoomType = selectedHotel.roomTypes.find(
      (rt) => rt.type.toLowerCase() === roomType.toLowerCase()
    );
    return selectedRoomType ? selectedRoomType.price : 0;
  };

  const calculateTotalPrice = () => {
    const basePrice = getBasePrice();
    const days = calculateDays();
    return basePrice * days * rooms;
  };

  const calculateFinalPrice = () => {
    const total = calculateTotalPrice();
    const discounted = discount ? total - total * (discount / 100) : total;
    return Math.round(discounted * 1.12); // 12% tax
  };

  const handleBookNow = (hotelId) => {
    console.log("🎯 HotelBooking: handleBookNow called with hotelId:", hotelId);

    const hotel = hotels.find((h) => h._id === hotelId);
    console.log("🎯 HotelBooking: Found hotel:", hotel);
    console.log("🎯 HotelBooking: Hotel details:", {
      id: hotel?._id,
      name: hotel?.name,
      location: hotel?.location,
      rating: hotel?.rating,
      price: hotel?.price,
      roomTypes: hotel?.roomTypes,
    });

    setSelectedHotel(hotel);
    const gallery = getEnhancedGallery(hotel);
    setMainImage(gallery.all[0] || null);
    setShowGameSelector(false);
    setDiscount(null);
    setActiveGalleryCategory("all");

    // Set initial room type to the first available room type
    const firstAvailableRoomType = hotel.roomTypes.find(
      (rt) => rt.available > 0
    );
    if (firstAvailableRoomType) {
      setRoomType(firstAvailableRoomType.type);
      console.log(
        "🎯 HotelBooking: Set initial room type to:",
        firstAvailableRoomType.type
      );
    }

    console.log("🎯 HotelBooking: Hotel selection completed for:", hotel?.name);
  };

  const handleBackToResults = () => {
    setSelectedHotel(null);
    setShowGameSelector(false);
  };

  const handleDiscountWon = (discountAmount) => setDiscount(discountAmount);

  const handleDiscountClick = () => {
    setShowGameSelector(true);
    setTimeout(
      () => gameSelectorRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  useEffect(() => {
    if (showGameSelector && gameSelectorRef.current) {
      gameSelectorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showGameSelector]);

  const getGoogleMapsLink = (hotel) => {
    return `https://www.google.com/maps/search/?api=1&query=${hotel.geolocation.latitude},${hotel.geolocation.longitude}`;
  };

  const EnhancedImageGallery = ({ hotel }) => {
    const gallery = getEnhancedGallery(hotel);
    const categories = [
      { id: "all", label: "All Photos", count: gallery.all.length },
      { id: "hotel", label: "Hotel", count: gallery.hotel.length },
      { id: "rooms", label: "Rooms", count: gallery.rooms.length },
      { id: "amenities", label: "Amenities", count: gallery.amenities.length },
      { id: "dining", label: "Dining", count: gallery.dining.length },
    ];

    const currentImages = gallery[activeGalleryCategory] || gallery.all;

    return (
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-lg shadow-lg aspect-video group">
          <img
            src={mainImage || currentImages[0]}
            alt={`${hotel.name} main view`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImages.length} photos
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveGalleryCategory(category.id);
                setMainImage(gallery[category.id][0]);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                activeGalleryCategory === category.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {currentImages.slice(0, 12).map((img, idx) => (
            <div
              key={idx}
              onClick={() => setMainImage(img)}
              className={`aspect-square cursor-pointer rounded-md overflow-hidden ring-2 transition-all hover:ring-blue-500 ${
                img === mainImage
                  ? "ring-blue-600 scale-105"
                  : "ring-transparent"
              }`}
            >
              <img
                src={img || "/placeholder.svg"}
                alt={`${activeGalleryCategory} ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {currentImages.length > 12 && (
            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm font-medium">
              +{currentImages.length - 12} more
            </div>
          )}
        </div>
      </div>
    );
  };

  const checkRoomAvailability = () => {
    if (!selectedHotel || !checkInDate || !checkOutDate) return false;

    const desiredCheckIn = new Date(checkInDate);
    const desiredCheckOut = new Date(checkOutDate);

    const availableRooms = selectedHotel.bookingstatus.filter((room) => {
      if (room.roomType.toLowerCase() !== roomType.toLowerCase()) return false;

      if (!room.bookingId) return true;

      const roomIn = new Date(room.checkIn);
      const roomOut = new Date(room.checkOut);

      return desiredCheckOut <= roomIn || desiredCheckIn >= roomOut;
    });

    return availableRooms.length >= rooms;
  };

  const handleBooking = () => {
    if (!checkRoomAvailability()) {
      alert("Sorry, not enough rooms available for your selection.");
      return;
    }
    // Proceed with booking
    handleDiscountClick();
  };

  //Call your backend /create-order,  Get the Razorpay order ID, Call new Razorpay(options).open()
  async function loadRazorpay(hotel) {
    console.log("razorpay hotel", hotel);
    const payload = {
      hotelId: hotel._id,
      amount: Number(calculateFinalPrice()),
    };
    const res = await fetch("http://localhost:5000/api/orders/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.order) {
      alert(data.message || "Order creation failed");
      return;
    }
    const order = data.order;
    const options = {
      key: "rzp_test_wb29ohYja8YQoG",
      amount: order.amount,
      currency: order.currency,
      name: "Voyeger Ltd.",
      description: `Booking ${hotel.name}`,
      order_id: order.id,
      handler: async (response) => {
        // No-op for simulation
      },
      theme: { color: "#000" },
    };
    const rzp = new Razorpay(options);
    rzp.open();
    setShowPaymentSimButtons(true); // Show Yes/No immediately
  }

  const handleSimulateYes = async () => {
    console.log(
      "📧 Frontend: handleSimulateYes called - Payment simulation successful"
    );
    console.log("📧 Frontend: Setting payment success state");

    setPaymentSuccess(true);
    setShowPaymentSimButtons(false);
    setPaymentError("");

    console.log("📧 Frontend: Starting hotel booking status update...");
    // Update hotel booking status
    const bookingUpdateSuccess = await updateHotelBookingStatus(
      selectedHotel.name,
      `bkg-${Date.now()}`,
      roomType,
      userDetails?.name,
      userDetails?.email,
      checkInDate,
      checkOutDate,
      rooms
    );

    if (bookingUpdateSuccess) {
      console.log(
        "📧 Frontend: Hotel booking status update completed successfully"
      );

      console.log("📧 Frontend: Starting email sending process...");
      // Send booking receipt email
      await sendBookingReceiptEmail();
      console.log("📧 Frontend: Email sending process completed");
    } else {
      console.error(
        "📧 Frontend: Hotel booking status update failed - not proceeding with email"
      );
      // Reset payment success state since booking failed
      setPaymentSuccess(false);
      setPaymentError(
        "Payment successful but booking failed. Please try again."
      );
    }
  };

  const sendBookingReceiptEmail = async () => {
    console.log("📧 Frontend: sendBookingReceiptEmail called");
    console.log("📧 Frontend: User details:", {
      name: userDetails?.name,
      email: userDetails?.email,
    });
    console.log("📧 Frontend: Selected hotel:", {
      name: selectedHotel?.name,
      location: selectedHotel?.location,
    });

    try {
      const bookingDetails = {
        userName: userDetails?.name || "",
        userEmail: userDetails?.email || "",
        hotelName: selectedHotel?.name,
        hotelLocation: selectedHotel?.location,
        roomType,
        rooms,
        checkIn: checkInDate || "Not selected",
        checkOut: checkOutDate || "Not selected",
        guests,
        specialRequests: "",
        price: getBasePrice(),
        discount: discount ?? 0,
        finalPrice: calculateFinalPrice(),
        paymentStatus: "Success",
        bookingDate: new Date().toLocaleString(),
        bookingId: `bkg-${Date.now()}`,
      };

      console.log("📧 Frontend: Prepared booking details:", bookingDetails);
      console.log("📧 Frontend: Making API call to /api/bookings/send-receipt");

      const response = await fetch(
        "http://localhost:5000/api/bookings/send-receipt",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingDetails),
        }
      );

      console.log("📧 Frontend: API response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      const data = await response.json();
      console.log("📧 Frontend: API response data:", data);

      if (data.success) {
        console.log(
          "📧 Frontend: Email sent successfully, showing success toast"
        );
        toast.success("Booking receipt email sent successfully");
      } else {
        console.error("📧 Frontend: Email sending failed, showing error toast");
        console.error("📧 Frontend: Error details:", data.message);
        toast.error(
          "Failed to send booking receipt email. Please try again later."
        );
      }
    } catch (error) {
      console.error("📧 Frontend: Exception occurred while sending email");
      console.error("📧 Frontend: Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      toast.error(
        "An error occurred while sending booking receipt email. Please try again later."
      );
    }
  };

  const updateHotelBookingStatus = async (
    hotelname,
    bookingId,
    roomType,
    name,
    email,
    checkInDate,
    checkOutDate,
    rooms
  ) => {
    try {
      console.log("🏨 Frontend: Starting hotel booking status update...");
      console.log("🏨 Frontend: Parameters:", {
        hotelname,
        bookingId,
        roomType,
        name,
        email,
        checkInDate,
        checkOutDate,
        rooms,
      });
      console.log("🏨 Frontend: Selected hotel name:", selectedHotel.name);

      // Step 1: Get current hotel data
      const response = await fetch(
        `http://localhost:5000/api/hotels/name/${selectedHotel.name}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(
        "🏨 Frontend: GET response status:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch hotel data: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("🏨 Frontend: Current hotel data:", data);
      console.log("🏨 Frontend: Current booking status:", data.bookingstatus);
      console.log(
        "🏨 Frontend: Booking status array length:",
        data.bookingstatus?.length || 0
      );

      // Step 2: Modify booking status
      let updatedCount = 0;

      for (
        let i = 0;
        i < data.bookingstatus.length && updatedCount < rooms;
        i++
      ) {
        const room = data.bookingstatus[i];
        console.log(`🏨 Frontend: Checking room ${i + 1}:`, room);

        const isSameRoomType =
          room.roomType.toLowerCase() === roomType.toLowerCase();
        const isEmptySlot =
          !room.bookingId ||
          room.bookingId.trim() === "" ||
          !room.checkIn ||
          room.checkIn.trim() === "" ||
          !room.checkOut ||
          room.checkOut.trim() === "" ||
          !room.email ||
          room.email.trim() === "" ||
          !room.userId ||
          room.userId.trim() === "";

        console.log(
          `🏨 Frontend: Room ${
            i + 1
          } - Same type: ${isSameRoomType}, Empty slot: ${isEmptySlot}`
        );

        if (isSameRoomType && isEmptySlot) {
          room.checkIn = checkInDate;
          room.checkOut = checkOutDate;
          room.bookingId = bookingId;
          room.userId = name;
          room.email = email;
          // Note: room.name is not part of the schema, so we don't set it

          updatedCount++;
          console.log(
            `🏨 Frontend: Updated room ${i + 1} with booking details:`,
            room
          );
        }
      }

      if (updatedCount === 0) {
        throw new Error(`No available rooms found for type: ${roomType}`);
      }

      if (updatedCount < rooms) {
        console.warn(
          `🏨 Frontend: Warning - Only ${updatedCount} rooms updated out of ${rooms} requested`
        );
      }

      console.log("🏨 Frontend: Updated hotel data:", data);
      console.log(`🏨 Frontend: Successfully updated ${updatedCount} rooms`);

      // Step 3: Send updated data back to backend
      console.log("🏨 Frontend: Sending PUT request to update hotel...");
      const updateResponse = await fetch(
        `http://localhost:5000/api/hotels/name/${selectedHotel.name}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      console.log(
        "🏨 Frontend: PUT response status:",
        updateResponse.status,
        updateResponse.statusText
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}));
        console.error(
          "🏨 Frontend: PUT request failed with error data:",
          errorData
        );
        throw new Error(
          `Failed to update hotel: ${updateResponse.status} ${
            updateResponse.statusText
          } - ${errorData.message || "Unknown error"}`
        );
      }

      const updateData = await updateResponse.json();
      console.log("🏨 Frontend: Server response after update:", updateData);

      if (updateData.message === "Hotel updated successfully") {
        console.log("🏨 Frontend: Hotel booking status updated successfully!");

        // Verify the update by fetching the hotel data again
        console.log("🏨 Frontend: Verifying the update...");
        const verifyResponse = await fetch(
          `http://localhost:5000/api/hotels/name/${selectedHotel.name}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          const updatedBookings = verifyData.bookingstatus.filter(
            (room) => room.bookingId === bookingId
          );

          console.log(
            "🏨 Frontend: Verification - Found updated bookings:",
            updatedBookings
          );

          if (updatedBookings.length > 0) {
            console.log("🏨 Frontend: ✅ Booking verification successful!");
            toast.success("Hotel booking status updated successfully!");
            return true;
          } else {
            console.error(
              "🏨 Frontend: ❌ Booking verification failed - no updated bookings found"
            );
            throw new Error("Booking was not properly saved to database");
          }
        } else {
          console.error("🏨 Frontend: ❌ Failed to verify booking update");
          throw new Error("Could not verify booking update");
        }
      } else {
        console.error(
          "🏨 Frontend: Server response does not confirm success:",
          updateData
        );
        throw new Error("Server did not confirm successful update");
      }
    } catch (error) {
      console.error("🏨 Frontend: Error updating hotel booking status:", error);
      toast.error(`Failed to update hotel booking: ${error.message}`);
      return false;
    }
  };

  const handleSimulateNo = () => {
    setPaymentSuccess(false);
    setShowPaymentSimButtons(false);
    setPaymentError("Payment failed. Please try again.");
  };

  const generateReceipt = () => {
    const details = {
      bookingId: Date.now(),
      userName: userDetails?.name || "",
      userEmail: userDetails?.email || "",
      hotelName: selectedHotel?.name,
      hotelLocation: selectedHotel?.location,
      roomType,
      rooms,
      checkIn: checkInDate || "Not selected",
      checkOut: checkOutDate || "Not selected",
      guests,
      specialRequests: "",
      price: getBasePrice(),
      discount: discount ?? 0,
      finalPrice: calculateFinalPrice(),
      paymentStatus: paymentSuccess ? "Success" : "Failed",
      bookingDate: new Date().toLocaleString(),
    };
    const doc = new jsPDF();
    // Draw border
    doc.setDrawColor(100);
    doc.setLineWidth(0.5);
    doc.rect(8, 8, 194, 275, "S");
    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Hotel Booking Receipt", 105, 22, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    let y = 35;
    // Section: Booking Info
    doc.setFont("helvetica", "bold");
    doc.text("Booking Information", 12, y);
    doc.setFont("helvetica", "normal");
    y += 8;
    doc.text(`Booking ID:`, 12, y);
    doc.text(`${details.bookingId}`, 60, y);
    y += 8;
    doc.text(`Booking Date:`, 12, y);
    doc.text(`${details.bookingDate}`, 60, y);
    y += 12;
    // Section: User Info
    doc.setFont("helvetica", "bold");
    doc.text("Guest Information", 12, y);
    doc.setFont("helvetica", "normal");
    y += 8;
    doc.text(`Name:`, 12, y);
    doc.text(`${details.userName}`, 60, y);
    y += 8;
    doc.text(`Email:`, 12, y);
    doc.text(`${details.userEmail}`, 60, y);
    y += 12;
    // Section: Hotel Info
    doc.setFont("helvetica", "bold");
    doc.text("Hotel Details", 12, y);
    doc.setFont("helvetica", "normal");
    y += 8;
    doc.text(`Hotel:`, 12, y);
    doc.text(`${details.hotelName}`, 60, y);
    y += 8;
    doc.text(`Location:`, 12, y);
    doc.text(`${details.hotelLocation}`, 60, y);
    y += 12;
    // Section: Stay Info
    doc.setFont("helvetica", "bold");
    doc.text("Stay Details", 12, y);
    doc.setFont("helvetica", "normal");
    y += 8;
    doc.text(`Room Type:`, 12, y);
    doc.text(`${details.roomType}`, 60, y);
    y += 8;
    doc.text(`Rooms:`, 12, y);
    doc.text(`${details.rooms}`, 60, y);
    y += 8;
    doc.text(`Check-in:`, 12, y);
    doc.text(`${details.checkIn}`, 60, y);
    y += 8;
    doc.text(`Check-out:`, 12, y);
    doc.text(`${details.checkOut}`, 60, y);
    y += 8;
    doc.text(`Guests:`, 12, y);
    doc.text(`${details.guests}`, 60, y);
    y += 8;
    doc.text(`Special Requests:`, 12, y);
    doc.text(`${details.specialRequests}`, 60, y);
    y += 12;
    // Section: Payment Info
    doc.setFont("helvetica", "bold");
    doc.text("Payment Summary", 12, y);
    doc.setFont("helvetica", "normal");
    y += 8;
    doc.text(`Base Price:`, 12, y);
    doc.text(`Rs${details.price}`, 60, y);
    y += 8;
    doc.text(`Discount:`, 12, y);
    doc.text(`${details.discount}%`, 60, y);
    y += 8;
    doc.text(`Final Price:`, 12, y);
    doc.text(`Rs${details.finalPrice}`, 60, y);
    y += 8;
    doc.text(`Payment Status:`, 12, y);
    doc.text(`${details.paymentStatus}`, 60, y);
    y += 12;
    // Thank you note
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Thank you for booking with Voyager!", 105, y, {
      align: "center",
    });
    doc.save("receipt.pdf");
  };

  // Test function to verify booking system
  const testBookingSystem = async () => {
    console.log("🧪 Frontend: Starting booking system test...");

    if (!selectedHotel) {
      console.error("🧪 Frontend: No hotel selected for testing");
      toast.error("Please select a hotel first");
      return;
    }

    const testBookingId = `test-${Date.now()}`;
    const testRoomType = roomType || "Standard";
    const testName = userDetails?.name || "Test User";
    const testEmail = userDetails?.email || "test@example.com";
    const testCheckIn = "2025-01-15";
    const testCheckOut = "2025-01-17";
    const testRooms = 1;

    console.log("🧪 Frontend: Test parameters:", {
      hotelName: selectedHotel.name,
      bookingId: testBookingId,
      roomType: testRoomType,
      name: testName,
      email: testEmail,
      checkIn: testCheckIn,
      checkOut: testCheckOut,
      rooms: testRooms,
    });

    try {
      const result = await updateHotelBookingStatus(
        selectedHotel.name,
        testBookingId,
        testRoomType,
        testName,
        testEmail,
        testCheckIn,
        testCheckOut,
        testRooms
      );

      if (result) {
        console.log("🧪 Frontend: ✅ Booking system test PASSED");
        toast.success("Booking system test PASSED!");
      } else {
        console.log("🧪 Frontend: ❌ Booking system test FAILED");
        toast.error("Booking system test FAILED!");
      }
    } catch (error) {
      console.error("🧪 Frontend: ❌ Booking system test ERROR:", error);
      toast.error(`Booking system test ERROR: ${error.message}`);
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!newReview.title.trim() || !newReview.comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!userDetails?.name) {
      toast.error("Please login to submit a review");
      return;
    }

    const review = {
      id: Date.now(),
      userName: userDetails.name,
      rating: newReview.rating,
      title: newReview.title.trim(),
      comment: newReview.comment.trim(),
      date: "Just now",
      verified: false,
    };

    setReviews((prevReviews) => [review, ...prevReviews]);
    setNewReview({ rating: 5, title: "", comment: "" });
    setShowReviewForm(false);
    setReviewSubmitted(true);
    toast.success("Review submitted successfully!");

    // Hide success message after 3 seconds
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return selectedHotel.rating;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  return (
    <div className="bg-blue-50 min-h-screen mt-10 p-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto py-6 space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="h-12 flex items-center justify-center rounded-xl bg-blue-800 text-3xl font-bold tracking-tight text-white shadow-md">
            Find Your Perfect Stay
          </h1>
          <p className="rounded-lg bg-blue-200 py-2 text-black">
            Search for hotels, compare prices, and book your ideal
            accommodation.
          </p>
        </header>

        {paymentError && (
          <div className="flex justify-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-xl w-full text-center">
              <strong className="font-bold">Payment Failed!</strong>
              <span className="block">{paymentError}</span>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <aside className="space-y-6">
            <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
              <div className="space-y-2">
                <h3 className="font-medium">Search</h3>
                <input
                  type="search"
                  placeholder="Destination, hotel name..."
                  className="w-full rounded-md border px-3 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Check‑in / Check‑out</h3>
                <div className="grid gap-2">
                  <input
                    type="date"
                    className="w-full rounded-md border px-3 py-2"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                  />
                  <input
                    type="date"
                    className="w-full rounded-md border px-3 py-2"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Room Type</h3>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Rooms Required</h3>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={sidebarRooms || 1}
                  onChange={(e) => setSidebarRooms(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Room" : "Rooms"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Price Range</h3>
                  <span className="text-sm text-gray-500">
                    Rs{priceRange[0]} - Rs{priceRange[1]}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      Number.parseInt(e.target.value),
                    ])
                  }
                  className="w-full"
                />
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([
                      Number.parseInt(e.target.value),
                      priceRange[1],
                    ])
                  }
                  className="w-full"
                />
              </div>

              <button className="w-full rounded-md bg-blue-600 py-2 px-4 font-medium text-white hover:bg-blue-700">
                Apply Filters
              </button>
            </div>
          </aside>

          <main className="space-y-6">
            {selectedHotel ? (
              <section className="space-y-6">
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                  {/* Header with back button and rating */}
                  <div className="flex items-center justify-between border-b p-4">
                    <button
                      onClick={handleBackToResults}
                      className="text-blue-600 hover:underline"
                    >
                      ← Back to results
                    </button>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      ⭐ {selectedHotel.rating}
                    </div>
                  </div>

                  {/* Hotel Title and Location */}
                  <div className="space-y-1 p-4 border-b">
                    <h2 className="text-2xl font-bold tracking-tight">
                      {selectedHotel.name}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedHotel.location}</span>
                      <a
                        href={getGoogleMapsLink(selectedHotel)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        (View on Map)
                      </a>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="border-b">
                    <nav className="flex space-x-8 px-4">
                      {[
                        { id: "overview", label: "Overview" },
                        { id: "rooms", label: "Rooms" },
                        { id: "amenities", label: "Amenities" },
                        { id: "reviews", label: "Reviews" },
                        { id: "policies", label: "Policies" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-4">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                      <div className="space-y-8">
                        {/* Enhanced Image Gallery */}
                        <div>
                          <EnhancedImageGallery hotel={selectedHotel} />
                        </div>

                        {/* Hotel Description */}
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-gray-800">
                            About This Hotel
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {selectedHotel.description ||
                              "Experience luxury and comfort at this exceptional hotel. Our property offers world-class amenities and services designed to make your stay memorable. Located in the heart of the city, we provide easy access to major attractions while ensuring a peaceful retreat."}
                          </p>

                          {/* Hotel Highlights */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-2xl mb-1">🏨</div>
                              <div className="text-sm font-medium text-gray-700">
                                Premium Hotel
                              </div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-2xl mb-1">✅</div>
                              <div className="text-sm font-medium text-gray-700">
                                Free Cancellation
                              </div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-2xl mb-1">🍳</div>
                              <div className="text-sm font-medium text-gray-700">
                                Breakfast Included
                              </div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                              <div className="text-2xl mb-1">📶</div>
                              <div className="text-sm font-medium text-gray-700">
                                Free WiFi
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Nearby Attractions */}
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-gray-800">
                            Nearby Attractions
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getNearbyAttractions().map((attraction, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="text-2xl">
                                    {attraction.icon}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="font-medium text-gray-800">
                                        {attraction.name}
                                      </h4>
                                      <div className="flex items-center gap-1 text-sm">
                                        <span className="text-yellow-500">
                                          ⭐
                                        </span>
                                        <span className="text-gray-600">
                                          {attraction.rating}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-sm text-blue-600 mb-1">
                                      {attraction.category}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                      {attraction.description}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <span>📍</span>
                                        {attraction.distance}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <span>🚶</span>
                                        {attraction.walkTime}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Transportation & Connectivity */}
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-gray-800">
                            Transportation & Connectivity
                          </h3>

                          {(() => {
                            const transport = getTransportationOptions();
                            return (
                              <div className="space-y-6">
                                {/* Airports */}
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <span className="text-lg">✈️</span>
                                    Airports
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {transport.airports.map(
                                      (airport, index) => (
                                        <div
                                          key={index}
                                          className="bg-blue-50 p-3 rounded-lg border"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-gray-800">
                                              {airport.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              {airport.distance}
                                            </div>
                                          </div>
                                          <div className="text-sm text-gray-600 mb-1">
                                            Travel time: {airport.travelTime}
                                          </div>
                                          <div className="text-sm text-gray-600 mb-1">
                                            Cost: {airport.cost}
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                            {airport.transportModes.map(
                                              (mode, idx) => (
                                                <span
                                                  key={idx}
                                                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                                >
                                                  {mode}
                                                </span>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* Railways */}
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <span className="text-lg">🚂</span>
                                    Railway Stations
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {transport.railways.map(
                                      (station, index) => (
                                        <div
                                          key={index}
                                          className="bg-green-50 p-3 rounded-lg border"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-gray-800">
                                              {station.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              {station.distance}
                                            </div>
                                          </div>
                                          <div className="text-sm text-gray-600 mb-1">
                                            Travel time: {station.travelTime}
                                          </div>
                                          <div className="text-sm text-gray-600 mb-1">
                                            Cost: {station.cost}
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                            {station.transportModes.map(
                                              (mode, idx) => (
                                                <span
                                                  key={idx}
                                                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                                                >
                                                  {mode}
                                                </span>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* Bus Stations */}
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <span className="text-lg">🚌</span>
                                    Bus Stations
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {transport.busStations.map(
                                      (station, index) => (
                                        <div
                                          key={index}
                                          className="bg-yellow-50 p-3 rounded-lg border"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-gray-800">
                                              {station.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              {station.distance}
                                            </div>
                                          </div>
                                          <div className="text-sm text-gray-600 mb-1">
                                            Travel time: {station.travelTime}
                                          </div>
                                          <div className="text-sm text-gray-600 mb-1">
                                            Cost: {station.cost}
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                            {station.transportModes.map(
                                              (mode, idx) => (
                                                <span
                                                  key={idx}
                                                  className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
                                                >
                                                  {mode}
                                                </span>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* Ports */}
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <span className="text-lg">🚢</span>
                                    Ports
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {transport.ports.map((port, index) => (
                                      <div
                                        key={index}
                                        className="bg-cyan-50 p-3 rounded-lg border"
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="font-medium text-gray-800">
                                            {port.name}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            {port.distance}
                                          </div>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-1">
                                          Travel time: {port.travelTime}
                                        </div>
                                        <div className="text-sm text-gray-600 mb-1">
                                          Cost: {port.cost}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                          {port.transportModes.map(
                                            (mode, idx) => (
                                              <span
                                                key={idx}
                                                className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded"
                                              >
                                                {mode}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Local Transport */}
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <span className="text-lg">🚕</span>
                                    Local Transportation
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {transport.localTransport.map(
                                      (option, index) => (
                                        <div
                                          key={index}
                                          className="bg-purple-50 p-3 rounded-lg border"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-gray-800">
                                              {option.name}
                                            </div>
                                            <div className="text-lg">
                                              {option.icon}
                                            </div>
                                          </div>
                                          <div className="text-sm text-gray-600 mb-1">
                                            Distance: {option.distance}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            {option.travelTime}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-gray-800">
                            Contact Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600">📞</span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-700">
                                    Phone
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    +91 98765 43210
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-green-600">✉️</span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-700">
                                    Email
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    info@
                                    {selectedHotel.name
                                      .toLowerCase()
                                      .replace(/\s+/g, "")}
                                    .com
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-purple-600">🌐</span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-700">
                                    Website
                                  </div>
                                  <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                                    www.
                                    {selectedHotel.name
                                      .toLowerCase()
                                      .replace(/\s+/g, "")}
                                    .com
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                  <span className="text-orange-600">⏰</span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-700">
                                    Front Desk
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    24/7 Available
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rooms Tab */}
                    {activeTab === "rooms" && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Available Rooms
                        </h3>
                        {selectedHotel.roomTypes.map((room, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              roomType.toLowerCase() === room.type.toLowerCase()
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-800">
                                {room.type} Room
                              </h4>
                              <div className="text-right">
                                <span className="text-lg font-bold text-gray-800">
                                  Rs{room.price}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {" "}
                                  / night
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {room.type === "Standard" &&
                                "Comfortable accommodation with essential amenities for a pleasant stay."}
                              {room.type === "Deluxe" &&
                                "Spacious rooms with premium amenities and enhanced comfort features."}
                              {room.type === "Suite" &&
                                "Luxurious suites with separate living areas and premium services."}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <span>🛏️</span>
                                <span>King Bed</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>👥</span>
                                <span>2 Guests</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>📺</span>
                                <span>Smart TV</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>❄️</span>
                                <span>AC</span>
                              </div>
                            </div>
                            {room.available <= 3 && (
                              <div className="text-xs text-red-600 font-medium mb-2">
                                Only {room.available} rooms left!
                              </div>
                            )}
                            <button
                              onClick={() => setRoomType(room.type)}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                roomType.toLowerCase() ===
                                room.type.toLowerCase()
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {roomType.toLowerCase() ===
                              room.type.toLowerCase()
                                ? "Selected"
                                : "Select Room"}
                            </button>
                          </div>
                        ))}

                        {/* Booking Form */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-4">Book Your Stay</h4>
                          <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="mb-1 block font-medium">
                                  Check‑in
                                </label>
                                <input
                                  type="date"
                                  className="w-full rounded-md border px-3 py-2"
                                  value={checkInDate}
                                  onChange={(e) =>
                                    setCheckInDate(e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <label className="mb-1 block font-medium">
                                  Check‑out
                                </label>
                                <input
                                  type="date"
                                  className="w-full rounded-md border px-3 py-2"
                                  value={checkOutDate}
                                  onChange={(e) =>
                                    setCheckOutDate(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <label className="mb-1 block font-medium">
                                Number of Rooms
                              </label>
                              {(() => {
                                const matchingRooms =
                                  selectedHotel.bookingstatus.filter((room) => {
                                    if (
                                      room.roomType.toLowerCase() !==
                                      roomType.toLowerCase()
                                    )
                                      return false;
                                    if (!room.bookingId) return true;
                                    const roomIn = new Date(room.checkIn);
                                    const roomOut = new Date(room.checkOut);
                                    const desiredCheckInDate = new Date(
                                      checkInDate
                                    );
                                    const desiredCheckOutDate = new Date(
                                      checkOutDate
                                    );
                                    const noOverlap =
                                      desiredCheckOutDate <= roomIn ||
                                      desiredCheckInDate >= roomOut;
                                    return noOverlap;
                                  });
                                const availableCount = matchingRooms.length;
                                const maxOptions = Math.min(availableCount, 5);
                                return (
                                  <select
                                    className="w-full rounded-md border px-3 py-2"
                                    value={rooms}
                                    onChange={(e) =>
                                      setRooms(Number(e.target.value))
                                    }
                                  >
                                    {Array.from(
                                      { length: maxOptions },
                                      (_, i) => i + 1
                                    ).map((n) => (
                                      <option key={n} value={n}>
                                        {n} {n === 1 ? "Room" : "Rooms"}
                                      </option>
                                    ))}
                                  </select>
                                );
                              })()}
                            </div>

                            <div>
                              <label className="mb-1 block font-medium">
                                Special Requests
                              </label>
                              <textarea
                                className="min-h-[100px] w-full rounded-md border px-3 py-2"
                                placeholder="Any special requests or preferences..."
                              />
                            </div>

                            {/* Price Summary */}
                            <div className="space-y-4 border-t pt-4">
                              <h4 className="font-medium">Price Summary</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Room rate ({roomType})</span>
                                  <span>
                                    Rs{getBasePrice()} × {calculateDays()}{" "}
                                    nights × {rooms} rooms
                                  </span>
                                </div>
                                {discount && (
                                  <div className="flex justify-between text-green-600">
                                    <span>Discount ({discount}%)</span>
                                    <span>
                                      -Rs
                                      {Math.round(
                                        calculateTotalPrice() * (discount / 100)
                                      )}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>Taxes & fees (12%)</span>
                                  <span>
                                    Rs
                                    {Math.round(
                                      (discount
                                        ? calculateTotalPrice() *
                                          (1 - discount / 100)
                                        : calculateTotalPrice()) * 0.12
                                    )}
                                  </span>
                                </div>
                                <hr />
                                <div className="flex justify-between font-medium">
                                  <span>Total</span>
                                  <span>Rs{calculateFinalPrice()}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={handleBooking}
                              disabled={!checkRoomAvailability()}
                              className={`w-full rounded-md bg-blue-600 px-4 py-2 text-white ${
                                !checkRoomAvailability()
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-blue-700"
                              }`}
                            >
                              {!checkRoomAvailability()
                                ? "Not Enough Rooms Available"
                                : "Book Now"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Amenities Tab */}
                    {activeTab === "amenities" && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Hotel Amenities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-3">
                              General Facilities
                            </h4>
                            <div className="space-y-2">
                              {(
                                selectedHotel.amenities || [
                                  "Free WiFi",
                                  "Swimming Pool",
                                  "Fitness Center",
                                  "Restaurant",
                                  "Room Service",
                                  "Concierge",
                                ]
                              ).map((amenity, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm text-gray-600"
                                >
                                  <span className="text-green-500">✓</span>
                                  <span>{amenity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-3">
                              Business & Recreation
                            </h4>
                            <div className="space-y-2">
                              {[
                                "Business Center",
                                "Meeting Rooms",
                                "Spa Services",
                                "Laundry Service",
                                "24/7 Front Desk",
                                "Parking Available",
                              ].map((amenity, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm text-gray-600"
                                >
                                  <span className="text-green-500">✓</span>
                                  <span>{amenity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Amenity Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">
                              🏊‍♂️ Recreation
                            </h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>Swimming Pool</li>
                              <li>Fitness Center</li>
                              <li>Spa & Wellness</li>
                              <li>Game Room</li>
                            </ul>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-800 mb-2">
                              🍽️ Dining
                            </h4>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>Restaurant</li>
                              <li>Room Service</li>
                              <li>Bar/Lounge</li>
                              <li>Breakfast Buffet</li>
                            </ul>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-medium text-purple-800 mb-2">
                              💼 Business
                            </h4>
                            <ul className="text-sm text-purple-700 space-y-1">
                              <li>Business Center</li>
                              <li>Meeting Rooms</li>
                              <li>Free WiFi</li>
                              <li>Conference Hall</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === "reviews" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl font-bold text-blue-600">
                              {calculateAverageRating()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={`text-lg ${
                                      star <=
                                      Math.floor(calculateAverageRating())
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    ⭐
                                  </span>
                                ))}
                              </div>
                              <div className="text-sm text-gray-600">
                                Based on {reviews.length} reviews
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            {showReviewForm ? "Cancel" : "Write a Review"}
                          </button>
                        </div>

                        {reviewSubmitted && (
                          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✓</span>
                              <span>
                                Thank you for your review! It has been added
                                successfully.
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Review Form */}
                        {showReviewForm && (
                          <div className="bg-gray-50 p-6 rounded-lg border">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">
                              Share Your Experience
                            </h4>
                            <form
                              onSubmit={handleSubmitReview}
                              className="space-y-4"
                            >
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Overall Rating
                                </label>
                                <div className="flex items-center gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() =>
                                        setNewReview((prev) => ({
                                          ...prev,
                                          rating: star,
                                        }))
                                      }
                                      className={`text-2xl transition-colors ${
                                        star <= newReview.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      } hover:text-yellow-400`}
                                    >
                                      ⭐
                                    </button>
                                  ))}
                                  <span className="ml-2 text-sm text-gray-600">
                                    {newReview.rating} star
                                    {newReview.rating !== 1 ? "s" : ""}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Review Title
                                </label>
                                <input
                                  type="text"
                                  value={newReview.title}
                                  onChange={(e) =>
                                    setNewReview((prev) => ({
                                      ...prev,
                                      title: e.target.value,
                                    }))
                                  }
                                  placeholder="Summarize your experience..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  maxLength={100}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                  {newReview.title.length}/100 characters
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Your Review
                                </label>
                                <textarea
                                  value={newReview.comment}
                                  onChange={(e) =>
                                    setNewReview((prev) => ({
                                      ...prev,
                                      comment: e.target.value,
                                    }))
                                  }
                                  placeholder="Tell others about your experience at this hotel..."
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  maxLength={500}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                  {newReview.comment.length}/500 characters
                                </div>
                              </div>

                              <div className="flex gap-3">
                                <button
                                  type="submit"
                                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                  Submit Review
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowReviewForm(false);
                                    setNewReview({
                                      rating: 5,
                                      title: "",
                                      comment: "",
                                    });
                                  }}
                                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* Rating Breakdown */}
                        <div className="space-y-2">
                          {(() => {
                            const ratingCounts = [5, 4, 3, 2, 1].map(
                              (rating) => ({
                                stars: rating,
                                count: reviews.filter(
                                  (review) => review.rating === rating
                                ).length,
                                percentage:
                                  reviews.length > 0
                                    ? Math.round(
                                        (reviews.filter(
                                          (review) => review.rating === rating
                                        ).length /
                                          reviews.length) *
                                          100
                                      )
                                    : 0,
                              })
                            );

                            return ratingCounts.map((rating) => (
                              <div
                                key={rating.stars}
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm w-8">
                                  {rating.stars}★
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${rating.percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">
                                  {rating.count}
                                </span>
                              </div>
                            ));
                          })()}
                        </div>

                        {/* Individual Reviews */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-800">
                            Guest Reviews ({reviews.length})
                          </h4>
                          {reviews.map((review) => (
                            <div
                              key={review.id}
                              className={`p-4 rounded-lg border transition-all duration-300 ${
                                review.id === reviews[0]?.id &&
                                review.date === "Just now"
                                  ? "bg-blue-50 border-blue-200 shadow-md"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-gray-800">
                                    {review.title}
                                  </div>
                                  {review.verified && (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                      Verified Stay
                                    </span>
                                  )}
                                  {review.date === "Just now" && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full animate-pulse">
                                      New
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className={`text-sm ${
                                        star <= review.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      ⭐
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {review.comment}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                  - {review.userName} • {review.date}
                                </div>
                                {review.date === "Just now" && (
                                  <div className="text-xs text-blue-600 font-medium">
                                    Your review
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {reviews.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">📝</div>
                            <p>
                              No reviews yet. Be the first to share your
                              experience!
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Policies Tab */}
                    {activeTab === "policies" && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Hotel Policies
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-3">
                              Check-in/Check-out
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <span>Check-in:</span>
                                <span>3:00 PM onwards</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Check-out:</span>
                                <span>12:00 PM</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Early check-in:</span>
                                <span>Subject to availability</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Late check-out:</span>
                                <span>Additional charges apply</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-3">
                              Cancellation Policy
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div>
                                Free cancellation up to 24 hours before check-in
                              </div>
                              <div>
                                Cancellation within 24 hours: 1 night charge
                              </div>
                              <div>No-show: Full booking amount charged</div>
                              <div>
                                Refund processed within 7-10 business days
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">
                            Important Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="space-y-1">
                              <div>• Valid ID required at check-in</div>
                              <div>• Smoking not permitted in rooms</div>
                              <div>• Pets not allowed</div>
                              <div>• Minimum age for check-in: 18 years</div>
                            </div>
                            <div className="space-y-1">
                              <div>• Extra bed available on request</div>
                              <div>• Children under 12 stay free</div>
                              <div>• Credit cards accepted</div>
                              <div>• Security deposit may be required</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">
                            House Rules
                          </h4>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Quiet hours: 10:00 PM - 7:00 AM</li>
                              <li>• Pool hours: 6:00 AM - 10:00 PM</li>
                              <li>• Gym access: 24/7 for hotel guests</li>
                              <li>
                                • Outside food and beverages not allowed in pool
                                area
                              </li>
                              <li>
                                • Dress code applies in restaurant and bar areas
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">
                            Payment Information
                          </h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div>• Payment due at time of booking</div>
                            <div>
                              • Major credit cards accepted (Visa, MasterCard,
                              American Express)
                            </div>
                            <div>• Cash payments accepted at front desk</div>
                            <div>• Currency: Indian Rupees (INR)</div>
                            <div>• All rates include applicable taxes</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Game Selector and Booking Flow - remains the same */}
                {showGameSelector && (
                  <div ref={gameSelectorRef} className="space-y-4">
                    <GameSelector
                      onDiscountWon={handleDiscountWon}
                      onBackToPackages={() => setShowGameSelector(false)}
                      discount={discount}
                      packageName={selectedHotel.name}
                    />

                    <div className="flex justify-between gap-4">
                      <button
                        className="rounded border border-gray-300 bg-white px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                        onClick={() => setShowGameSelector(false)}
                      >
                        Back to Booking
                      </button>
                      {!paymentSuccess && !showPaymentSimButtons && (
                        <button
                          className="w-full rounded-md bg-green-600 py-2 px-4 font-medium text-white hover:bg-green-700"
                          onClick={() => loadRazorpay(selectedHotel)}
                        >
                          Finalize Booking (Rs{calculateFinalPrice()})
                        </button>
                      )}
                      {showPaymentSimButtons && (
                        <div className="flex gap-4 justify-center mt-4">
                          <button
                            className="rounded-md bg-green-600 py-2 px-4 font-medium text-white hover:bg-green-700"
                            onClick={handleSimulateYes}
                          >
                            Yes
                          </button>
                          <button
                            className="rounded-md bg-red-600 py-2 px-4 font-medium text-white hover:bg-red-700"
                            onClick={handleSimulateNo}
                          >
                            No
                          </button>
                        </div>
                      )}
                      {paymentSuccess && !showPaymentSimButtons && (
                        <>
                          <button
                            className="w-full rounded-md bg-gray-400 py-2 px-4 font-medium text-white cursor-not-allowed mb-2"
                            disabled
                          >
                            Paid Successfully
                          </button>
                          <button
                            className="w-full rounded-md bg-blue-600 py-2 px-4 font-medium text-white hover:bg-blue-700"
                            onClick={generateReceipt}
                          >
                            Download Receipt
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </section>
            ) : (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {filteredHotels.length} hotel
                    {filteredHotels.length !== 1 && "s"} found
                  </h2>
                  <select className="rounded-md border px-3 py-2">
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredHotels.map((hotel) => (
                    <HotelCard
                      key={hotel._id}
                      hotel={hotel}
                      onBookNow={() => handleBookNow(hotel._id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
