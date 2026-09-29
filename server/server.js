const express = require("express");
const path = require("path");

const app = express();

// ==========================================
// CONFIGURATION
// ==========================================

const PORT = process.env.PORT || 10000;

// React production build location
const clientPath = path.join(__dirname, "../client/dist");

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// TEMPORARY IN-MEMORY DATA
// ==========================================
// No database / SQL required.
//
// IMPORTANT:
// Data stored here will reset when the Render
// service restarts or redeploys.

let websites = [];

// ==========================================
// API - HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Form Testing Dashboard API is running",
    environment: process.env.NODE_ENV || "production",
  });
});

// ==========================================
// API - GET ALL WEBSITES
// ==========================================

app.get("/api/websites", (req, res) => {
  res.status(200).json({
    success: true,
    websites,
  });
});

// ==========================================
// API - GET ONE WEBSITE
// ==========================================

app.get("/api/websites/:id", (req, res) => {
  const id = req.params.id;

  const website = websites.find(
    (item) => String(item.id) === String(id)
  );

  if (!website) {
    return res.status(404).json({
      success: false,
      message: "Website not found",
    });
  }

  res.status(200).json({
    success: true,
    website,
  });
});

// ==========================================
// API - ADD WEBSITE
// ==========================================

app.post("/api/websites", (req, res) => {
  const {
    name,
    url,
    category = "None Leads websites",
    status = "Working",
  } = req.body;

  if (!name || !url) {
    return res.status(400).json({
      success: false,
      message: "Website name and URL are required",
    });
  }

  const newWebsite = {
    id: Date.now(),
    name,
    url,
    category,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  websites.push(newWebsite);

  res.status(201).json({
    success: true,
    message: "Website added successfully",
    website: newWebsite,
  });
});

// ==========================================
// API - UPDATE WEBSITE
// ==========================================

app.put("/api/websites/:id", (req, res) => {
  const id = req.params.id;

  const index = websites.findIndex(
    (item) => String(item.id) === String(id)
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Website not found",
    });
  }

  websites[index] = {
    ...websites[index],
    ...req.body,
    id: websites[index].id,
    updatedAt: new Date().toISOString(),
  };

  res.status(200).json({
    success: true,
    message: "Website updated successfully",
    website: websites[index],
  });
});

// ==========================================
// API - DELETE WEBSITE
// ==========================================

app.delete("/api/websites/:id", (req, res) => {
  const id = req.params.id;

  const index = websites.findIndex(
    (item) => String(item.id) === String(id)
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Website not found",
    });
  }

  const deletedWebsite = websites[index];

  websites.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Website deleted successfully",
    website: deletedWebsite,
  });
});

// ==========================================
// API - DASHBOARD COUNTS
// ==========================================

app.get("/api/dashboard", (req, res) => {
  const working = websites.filter(
    (website) => website.status === "Working"
  ).length;

  const notWorking = websites.filter(
    (website) => website.status === "Not Working"
  ).length;

  const broken = websites.filter(
    (website) => website.status === "Broken"
  ).length;

  const noneLeads = websites.filter(
    (website) => website.category === "None Leads websites"
  ).length;

  const leads = websites.filter(
    (website) => website.category === "Leads websites"
  ).length;

  res.status(200).json({
    success: true,
    counts: {
      total: websites.length,
      working,
      notWorking,
      broken,
      noneLeads,
      leads,
    },
  });
});

// ==========================================
// SERVE REACT FRONTEND
// ==========================================

app.use(express.static(clientPath));

// ==========================================
// REACT ROUTING FALLBACK
// ==========================================
//
// This allows React Router pages such as:
//
// /dashboard
// /websites
// /categories
// /plugin-tracker
//
// to work in production.

app.use((req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }

  // Don't send index.html for unknown API routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API route not found",
    });
  }

  res.sendFile(path.join(clientPath, "index.html"));
});

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, "0.0.0.0", () => {
  console.log("======================================");
  console.log("Form Testing Dashboard Server");
  console.log("======================================");
  console.log(`Port: ${PORT}`);
  console.log(`React build: ${clientPath}`);
  console.log(`Environment: ${process.env.NODE_ENV || "production"}`);
  console.log("Server is running on 0.0.0.0");
  console.log("======================================");
});