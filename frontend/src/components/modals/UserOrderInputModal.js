import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import merkericon from "../../assets/marker-icon.png";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../features/products/cartSlice";

// Define custom icon
const customIcon = new L.Icon({
  iconUrl: merkericon, // Path to your custom marker image
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

const SearchControl = ({ setLocation }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      setLocation({ lat: result.location.y, lng: result.location.x });
    });

    return () => map.removeControl(searchControl);
  }, [map, setLocation]);

  return null;
};

const MapClickHandler = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const UserOrderInputModal = ({ onClose, onSave }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [location, setLocation] = useState({ lat: 40.748817, lng: -73.985428 }); // Default location
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Try to get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to retrieve your location.");
          setLoadingLocation(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoadingLocation(false);
    }
  }, []);

  const handleSave = () => {
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }
    dispatch(setUserDetails({ name, location }));
    onSave(name, location);
    onClose();
  };

  if (loadingLocation) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div className="spinner"></div>
        <style jsx>{`
          .spinner {
            width: 60px;
            height: 60px;
            border: 8px solid rgba(0, 0, 0, 0.1);
            border-left-color: #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-lg font-medium mb-4">Enter Your Details</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim() !== "") {
              setError(""); // Clear error if name is provided
            }
          }}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <MapContainer
          center={location}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler setLocation={setLocation} />
          <SearchControl setLocation={setLocation} />
          <Marker position={location} icon={customIcon}>
            <Popup>Your selected location</Popup>
          </Marker>
        </MapContainer>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserOrderInputModal;
