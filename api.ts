// Typed fetch wrapper for the Express backend. Attaches the Firebase ID token when there is one.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Firebase is loaded lazily and only when it is configured. A static `import { auth }` runs
 * getAuth() the moment this module is imported, and with no NEXT_PUBLIC_FIREBASE_API_KEY that throws
 * (auth/invalid-api-key) — which would crash any page that merely imports the API client in demo mode.
 */
async function idToken(): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return null;
  const { auth } = await import("./firebase.client");
  const user = auth.currentUser;
  return user ? user.getIdToken() : null;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  const token = await idToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (init.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw new ApiError(0, "The request took too long.");
    throw new ApiError(0, "Can't reach the server. Check your connection.");
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new ApiError(res.status, body.error ?? res.statusText);
  }
  return (await res.json()) as T;
}

export const apiGet = <T>(path: string) => api<T>(path);
export const apiPost = <T>(path: string, body: unknown) =>
  api<T>(path, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) });
