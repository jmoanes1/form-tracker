const { readWebsites, saveWebsites } = require("../utils/dataStore");

// This service is the single backend boundary for website records. Route
// handlers keep HTTP concerns while future storage implementations can replace
// JSON without requiring route-level changes.
function listWebsites() {
  return readWebsites();
}

function getWebsiteById(id) {
  return listWebsites().find((website) => website.id === id) || null;
}

function findWebsiteIndex(websites, id) {
  return websites.findIndex((website) => website.id === id);
}

function persistWebsites(websites) {
  saveWebsites(websites);
}

module.exports = {
  findWebsiteIndex,
  getWebsiteById,
  listWebsites,
  persistWebsites,
};
