const crypto = require("crypto");

const sessions = new Map();
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function createSession(email) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { email, expiresAt: Date.now() + SESSION_TTL_MS });
  return token;
}

function getSession(token) {
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Admin login required. Provide a valid token." });
  }

  const token = authHeader.split(" ")[1];
  const session = getSession(token);

  if (!session) {
    return res.status(401).json({ error: "Invalid or expired session. Please log in again." });
  }

  req.admin = session;
  next();
}

module.exports = { authMiddleware, createSession, getSession };
