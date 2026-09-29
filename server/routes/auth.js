const crypto = require("crypto");
const express = require("express");

const { createUser, deleteUser, findUser, normalizeRole, publicUser, readUsers, updatePassword, updateUser, verifyPassword } = require("../utils/userStore");

const router = express.Router();
const sessions = new Map();
const SESSION_COOKIE = "form_dashboard_session";

function readCookie(request) {
  const cookies = String(request.headers.cookie || "").split(";");
  const entry = cookies.find((cookie) => cookie.trim().startsWith(`${SESSION_COOKIE}=`));
  return entry ? entry.split("=").slice(1).join("=").trim() : "";
}

function createSession(response, username) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { username, createdAt: Date.now() });
  response.cookie(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 12 });
}

function clearSession(request, response) {
  sessions.delete(readCookie(request));
  response.clearCookie(SESSION_COOKIE);
}

function validateCredentials(body = {}) {
  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  if (username.length < 3) return "Username must contain at least 3 characters.";
  if (password.length < 8) return "Password must contain at least 8 characters.";
  return null;
}

function currentUser(request) {
  const session = sessions.get(readCookie(request));
  if (!session) return null;
  return findUser(session.username);
}

function requireAuth(request, response, next) {
  const user = currentUser(request);
  if (!user) {
    return response.status(401).json({ success: false, message: "Please sign in to continue." });
  }
  request.user = { username: user.username, role: normalizeRole(user.role) };
  request.account = user;
  return next();
}

function requireAdmin(request, response, next) {
  const user = currentUser(request);
  if (!user) {
    return response.status(401).json({ success: false, message: "Please sign in to continue." });
  }
  if (normalizeRole(user.role) !== "admin") {
    return response.status(403).json({ success: false, message: "Only admins can manage accounts." });
  }
  request.user = { username: user.username, role: "admin" };
  request.account = user;
  return next();
}

router.get("/status", (request, response) => {
  const user = currentUser(request);
  response.json({ success: true, data: { setupRequired: readUsers().length === 0, authenticated: Boolean(user), username: user?.username || "", role: user ? normalizeRole(user.role) : "", avatarUrl: user?.avatarUrl || "" } });
});

router.post("/setup", (request, response) => {
  if (readUsers().length > 0) return response.status(409).json({ success: false, message: "An account has already been created." });
  const error = validateCredentials(request.body);
  if (error) return response.status(400).json({ success: false, message: error });
  const user = createUser(String(request.body.username).trim(), String(request.body.password), "admin");
  createSession(response, user.username);
  return response.status(201).json({ success: true, data: publicUser(user) });
});

router.post("/login", (request, response) => {
  const user = findUser(request.body.username);
  if (!user || !verifyPassword(String(request.body.password || ""), user)) {
    return response.status(401).json({ success: false, message: "Incorrect username or password." });
  }
  createSession(response, user.username);
  return response.json({ success: true, data: publicUser(user) });
});

router.post("/logout", requireAuth, (request, response) => {
  clearSession(request, response);
  response.json({ success: true });
});

router.post("/change-password", requireAuth, (request, response) => {
  const user = request.account;
  if (!verifyPassword(String(request.body.currentPassword || ""), user)) {
    return response.status(400).json({ success: false, message: "Your current password is incorrect." });
  }
  const password = String(request.body.password || "");
  if (password.length < 8) return response.status(400).json({ success: false, message: "New password must contain at least 8 characters." });
  updatePassword(user, password);
  return response.json({ success: true, message: "Password updated." });
});

router.post("/profile", requireAuth, (request, response) => {
  const avatarUrl = String(request.body.avatarUrl || "");
  const validImage = !avatarUrl || /^data:image\/(png|jpe?g|webp|gif);base64,/.test(avatarUrl);
  if (!validImage || avatarUrl.length > 1_500_000) {
    return response.status(400).json({ success: false, message: "Upload a PNG, JPEG, WebP, or GIF image under 1 MB." });
  }
  const user = updateUser(request.account, { avatarUrl });
  return response.json({ success: true, data: publicUser(user) });
});

router.get("/users", requireAdmin, (request, response) => {
  return response.json({ success: true, data: readUsers().map(publicUser) });
});

router.post("/users", requireAdmin, (request, response) => {
  const error = validateCredentials(request.body);
  if (error) return response.status(400).json({ success: false, message: error });
  const role = normalizeRole(request.body.role);
  try {
    const user = createUser(String(request.body.username).trim(), String(request.body.password), role);
    return response.status(201).json({ success: true, data: publicUser(user) });
  } catch (creationError) {
    return response.status(creationError.status || 400).json({ success: false, message: creationError.message });
  }
});

router.delete("/users/:username", requireAdmin, (request, response) => {
  const target = findUser(decodeURIComponent(request.params.username));
  if (!target) return response.status(404).json({ success: false, message: "Account not found." });
  if (target.username.toLowerCase() === String(request.account.username || "").toLowerCase()) {
    return response.status(400).json({ success: false, message: "You cannot delete your own account." });
  }
  if (normalizeRole(target.role) === "admin" && readUsers().filter((user) => normalizeRole(user.role) === "admin").length <= 1) {
    return response.status(400).json({ success: false, message: "At least one admin account is required." });
  }
  deleteUser(target.username);
  return response.json({ success: true });
});

module.exports = { authRouter: router, requireAdmin, requireAuth };
