const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Validation helper
const validateMenuItem = (item) => {
  if (!item.name || item.name.trim().length === 0) {
    throw new Error('Name is required');
  }
  if (!item.price || item.price <= 0) {
    throw new Error('Price must be a positive number');
  }
  if (!item.description || item.description.trim().length === 0) {
    throw new Error('Description is required');
  }
  return true;
};

// Add a new menu item
router.post('/', async (req, res, next) => {
  try {
    validateMenuItem(req.body);
    const item = new MenuItem({
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      price: parseFloat(req.body.price)
    });
    await item.save();
    res.status(201).json({
      message: '✅ Menu item added successfully',
      item: item
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all menu items
router.get('/', async (req, res, next) => {
  try {
    const items = await MenuItem.find().sort({ name: 1 });
    res.json({
      message: `✅ Found ${items.length} items`,
      count: items.length,
      items: items
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single menu item
router.get('/:id', async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: '❌ Menu item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update menu item
router.put('/:id', async (req, res, next) => {
  try {
    validateMenuItem(req.body);
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name.trim(),
        description: req.body.description.trim(),
        price: parseFloat(req.body.price)
      },
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ error: '❌ Menu item not found' });
    }
    res.json({
      message: '✅ Menu item updated successfully',
      item: item
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete menu item
router.delete('/:id', async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: '❌ Menu item not found' });
    }
    res.json({
      message: '✅ Menu item deleted successfully',
      deletedItem: item
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
