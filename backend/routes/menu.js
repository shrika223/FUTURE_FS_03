const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// GET all menu items
router.get("/", async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
});

// POST new menu item
router.post("/", async (req, res) => {
  const newItem = new MenuItem(req.body);
  await newItem.save();
  res.status(201).json({ message: "Item added!", item: newItem });
});

module.exports = router;
