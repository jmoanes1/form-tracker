const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// All data lives in JSON files inside server/data (or DATA_DIR when set).
// DATA_DIR lets Render mount a persistent disk so records survive redeploys;
// the default repo location is wiped on every deploy.
const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, "../data");
const dataFile = path.join(dataDir, "websites.json");
const backupFile = path.join(dataDir, "websites.backup.json");

// Render's disk (and any first write) may need the directory created.
function ensureDataDir() {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (error) {
    console.error(`Could not create data directory ${dataDir}: ${error.message}`);
  }
}

// Makes sure every record has the fields the dashboard expects.
// Older records are upgraded here without losing the data they already have.
function withDefaults(record) {
  return {
    id: record.id || crypto.randomUUID(),
    title: record.title || "",
    domainName: record.domainName || "",
    hostingName: record.hostingName || "",
    credentials: {
      username: record.credentials?.username || "",
      password: record.credentials?.password || "",
    },
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
  ensureDataDir();

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
  dataDir,
  dataFile,
  backupFile,
  readWebsites,
  saveWebsites,
  withDefaults,
};
