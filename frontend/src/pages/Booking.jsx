import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaTrain, FaTaxi, FaBus, FaHotel } from "react-icons/fa";
import { TfiCrown } from "react-icons/tfi";
import toast from "react-hot-toast";

const bookingOptions = [
  { id: 1, icon: FaPlane, color: "text-blue-600", title: "Flights", bgColor: "bg-blue-600", path: "flightbook" },
  { id: 2, icon: FaTrain, color: "text-green-600", title: "Trains", bgColor: "bg-green-600", path: "trainbook" },
  { id: 3, icon: FaBus, color: "text-red-600", title: "Bus", bgColor: "bg-red-600", path: "busbook" },
  { id: 4, icon: TfiCrown, color: "text-pink-600", title: "Souvenir", bgColor: "bg-pink-600", path: "souvenirbook" },
  { id: 5, icon: FaTaxi, color: "text-yellow-600", title: "Cabs", bgColor: "bg-yellow-600", path: "cabbook" },
  { id: 6, icon: FaHotel, color: "text-purple-600", title: "Hotel", bgColor: "bg-purple-600", path: "hotelbook" },
];

const BookingCard = ({ Icon, title, color, bgColor, onBookNow }) => (
  <div className="p-6 bg-gray-50  rounded-lg text-center shadow-sm hover:shadow-md transition duration-200 border-2 border-black  ">
    <Icon className={`text-5xl ${color} mx-auto`} aria-label={title} />
    <h3 className="mt-3 font-semibold text-lg">{title}</h3>
    <button
      className={`mt-4 px-5 py-2 rounded-md text-white text-sm ${bgColor} hover:opacity-90`}
      onClick={onBookNow}
    >
      Book Now
    </button>
  </div>
);

const Booking = () => {
  const navigate = useNavigate();

  const handleBooking = (bookingType, path) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
          navigate(`/${path}`);
        }, 800);
      }),
      {
        loading: `Redirecting to ${bookingType}...`,
        success: `${bookingType} page opened`,
        error: "Failed to navigate",
      }
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1667113478917-475119cbbca7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFja2dyb3VuZCUyMGNvbG91ciUyMGdyYWRpZW50fGVufDB8fDB8fHww')",
      }}
    >
      <div className="w-full max-w-6xl text-center ">
        <h2 className="text-5xl font-extrabold mb-20 text-black text-center">Book Your Travel</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-9">
          {bookingOptions.map(({ id, icon, title, color, bgColor, path }) => (
            <BookingCard
              key={id}
              Icon={icon}
              title={title}
              color={color}
              bgColor={bgColor}
              onBookNow={() => handleBooking(title, path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Booking;
