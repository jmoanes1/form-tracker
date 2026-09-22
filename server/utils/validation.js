// Validation rules shared by the website routes.

const ALLOWED_TYPES = ["leads", "none_leads"];
const ALLOWED_STATUSES = ["untested", "working", "not_working", "broken"];

// Turns any value into a trimmed string.
function toText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

// A website URL must be a complete http:// or https:// address.
function isValidWebsiteUrl(value) {
  const text = toText(value);

  if (!text) {
    return false;
  }

  try {
    const url = new URL(text);

    const hasHttpProtocol =
      url.protocol === "http:" || url.protocol === "https:";

    return hasHttpProtocol && Boolean(url.hostname);
  } catch (error) {
    return false;
  }
}

// Builds a comparison key so that
//   https://Example.com, http://example.com and https://www.example.com/
// are all treated as the same website.
function getWebsiteKey(value) {
  const text = toText(value);

  try {
    const url = new URL(text);

    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const path = url.pathname.replace(/\/+$/, "");

    return `${host}${path}${url.search}`.toLowerCase();
  } catch (error) {
    return text.toLowerCase();
  }
}

// Validates a request body.
// partial = false -> POST, every field is required.
// partial = true  -> PUT, only the fields that were sent are checked.
// Returns { errors, values }.
function validateWebsiteBody(body = {}, { partial = false } = {}) {
  const errors = {};
  const values = {};

  if (!partial || body.website !== undefined) {
    const website = toText(body.website);

    if (!website) {
      errors.website = "Website URL is required.";
    } else if (!isValidWebsiteUrl(website)) {
      errors.website = "Website URL must start with http:// or https://.";
    } else {
      values.website = website;
    }
  }

  if (!partial || body.type !== undefined) {
    const type = toText(body.type);

    if (!type) {
      errors.type = "Website type is required.";
    } else if (!ALLOWED_TYPES.includes(type)) {
      errors.type =
        `Website type must be one of: ${ALLOWED_TYPES.join(", ")}.`;
    } else {
      values.type = type;
    }
  }

  if (body.status !== undefined) {
    const status = toText(body.status);

    if (!ALLOWED_STATUSES.includes(status)) {
      errors.status =
        `Status must be one of: ${ALLOWED_STATUSES.join(", ")}.`;
    } else {
      values.status = status;
    }
  }

  if (body.tester !== undefined) {
    values.tester = toText(body.tester);
  }

  if (body.notes !== undefined) {
    values.notes = toText(body.notes);
  }

  if (body.lastTested !== undefined) {
    if (body.lastTested === null || body.lastTested === "") {
      values.lastTested = null;
    } else {
      const lastTested = toText(body.lastTested);

      if (Number.isNaN(Date.parse(lastTested))) {
        errors.lastTested = "lastTested must be a valid date or null.";
      } else {
        values.lastTested = new Date(lastTested).toISOString();
      }
    }
  }

  return { errors, values };
}

module.exports = {
  ALLOWED_TYPES,
  ALLOWED_STATUSES,
  isValidWebsiteUrl,
  getWebsiteKey,
  validateWebsiteBody,
};
