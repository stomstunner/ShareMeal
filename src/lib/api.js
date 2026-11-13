const API_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`;

export async function apiRequest(path, options = {}) {
  const headers = { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...options.headers };
  const token = localStorage.getItem("sharemeal_token");
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("Unable to reach the ShareMeal server. Please try again in a moment.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export function googleLogin() {
  window.location.href = `${API_URL}/auth/google`;
}

export function getSessionUser() {
  const token = localStorage.getItem("sharemeal_token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    localStorage.removeItem("sharemeal_token");
    return null;
  }
}
