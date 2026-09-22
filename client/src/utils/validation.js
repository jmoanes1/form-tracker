// Shared validation helpers.
// Kept in its own file so the Add form, the Edit form and the CSV import
// can all use the same rules.

// A website URL must be a complete http:// or https:// address,
// for example "https://example.com". Returns true when it is valid.
export function isValidWebsiteUrl(value) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return false;
  }

  try {
    const url = new URL(trimmed);

    const hasHttpProtocol =
      url.protocol === "http:" || url.protocol === "https:";

    return hasHttpProtocol && Boolean(url.hostname);
  } catch {
    // new URL() throws when the value is not a URL at all.
    return false;
  }
}

// Builds a comparison key so that
//   https://Example.com, http://example.com and https://www.example.com/
// are all treated as the same website.
// The protocol and "www." are ignored on purpose, and the trailing slash is
// removed, so duplicates are not added twice.
export function normalizeWebsiteUrl(value) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return "";
  }

  try {
    const url = new URL(trimmed);

    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const path = url.pathname.replace(/\/+$/, "");

    return `${host}${path}${url.search}`.toLowerCase();
  } catch {
    return trimmed.toLowerCase();
  }
}
