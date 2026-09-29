const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "../data/users.json");
const legacyFile = path.join(__dirname, "../data/user.json");

const VALID_ROLES = ["admin", "staff"];

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, user) {
  if (!user || !user.salt || !user.hash) return false;
  const candidate = crypto.scryptSync(String(password || ""), user.salt, 64);
  const stored = Buffer.from(user.hash, "hex");
  return stored.length === candidate.length && crypto.timingSafeEqual(stored, candidate);
}

function normalizeUsername(username) {
  return String(username || "").trim();
}

function normalizeRole(role) {
  const value = String(role || "staff").trim().toLowerCase();
  return VALID_ROLES.includes(value) ? value : "staff";
}

function readUsers() {
  try {
    const parsed = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object") return [parsed];
    return [];
  } catch {
    // First run after the single-account version: migrate user.json once.
    try {
      const legacy = JSON.parse(fs.readFileSync(legacyFile, "utf8"));
      if (legacy && legacy.username) {
        const migrated = {
          ...legacy,
          username: normalizeUsername(legacy.username),
          role: normalizeRole(legacy.role || "admin"),
        };
        fs.writeFileSync(usersFile, JSON.stringify([migrated], null, 2), "utf8");
        return [migrated];
      }
    } catch {
      // No users yet.
    }
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf8");
}

function findUser(username) {
  const wanted = normalizeUsername(username).toLowerCase();
  if (!wanted) return null;
  return readUsers().find((user) => String(user.username || "").toLowerCase() === wanted) || null;
}

// Backwards-compatible helper: the first account (used for setup checks).
function readUser() {
  const users = readUsers();
  return users[0] || null;
}

function saveUser(user) {
  const users = readUsers();
  const wanted = String(user.username || "").toLowerCase();
  const index = users.findIndex((entry) => String(entry.username || "").toLowerCase() === wanted);
  if (index >= 0) users[index] = user;
  else users.push(user);
  saveUsers(users);
}

function publicUser(user) {
  if (!user) return null;
  return { username: user.username, role: normalizeRole(user.role), avatarUrl: user.avatarUrl || "" };
}

function createUser(username, password, role = "staff") {
  const cleanName = normalizeUsername(username);
  if (!cleanName) throw Object.assign(new Error("Username must contain at least 3 characters."), { status: 400 });
  if (findUser(cleanName)) throw Object.assign(new Error("That username is already taken."), { status: 409 });
  const { salt, hash } = hashPassword(String(password || ""));
  const user = {
    username: cleanName,
    salt,
    hash,
    role: normalizeRole(role),
    avatarUrl: "",
    createdAt: new Date().toISOString(),
  };
  const users = readUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

function updatePassword(user, password) {
  const { salt, hash } = hashPassword(String(password || ""));
  saveUser({ ...user, salt, hash, updatedAt: new Date().toISOString() });
}

function updateUser(user, changes) {
  const updated = { ...user, ...changes, updatedAt: new Date().toISOString() };
  saveUser(updated);
  return updated;
}

function deleteUser(username) {
  saveUsers(readUsers().filter((user) => String(user.username || "").toLowerCase() !== String(username || "").toLowerCase()));
}

module.exports = {
  VALID_ROLES,
  createUser,
  deleteUser,
  findUser,
  normalizeRole,
  publicUser,
  readUser,
  readUsers,
  saveUser,
  saveUsers,
  updatePassword,
  updateUser,
  verifyPassword,
};
