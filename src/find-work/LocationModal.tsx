import React, { useState } from "react";
import { MapPin, Navigation, Check, X, Search, Building2 } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (locationName: string) => void;
}

const POPULAR_CITIES = [
  "Andheri West, Mumbai",
  "Bandra, Mumbai",
  "Koramangala, Bengaluru",
  "Indiranagar, Bengaluru",
  "Connaught Place, Delhi",
  "Saket, Delhi",
  "Gachibowli, Hyderabad",
  "Hitech City, Hyderabad",
  "Baner, Pune",
  "Viman Nagar, Pune",
  "Salt Lake, Kolkata",
  "Park Street, Kolkata",
  "Navrangpura, Ahmedabad",
  "Bodakdev, Ahmedabad",
  "Anna Nagar, Chennai",
  "T. Nagar, Chennai",
];
export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [manualInput, setManualInput] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isOpen) return null;

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetecting(false);
          // Simulate reverse geocoding to a clean location tag
          const detected = "Andheri West, Mumbai";
          onSelectLocation(detected);
          onClose();
        },
        (error) => {
          setIsDetecting(false);
          // Fallback location on permission decline or preview sandbox limitation
          onSelectLocation("Andheri West, Mumbai");
          onClose();
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetecting(false);
      onSelectLocation("Andheri West, Mumbai");
      onClose();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onSelectLocation(manualInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden space-y-5">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Select Your Location
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Find verified freelancers & local workers near you
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Auto Detect Button */}
        <button
          id="detect-location-btn"
          onClick={handleDetectLocation}
          disabled={isDetecting}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
        >
          <Navigation className={`h-4 w-4 ${isDetecting ? "animate-spin" : ""}`} />
          <span>{isDetecting ? "Detecting GPS..." : "Allow Location / Detect GPS"}</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          <span className="absolute px-3 bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Or enter manually
          </span>
        </div>

        {/* Manual Input Search */}
        <form onSubmit={handleManualSubmit} className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Type city, area or neighborhood..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="w-full pl-10 pr-20 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Apply
          </button>
        </form>

        {/* Popular Locations */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Popular Service Hubs
          </label>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => {
                  onSelectLocation(city);
                  onClose();
                }}
                className={`flex items-center space-x-1.5 p-2 rounded-xl text-left text-xs font-medium transition-colors cursor-pointer border ${
                  currentLocation === city
                    ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-700 dark:text-blue-300 font-bold"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <Building2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{city}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
