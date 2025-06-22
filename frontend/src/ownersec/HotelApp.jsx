"use client";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import BookingsPage from "./components/BookingsPage";
import RoomsPage from "./components/RoomsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import { useAppContext } from "../context/AppContext"; 
import { useNavigate } from "react-router-dom";
export default function HotelApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hotelOwner, setHotelOwner] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { user, setUser, setProfileOpen, userDetails, setUserDetails ,isLoading, setIsLoading } = useAppContext();
  const navigate = useNavigate();
  useEffect(() => {
    const savedOwner = localStorage.getItem("hotelOwner");
    if (savedOwner) {
      setHotelOwner(JSON.parse(savedOwner));
      setIsLoggedIn(true);
    }
  }, []);
  const handleLogin = (owner) => {
    localStorage.setItem("hotelOwner", JSON.stringify(owner));
     console.log("I am from handlelogin")
    setHotelOwner(owner);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "bookings":
        return <BookingsPage />;
      case "rooms":
        return <RoomsPage />;
      case "analytics":
        return <AnalyticsPage />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  // if (!isLoggedIn) {
  //   return <LoginPage onLogin={handleLogin} />;
  // }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        hotelOwner={hotelOwner}
        
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      {renderCurrentPage()}
    </div>
  );
}
