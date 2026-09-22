import { TYPE_OPTIONS } from "./websiteList";
import { isValidWebsiteUrl, normalizeWebsiteUrl } from "./validation";

const ALLOWED_TYPES = TYPE_OPTIONS.map((option) => option.value);

// Splits one CSV line into cells. Supports "quoted, values".
function splitCsvLine(line) {
  const cells = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (insideQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (character === "," && !insideQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += character;
    }
  }

  cells.push(current);

  return cells.map((cell) => cell.trim());
}

// Reads CSV text and returns plain objects.
// The first line is the header, for example: website,type
export function parseCsv(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    return [];
  }

  const header = splitCsvLine(lines[0]).map((cell) => cell.toLowerCase());

  const websiteIndex = header.indexOf("website");

  if (websiteIndex === -1) {
    return [];
  }

  const typeIndex = header.indexOf("type");
  const testerIndex = header.indexOf("tester");
  const notesIndex = header.indexOf("notes");

  const readCell = (cells, index) =>
    index === -1 ? "" : cells[index] || "";

  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);

    return {
      website: readCell(cells, websiteIndex),
      type: readCell(cells, typeIndex),
      tester: readCell(cells, testerIndex),
      notes: readCell(cells, notesIndex),
    };
  });
}

// Checks a CSV file before anything is sent to the API.
// Returns the websites that can be imported plus a summary for the user.
export function buildImportPlan(text, existingWebsites = []) {
  const rows = parseCsv(text);

  const knownUrls = new Set(
    existingWebsites.map((website) => normalizeWebsiteUrl(website.website))
  );

  const websites = [];

  const summary = {
    total: rows.length,
    imported: 0,
    skipped: 0,
    invalidUrls: 0,
    duplicates: 0,
    failed: 0,
  };

  rows.forEach((row) => {
    if (!isValidWebsiteUrl(row.website)) {
      summary.invalidUrls += 1;
      return;
    }

    if (!ALLOWED_TYPES.includes(row.type)) {
      // Rows without a valid type (leads / none_leads) are skipped.
      summary.skipped += 1;
      return;
    }

    const urlKey = normalizeWebsiteUrl(row.website);

    if (knownUrls.has(urlKey)) {
      summary.duplicates += 1;
      return;
    }

    knownUrls.add(urlKey);

    websites.push({
      website: row.website,
      type: row.type,
      tester: row.tester,
      notes: row.notes,
    });
  });

  return { websites, summary };
}

// Creates a spreadsheet-friendly CSV export of the full website registry.
export function createWebsitesCsv(websites) {
  const columns = [
    "website",
    "type",
    "status",
    "tester",
    "lastTested",
    "notes",
  ];
  const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = websites.map((website) =>
    columns.map((column) => escapeCell(website[column])).join(",")
  );

  return [columns.join(","), ...rows].join("\r\n");
}
