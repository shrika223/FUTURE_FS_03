const express = require("express");
const { createSession, getSession } = require("../middleware/authMiddleware");

const router = express.Router();

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@brewhaven.com").toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "BrewHaven@2024";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail !== ADMIN_EMAIL) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = createSession(normalizedEmail);

    res.json({
      message: "Login successful",
      token,
      admin: { email: normalizedEmail }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.split(" ")[1];
  const session = getSession(token);

  if (!session) {
    return res.status(401).json({ valid: false });
  }

  res.json({ valid: true, admin: { email: session.email } });
});

module.exports = router;
