const cors = require("cors");
const express = require("express");
const path = require("path");

const websitesRouter = require("./routes/websites");
const dashboardRouter = require("./routes/dashboard");
const { authRouter, requireAuth } = require("./routes/auth");

const app = express();

// Architecture A: ONE Render Web Service serves BOTH the React production
// build (client/dist) and the Express API. The browser calls relative
// "/api/..." URLs on the same origin — never http://localhost:5000.
// Render injects PORT; listen on 0.0.0.0 so the platform can route to us.
const PORT = process.env.PORT || 5000;

// React production build location (built with `npm run build` in client/).
const clientPath = path.join(__dirname, "../client/dist");

// Behind Render's proxy (HTTPS termination).
app.set("trust proxy", 1);

// Same-origin production requests need no CORS. CORS only matters for local
// dev (Vite on :5173) or a split frontend — then set FRONTEND_URL on Render.
// NOTE: static assets (/assets/*.js, *.css) must NEVER be CORS-blocked:
// <script type="module crossorigin> requires CORS, and a blocked JS module
// leaves #root empty = blank white screen with no console error body.
const devOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const extraOrigins = String(process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = [...devOrigins, ...extraOrigins];

function isAssetRequest(req) {
  const p = String(req.path || "");
  return (
    p.startsWith("/assets/") ||
    p === "/favicon.svg" ||
    p === "/icons.svg" ||
    /\.(js|css|map|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)$/i.test(p)
  );
}

app.use((req, res, next) => {
  // Assets are always same-origin public files — skip CORS entirely so a
  // missing Origin allowlist entry can never blank the page.
  if (isAssetRequest(req)) {
    return next();
  }
  return cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin ${origin}`));
    },
    credentials: true,
  })(req, res, next);
});

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// No database / SQL. JSON file storage via server/utils + server/services.
// Data persists in server/data/*.json (Render disk resets on redeploy).

// ==========================================
// API ROUTES (mounted routers — do not remove)
// ==========================================
// Final endpoints produced:
//   POST /api/auth/login   (router.post("/login") mounted at /api/auth)
//   GET  /api/auth/status
//   GET/POST/PUT/DELETE /api/websites...
//   GET  /api/dashboard
app.use("/api/auth", authRouter);
app.use("/api/websites", requireAuth, websitesRouter);
app.use("/api/dashboard", requireAuth, dashboardRouter);

// Return JSON (instead of an empty 413) when the photo payload is too big.
app.use((err, req, res, next) => {
  if (err && (err.type === "entity.too.large" || err.status === 413)) {
    return res.status(413).json({
      success: false,
      message:
        "Image is too large. Upload a PNG, JPEG, WebP, or GIF image under 1 MB.",
    });
  }
  return next(err);
});

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

// (Websites + dashboard are served by the mounted routers above;
// auth lives in server/routes/auth.js, websites in routes/websites.js,
// dashboard in routes/dashboard.js.)

/* (Replaced by mounted routers above.) */

/* (Replaced by mounted routers above — PUT /api/websites/:id lives in routes/websites.js.) */

/* (Replaced by mounted routers above — DELETE /api/websites/:id lives in routes/websites.js.) */

/* (Replaced by mounted routers above — GET /api/dashboard lives in routes/dashboard.js.) */

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

  if (err && err.message && String(err.message).startsWith("CORS blocked")) {
    return res.status(403).json({ success: false, message: err.message });
  }

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