// Central API configuration. Point the frontend at the FastAPI backend by setting
// VITE_API_BASE_URL. When unset (or USE_MOCKS true) the UI runs on mock data.
export const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] ?? "";
export const USE_MOCKS: boolean = !API_BASE_URL || import.meta.env["VITE_USE_MOCKS"] === "true";

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}
