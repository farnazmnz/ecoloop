import type { LatLng } from "./types";

export type LocationResult =
  | { ok: true; loc: LatLng }
  | { ok: false; reason: "unsupported" | "denied" | "unavailable" | "timeout" };

/** Triggers the browser's location permission prompt. */
export function requestLocation(timeoutMs = 10_000): Promise<LocationResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ ok: false, reason: "unsupported" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ ok: true, loc: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) resolve({ ok: false, reason: "denied" });
        else if (err.code === err.TIMEOUT) resolve({ ok: false, reason: "timeout" });
        else resolve({ ok: false, reason: "unavailable" });
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 5 * 60_000 },
    );
  });
}
