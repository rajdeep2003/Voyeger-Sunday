"use client";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Button } from "../components/ui/button";
import { Settings, LogOut, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function Header({ hotelOwner, onLogout, currentPage, onNavigate }) {
  const { user, setUser, setProfileOpen, logout, isLoading, setIsLoading } = useAppContext();
  const navigate = useNavigate();

  // Fallback if logout is not provided from context
  const handleLogout = async () => {
    if (logout) {
      logout(); // Prefer the global context version
      return;
    }

    try {
      setIsLoading(true);
      await axios.get("http://localhost:5000/api/users/logout", {
        withCredentials: true,
      });
      localStorage.clear();
      console.log("I am from logout");
      setUser(null);
      setProfileOpen(false);
      toast.success("Logged out successfully");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      // toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {currentPage !== "dashboard" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{user?.name}</h1>
              <p className="text-sm text-gray-500">{ }</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
