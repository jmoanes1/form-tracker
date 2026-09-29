const express = require("express");
const cors = require("cors");
const websitesRouter = require("./routes/websites");
const dashboardRouter = require("./routes/dashboard");
const { authRouter, requireAuth } = require("./routes/auth");

const app = express();

const PORT = Number(process.env.PORT) || 5000;
const HOST = "127.0.0.1";

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (request, response) => {
  response.json({ success: true, message: "API is running." });
});

app.use("/api/auth", authRouter);
app.use("/api/websites", requireAuth, websitesRouter);
app.use("/api/dashboard", requireAuth, dashboardRouter);

// Return JSON (instead of an empty 413) when the photo payload exceeds the body limit.
app.use((error, request, response, next) => {
  if (error && (error.type === "entity.too.large" || error.status === 413)) {
    return response.status(413).json({ success: false, message: "Image is too large. Upload a PNG, JPEG, WebP, or GIF image under 1 MB." });
  }
  return next(error);
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Backend running on http://${HOST}:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `\nPort ${PORT} is already in use. Another API server is probably still running.\n` +
        `Stop it (Ctrl+C in that terminal) or run: npx kill-port ${PORT}\n`
    );
    process.exit(1);
  }
  throw error;
});
