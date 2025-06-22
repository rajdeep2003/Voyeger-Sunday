import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [createCom, setCreateCom] = useState(false);
  const [location, setLocation] = useState({});
  const [address, setAddress] = useState("");
  const [currentcity, setCurrentcity] = useState("");
  const [userDetails, setUserDetails] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
 
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    if (token && role && email) {
      setUser({ token, role, email, name });
    }
  }, []);
  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/login");
  };
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        logout,
        sidebarOpen,
        setSidebarOpen,
        profileOpen,
        setProfileOpen,
        createCom,
        setCreateCom,
        location,
        setLocation,
        address,
        setAddress,
        currentcity,
        setCurrentcity,
        userDetails,
        setUserDetails,
        isLoading, setIsLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
