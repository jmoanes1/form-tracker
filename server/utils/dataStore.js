const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// All data lives in JSON files inside server/data.
const dataFile = path.join(__dirname, "../data/websites.json");
const backupFile = path.join(__dirname, "../data/websites.backup.json");

// Makes sure every record has the fields the dashboard expects.
// Older records are upgraded here without losing the data they already have.
function withDefaults(record) {
  return {
    id: record.id || crypto.randomUUID(),
    website: record.website || "",
    type: record.type || "leads",
    status: record.status || "untested",
    notes: record.notes || "",
    tester: record.tester || "",
    lastTested: record.lastTested || null,
    createdAt: record.createdAt || new Date().toISOString(),
    testHistory: Array.isArray(record.testHistory) ? record.testHistory : [],
  };
}

// Read websites. Always returns an array so the client can rely on it.
function readWebsites() {
  let websites;

  try {
    websites = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch (error) {
    console.error(`Could not read ${dataFile}: ${error.message}`);

    websites = [];
  }

  // A single record stored as an object (instead of an array) breaks every
  // route, so repair the file instead of returning bad data.
  if (!Array.isArray(websites)) {
    console.warn(`${dataFile} did not contain an array. Repairing it.`);

    websites = websites && typeof websites === "object" ? [websites] : [];

    websites = websites.map(withDefaults);
    saveWebsites(websites);

    return websites;
  }

  return websites.map(withDefaults);
}

// Save websites and keep a copy of the previous file as a simple backup.
function saveWebsites(websites) {
  if (fs.existsSync(dataFile)) {
    try {
      fs.copyFileSync(dataFile, backupFile);
    } catch (error) {
      console.error(`Could not write the backup file: ${error.message}`);
    }
  }

  fs.writeFileSync(
    dataFile,
    JSON.stringify(websites, null, 2),
    "utf8"
  );
}

module.exports = {
  dataFile,
  backupFile,
  readWebsites,
  saveWebsites,
  withDefaults,
};
