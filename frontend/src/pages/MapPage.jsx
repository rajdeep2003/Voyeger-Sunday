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
  const [touristSpots, setTouristSpots] = useState([]);
  const [spotsLoading, setSpotsLoading] = useState(false);
  const [spotsError, setSpotsError] = useState(null);

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

  // Fetch nearby popular tourist spots from Overpass API
  useEffect(() => {
    if (!coords) return;

    setSpotsLoading(true);
    setSpotsError(null);
    const controller = new AbortController();

    // This query looks for tourist spots that have a Wikidata tag,
    // which is a good proxy for notability/popularity. It returns up to 10 results.
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["tourism"]["wikidata"](around:15000,${coords.lat},${coords.lng});
        way["tourism"]["wikidata"](around:15000,${coords.lat},${coords.lng});
        relation["tourism"]["wikidata"](around:15000,${coords.lat},${coords.lng});
      );
      out center;
    `;

    fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
        overpassQuery
      )}`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => {
        const spots = data.elements
          .filter((element) => element.tags && element.tags.name)
          .map((element) => ({
            id: element.id,
            name: element.tags.name,
            lat: element.lat || element.center?.lat,
            lon: element.lon || element.center?.lon,
          }))
          .filter((spot) => spot.lat && spot.lon);

        const uniqueSpots = spots
          .filter(
            (spot, index, self) =>
              index === self.findIndex((s) => s.name === spot.name)
          )
          .slice(0, 10); // Take the top 10 unique spots

        setTouristSpots(uniqueSpots);
        if (uniqueSpots.length === 0) {
          setSpotsError("No popular tourist spots found nearby.");
        }
        setSpotsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setSpotsError("Could not fetch popular tourist spots.");
        }
        setSpotsLoading(false);
      });

    return () => controller.abort();
  }, [coords]);

  const handleSuggestionClick = (suggestion) => {
    setCoords({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
    });
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

  const SmallSpinner = () => (
    <div className="flex justify-center items-center h-16">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

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

        {/* Tourist Spots Section */}
        <div className="w-full max-w-xl mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
            Nearby Tourist Spots
          </h3>
          {spotsLoading ? (
            <SmallSpinner />
          ) : spotsError && touristSpots.length === 0 ? (
            <p className="text-gray-500 text-center">{spotsError}</p>
          ) : (
            <div className="flex overflow-x-auto space-x-4 p-2 -m-2">
              {touristSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="bg-gray-100 border border-gray-200 rounded-lg p-3 shadow-sm flex-shrink-0 cursor-pointer hover:shadow-md hover:bg-blue-50 transition-all"
                  onClick={() => setCoords({ lat: spot.lat, lng: spot.lon })}
                >
                  <p className="font-semibold text-gray-700 whitespace-nowrap">
                    {spot.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

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