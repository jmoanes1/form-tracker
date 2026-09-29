// API base URL.
//
// - Local dev (default): "/api" — same-origin relative URL. Vite proxies
//   "/api/*" to the Express server (see client/vite.config.js), so the
//   browser never talks to http://localhost:5000 directly.
// - Separate frontend/backend deploys: set VITE_API_URL to the public API
//   origin, e.g. "https://my-api.onrender.com" or
//   "https://my-api.onrender.com/api". A bare origin gets "/api" appended
//   automatically, so both forms work.
//
// Never hard-code "http://localhost:5000" here — it breaks production on
// Render because a visitor's browser has no server on their own localhost.
function resolveApiUrl(raw) {
  const value = String(raw || "").trim().replace(/\/+$/, "");

  if (!value) {
    return "/api";
  }

  // CRITICAL blank-page guard: Render dashboard env vars are baked into
  // dist/*.js at build time. If VITE_API_URL is/was http://localhost:5000
  // (or any localhost/127.0.0.1/0.0.0.0), the HTTPS live page would try a
  // mixed-content fetch to the visitor's own machine, which the browser
  // blocks — leaving #root empty (blank white screen). Ignore such values
  // and stay on same-origin "/api".
  if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?(\/.*)?$/i.test(value)) {
    return "/api";
  }

  if (/\/api$/i.test(value)) {
    return value;
  }

  try {
    const parsed = new URL(value);

    // Bare origin like "https://my-api.onrender.com" -> ".../api".
    // A URL with its own path ("/v1", ...) is left untouched.
    if (parsed.pathname === "/" || parsed.pathname === "") {
      return `${value}/api`;
    }

    return value;
  } catch {
    // Relative value such as "/" or "/api/" (trailing slash removed above).
    if (value === "/") {
      return "/api";
    }

    return value;
  }
}

const API_URL = resolveApiUrl(import.meta.env.VITE_API_URL);

// Use the message from the API when it sends one, otherwise fall back to the
// message for the operation that was attempted.
async function getErrorMessage(response, fallbackMessage) {
  try {
    const body = await response.json();

    if (body && typeof body.message === "string" && body.message) {
      return body.message;
    }
  } catch {
    // The response had no JSON body.
  }

  return (
    fallbackMessage || `Request failed with status ${response.status}`
  );
}

async function request(path, { fallbackMessage, ...options } = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      // Required so the login session cookie is sent on every request.
      credentials: "include",
      ...options,
    });
  } catch {
    // fetch only rejects when the request never reached the server:
    // server stopped, wrong port, or blocked by the browser.
    const error = new Error(
      `Failed to fetch ${API_URL}${path}. Make sure the API server is running.`
    );

    error.status = 0;

    throw error;
  }

  if (!response.ok) {
    const error = new Error(await getErrorMessage(response, fallbackMessage));

    // The status code lets the UI react differently (409 = duplicate, ...).
    error.status = response.status;

    throw error;
  }

  return response.json();
}

export async function getWebsites() {
  return request("/websites", {
    fallbackMessage: "Failed to fetch websites",
  });
}

export async function getWebsite(id) {
  return request(`/websites/${id}`, {
    fallbackMessage: "Failed to fetch the website",
  });
}

// Statistics are calculated by the backend in this endpoint.
export async function getDashboard() {
  return request("/dashboard", {
    fallbackMessage: "Failed to fetch the dashboard statistics",
  });
}

export async function createWebsite(websiteData) {
  return request("/websites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(websiteData),
    fallbackMessage: "Failed to create website",
  });
}

export async function updateWebsite(id, websiteData) {
  return request(`/websites/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(websiteData),
    fallbackMessage: "Failed to update website",
  });
}

export async function deleteWebsite(id) {
  return request(`/websites/${id}`, {
    method: "DELETE",
    fallbackMessage: "Failed to delete website",
  });
}

export function getAuthStatus() { return request("/auth/status"); }
export function setupAccount(values) { return request("/auth/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); }
export function login(values) { return request("/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); }
export function logout() { return request("/auth/logout", { method: "POST" }); }
export function changePassword(values) { return request("/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); }
export function updateProfile(values) { return request("/auth/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); }
export function getUsers() { return request("/auth/users"); }
export function createAccount(values) { return request("/auth/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); }
export function deleteAccount(username) { return request(`/auth/users/${encodeURIComponent(username)}`, { method: "DELETE" }); }
