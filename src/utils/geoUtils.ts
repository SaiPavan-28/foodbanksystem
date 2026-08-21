/**
 * Geo utilities for FoodBridge — Haversine distance & Nominatim geocoding
 * No API keys required. Uses free OpenStreetMap Nominatim service.
 */

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  areaName: string;
}

/**
 * Calculate the Haversine distance between two geographic points.
 * Returns distance in kilometers.
 */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Reverse geocode coordinates to an address string using Nominatim.
 * Returns { address, areaName } or defaults on failure.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<{ address: string; areaName: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'FoodBridge-App/1.0'
        }
      }
    );
    if (!res.ok) throw new Error('Nominatim request failed');
    const data = await res.json();

    const addr = data.address || {};
    const areaName =
      addr.suburb || addr.neighbourhood || addr.village ||
      addr.town || addr.city_district || addr.city || 'Unknown Area';

    const displayAddress = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    return { address: displayAddress, areaName };
  } catch (err) {
    console.warn('Reverse geocode failed:', err);
    return {
      address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      areaName: 'Unknown Area'
    };
  }
}

/**
 * Search for a place/address using Nominatim forward geocoding.
 * Returns an array of matching results.
 */
export interface NominatimResult {
  lat: number;
  lng: number;
  displayName: string;
  areaName: string;
}

export async function searchAddress(query: string): Promise<NominatimResult[]> {
  if (!query || query.trim().length < 3) return [];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'FoodBridge-App/1.0'
        }
      }
    );
    if (!res.ok) throw new Error('Nominatim search failed');
    const data = await res.json();

    return data.map((item: any) => {
      const addr = item.address || {};
      const areaName =
        addr.suburb || addr.neighbourhood || addr.village ||
        addr.town || addr.city_district || addr.city || 'Unknown Area';
      return {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
        areaName
      };
    });
  } catch (err) {
    console.warn('Address search failed:', err);
    return [];
  }
}

/**
 * Get the user's current browser geolocation.
 * Returns a promise with { lat, lng } or rejects if denied/unavailable.
 */
export function getBrowserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}
