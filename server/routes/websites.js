const express = require("express");
const crypto = require("crypto");

const { readWebsites, saveWebsites } = require("../utils/dataStore");

const {
  getWebsiteKey,
  validateWebsiteBody,
} = require("../utils/validation");

const router = express.Router();

// Finds the position of a website in the array. Returns -1 when missing.
function findIndexById(websites, id) {
  return websites.findIndex((item) => item.id === id);
}

// Returns the index of another website that already uses the same URL.
function findDuplicateIndex(websites, website, ignoreId = null) {
  const key = getWebsiteKey(website);

  return websites.findIndex(
    (item) => item.id !== ignoreId && getWebsiteKey(item.website) === key
  );
}

// Answers with the first validation message so the UI can show it.
function sendValidationError(res, errors) {
  return res.status(400).json({
    success: false,
    message: Object.values(errors)[0],
    errors,
  });
}

// GET /api/websites
router.get("/", (req, res) => {
  try {
    res.json({
      success: true,
      data: readWebsites(),
    });
  } catch (error) {
    console.error(`GET /api/websites failed: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to read websites.",
    });
  }
});

// GET /api/websites/:id
router.get("/:id", (req, res) => {
  try {
    const website = readWebsites().find(
      (item) => item.id === req.params.id
    );

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    res.json({
      success: true,
      data: website,
    });
  } catch (error) {
    console.error(`GET /api/websites/:id failed: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to get website.",
    });
  }
});

// POST /api/websites
router.post("/", (req, res) => {
  try {
    const { errors, values } = validateWebsiteBody(req.body);

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    const websites = readWebsites();

    if (findDuplicateIndex(websites, values.website) !== -1) {
      return res.status(409).json({
        success: false,
        message: "This website already exists.",
      });
    }

    // New websites always start as untested.
    const newWebsite = {
      id: crypto.randomUUID(),
      website: values.website,
      type: values.type,
      status: "untested",
      notes: values.notes || "",
      tester: values.tester || "",
      lastTested: null,
      createdAt: new Date().toISOString(),
      testHistory: [],
    };

    websites.push(newWebsite);

    saveWebsites(websites);

    res.status(201).json({
      success: true,
      message: "Website added successfully.",
      data: newWebsite,
    });
  } catch (error) {
    console.error(`POST /api/websites failed: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to add website.",
    });
  }
});

// PUT /api/websites/:id
router.put("/:id", (req, res) => {
  try {
    const { errors, values } = validateWebsiteBody(req.body, {
      partial: true,
    });

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    const websites = readWebsites();
    const index = findIndexById(websites, req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    const currentWebsite = websites[index];

    const isDuplicate =
      values.website !== undefined &&
      findDuplicateIndex(websites, values.website, currentWebsite.id) !== -1;

    if (isDuplicate) {
      return res.status(409).json({
        success: false,
        message: "Another website already uses this URL.",
      });
    }

    const updatedWebsite = {
      ...currentWebsite,
      ...values,
      id: currentWebsite.id,
      testHistory: [...currentWebsite.testHistory],
    };

    // A new history entry is created when the status changes or when the
    // client sends lastTested (the test modal always sends it).
    const statusChanged =
      values.status !== undefined &&
      values.status !== currentWebsite.status;

    const testedAt = values.lastTested || null;

    if (statusChanged || testedAt) {
      const historyEntry = {
        status: updatedWebsite.status,
        tester: updatedWebsite.tester,
        notes: updatedWebsite.notes,
        testedAt: testedAt || new Date().toISOString(),
      };

      updatedWebsite.testHistory = [
        ...currentWebsite.testHistory,
        historyEntry,
      ];

      // "untested" means it has not been tested yet, so there is no date.
      updatedWebsite.lastTested =
        updatedWebsite.status === "untested" ? null : historyEntry.testedAt;
    }

    websites[index] = updatedWebsite;

    saveWebsites(websites);

    res.json({
      success: true,
      message: "Website updated successfully.",
      data: updatedWebsite,
    });
  } catch (error) {
    console.error(`PUT /api/websites/:id failed: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to update website.",
    });
  }
});

// DELETE /api/websites/:id
router.delete("/:id", (req, res) => {
  try {
    const websites = readWebsites();
    const index = findIndexById(websites, req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    websites.splice(index, 1);

    saveWebsites(websites);

    res.json({
      success: true,
      message: "Website deleted successfully.",
    });
  } catch (error) {
    console.error(`DELETE /api/websites/:id failed: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to delete website.",
    });
  }
});

module.exports = router;
