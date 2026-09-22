// Relative by default so requests stay on the same origin and are proxied
// to the API server by Vite (see vite.config.js). Set VITE_API_URL to point
// at an absolute API URL instead, e.g. http://localhost:5000/api.
const API_URL = import.meta.env.VITE_API_URL || "/api";

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
    response = await fetch(`${API_URL}${path}`, options);
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