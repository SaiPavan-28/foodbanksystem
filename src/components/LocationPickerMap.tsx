import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Search, Loader2, X } from 'lucide-react';
import { reverseGeocode, searchAddress, getBrowserLocation, NominatimResult } from '../utils/geoUtils';

interface LocationPickerMapProps {
  /** Current location value */
  value: {
    lat: number;
    lng: number;
    address: string;
    areaName: string;
  };
  /** Callback when location changes */
  onChange: (location: { lat: number; lng: number; address: string; areaName: string }) => void;
  /** Map height in pixels */
  height?: number;
  /** Accent color theme */
  accentColor?: 'emerald' | 'teal';
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  value,
  onChange,
  height = 320,
  accentColor = 'emerald'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [geocodeStatus, setGeocodeStatus] = useState<string>('');

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const accentClasses = accentColor === 'teal'
    ? {
        ring: 'focus:ring-teal-500',
        bg: 'bg-teal-600 hover:bg-teal-500',
        bgLight: 'bg-teal-50',
        border: 'border-teal-300',
        text: 'text-teal-700',
        textLight: 'text-teal-600',
        pinColor: '#0D9488',
        pinGlow: '#14B8A6'
      }
    : {
        ring: 'focus:ring-emerald-500',
        bg: 'bg-emerald-600 hover:bg-emerald-500',
        bgLight: 'bg-emerald-50',
        border: 'border-emerald-300',
        text: 'text-emerald-700',
        textLight: 'text-emerald-600',
        pinColor: '#059669',
        pinGlow: '#10B981'
      };

  // Create/update marker icon
  const createMarkerIcon = useCallback(() => {
    return L.divIcon({
      className: 'custom-location-pin',
      html: `<div style="
        position: relative;
        width: 40px;
        height: 40px;
      ">
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 36px;
          background: ${accentClasses.pinColor};
          border-radius: 50% 50% 50% 0;
          transform: translateX(-50%) rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 16px ${accentClasses.pinGlow}80, 0 0 24px ${accentClasses.pinGlow}40;
        "></div>
        <div style="
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          z-index: 2;
        "></div>
      </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  }, [accentClasses.pinColor, accentClasses.pinGlow]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [value.lat, value.lng],
        zoom: 15,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Add marker
      const marker = L.marker([value.lat, value.lng], {
        icon: createMarkerIcon(),
        draggable: true
      }).addTo(map);

      // Handle marker drag
      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        setGeocodeStatus('Fetching address...');
        const { address, areaName } = await reverseGeocode(pos.lat, pos.lng);
        setGeocodeStatus('');
        onChange({ lat: pos.lat, lng: pos.lng, address, areaName });
      });

      // Handle map click
      map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setGeocodeStatus('Fetching address...');
        const { address, areaName } = await reverseGeocode(lat, lng);
        setGeocodeStatus('');
        onChange({ lat, lng, address, areaName });
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker position when value changes externally
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (Math.abs(currentPos.lat - value.lat) > 0.0001 || Math.abs(currentPos.lng - value.lng) > 0.0001) {
        markerRef.current.setLatLng([value.lat, value.lng]);
        mapInstanceRef.current.setView([value.lat, value.lng], mapInstanceRef.current.getZoom());
      }
    }
  }, [value.lat, value.lng]);

  // Debounced search
  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (query.trim().length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchAddress(query);
      setSearchResults(results);
      setShowResults(results.length > 0);
      setIsSearching(false);
    }, 500);
  };

  // Select a search result
  const handleSelectResult = (result: NominatimResult) => {
    onChange({
      lat: result.lat,
      lng: result.lng,
      address: result.displayName,
      areaName: result.areaName
    });

    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([result.lat, result.lng]);
      mapInstanceRef.current.setView([result.lat, result.lng], 16, { animate: true });
    }

    setSearchQuery(result.displayName.split(',').slice(0, 2).join(','));
    setShowResults(false);
    setSearchResults([]);
  };

  // Use browser geolocation
  const handleUseMyLocation = async () => {
    setIsLocating(true);
    setGeocodeStatus('Getting your location...');
    try {
      const { lat, lng } = await getBrowserLocation();
      const { address, areaName } = await reverseGeocode(lat, lng);
      onChange({ lat, lng, address, areaName });

      if (markerRef.current && mapInstanceRef.current) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.setView([lat, lng], 16, { animate: true });
      }

      setSearchQuery(address.split(',').slice(0, 2).join(','));
      setGeocodeStatus('');
    } catch (err: any) {
      setGeocodeStatus('');
      alert(
        err?.code === 1
          ? 'Location access was denied. Please allow location access in your browser settings and try again.'
          : 'Could not get your location. Please search for your address manually.'
      );
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700 uppercase">
        📍 Pickup Location (Click map, search, or use GPS)
      </label>

      {/* Search Bar + GPS Button */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            placeholder="Search address, landmark, or city..."
            className={`w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 text-sm font-medium ${accentClasses.ring} focus:ring-2 focus:outline-none`}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setSearchResults([]); setShowResults(false); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-[1000] max-h-52 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className={`w-4 h-4 ${accentClasses.textLight} shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-2">{result.displayName}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{result.areaName} • {result.lat.toFixed(4)}, {result.lng.toFixed(4)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className={`px-4 py-2.5 ${accentClasses.bg} text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all whitespace-nowrap disabled:opacity-60`}
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'Use My Location'}</span>
          <span className="sm:hidden">{isLocating ? '...' : 'GPS'}</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
        <div
          ref={mapContainerRef}
          style={{ height: `${height}px` }}
          className="w-full z-10"
        />

        {/* Geocode Status Overlay */}
        {geocodeStatus && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {geocodeStatus}
          </div>
        )}

        {/* Click Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-full shadow border border-slate-200 backdrop-blur-sm">
          Click map to place pin • Drag marker to adjust
        </div>
      </div>

      {/* Selected Location Display */}
      {value.address && (
        <div className={`p-3 ${accentClasses.bgLight} border ${accentClasses.border} rounded-xl flex items-start gap-2`}>
          <MapPin className={`w-4 h-4 ${accentClasses.text} shrink-0 mt-0.5`} />
          <div>
            <p className="text-xs font-bold text-slate-800 line-clamp-2">{value.address}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
              Area: {value.areaName} • Coords: {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
