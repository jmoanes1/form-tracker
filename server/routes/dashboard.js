const { readWebsites } = require("../utils/dataStore");

const express = require("express");

const router = express.Router();

// GET /api/dashboard
// The counts are calculated from websites.json on every request.
router.get("/", (req, res) => {
  try {
    const websites = readWebsites();

    const countByStatus = (status) =>
      websites.filter((item) => item.status === status).length;

    const countByType = (type) =>
      websites.filter((item) => item.type === type).length;

    res.json({
      success: true,
      data: {
        total: websites.length,
        working: countByStatus("working"),
        notWorking: countByStatus("not_working"),
        broken: countByStatus("broken"),
        untested: countByStatus("untested"),
        leads: countByType("leads"),
        noneLeads: countByType("none_leads"),
      },
    });
  } catch (error) {
    console.error(`GET /api/dashboard failed: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to calculate the dashboard statistics.",
    });
  }
});

module.exports = router;
