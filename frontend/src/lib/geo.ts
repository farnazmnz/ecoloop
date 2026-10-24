import type { LatLng } from "./types";

/** Markham Civic Centre — fallback when geolocation is denied. */
export const DEFAULT_LOCATION: LatLng = {
  lat: Number(process.env.NEXT_PUBLIC_DEFAULT_LAT ?? 43.8561),
  lng: Number(process.env.NEXT_PUBLIC_DEFAULT_LNG ?? -79.337),
};

export const NEIGHBOURHOODS: Array<{ name: string } & LatLng> = [
  { name: "Markham Centre", lat: 43.8561, lng: -79.337 },
  { name: "Unionville", lat: 43.8656, lng: -79.3107 },
  { name: "Markham Village", lat: 43.8777, lng: -79.2628 },
  { name: "Milliken", lat: 43.827, lng: -79.303 },
  { name: "Cornell", lat: 43.8775, lng: -79.235 },
  { name: "Thornhill", lat: 43.816, lng: -79.405 },
  { name: "Berczy Village", lat: 43.88, lng: -79.3 },
  { name: "Greensborough", lat: 43.895, lng: -79.255 },
  { name: "Wismer", lat: 43.887, lng: -79.278 },
  { name: "Cathedraltown", lat: 43.89, lng: -79.33 },
  { name: "Buttonville", lat: 43.861, lng: -79.37 },
];

const EARTH_RADIUS_KM = 6371;
const toRad = (deg: number) => (deg * Math.PI) / 180;

export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** "350 m", "1.2 km", "12 km" */
export function formatDistance(km: number): string {
  if (km < 0.95) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function nearestNeighbourhood(p: LatLng): string {
  let best = NEIGHBOURHOODS[0];
  let bestKm = Infinity;
  for (const n of NEIGHBOURHOODS) {
    const km = haversineKm(p, n);
    if (km < bestKm) {
      bestKm = km;
      best = n;
    }
  }
  return bestKm > 12 ? "Outside Markham" : best.name;
}

export function isInMarkhamArea(p: LatLng): boolean {
  return haversineKm(p, DEFAULT_LOCATION) < 25;
}
