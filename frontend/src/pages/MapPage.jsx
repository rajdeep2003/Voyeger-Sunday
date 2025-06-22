import React, { useEffect, useState } from "react";

const Spinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

const MapPage = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location permission denied.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("The request to get your location timed out.");
            break;
          default:
            setError("An unknown error occurred while getting location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Fetch suggestions from Nominatim
  useEffect(() => {
    if (search.length < 3) {
      setSuggestions([]);
      return;
    }
    setSearchLoading(true);
    const controller = new AbortController();
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        search
      )}&addressdetails=1&limit=5`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data);
        setSearchLoading(false);
      })
      .catch(() => setSearchLoading(false));
    return () => controller.abort();
  }, [search]);

  const handleSuggestionClick = (suggestion) => {
    setCoords({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
    setSearch("");
    setSuggestions([]);
    setError(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white rounded-xl shadow-lg p-2 md:p-4 w-[98vw] h-[90vh] mx-auto flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Your Location on Map</h2>
        <form onSubmit={handleSearchSubmit} className="w-full max-w-xl mb-2 relative">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search for a location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
          {searchLoading && (
            <div className="absolute right-3 top-3 w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          )}
          {suggestions.length > 0 && (
            <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((s, idx) => (
                <li
                  key={s.place_id}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </form>
        {error ? (
          <div className="text-red-600 text-center px-4 py-4 bg-red-50 rounded-lg w-full">
            <h3 className="text-lg font-semibold mb-1">Error</h3>
            <p>{error}</p>
          </div>
        ) : coords ? (
          <div className="w-full flex-1 rounded-lg overflow-hidden border border-gray-200">
            <iframe
              className="w-full h-full"
              src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
              allowFullScreen
              loading="lazy"
              title="User Location Map"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <Spinner />
            <p className="text-gray-600 text-lg mt-4 text-center">Fetching your location...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;