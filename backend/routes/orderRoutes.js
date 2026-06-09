const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Validation helper
const validateOrder = (order) => {
  if (!order.customerName || order.customerName.trim().length === 0) {
    throw new Error("Customer name is required");
  }
  if (!order.phone || !/^\d{10}$/.test(order.phone.toString())) {
    throw new Error("Valid 10-digit phone number is required");
  }
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    throw new Error("At least one item is required");
  }
  return true;
};

// Create order
router.post("/", async (req, res) => {
  try {
    validateOrder(req.body);
    
    const order = new Order({
      customerName: req.body.customerName.trim(),
      phone: req.body.phone.toString(),
      items: req.body.items,
      total: req.body.total || 0,
      status: "Pending"
    });
    
    await order.save();
    
    res.status(201).json({
      message: "✅ Order created successfully",
      orderId: order._id,
      order: order
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders (admin dashboard)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      message: `✅ Found ${orders.length} orders`,
      count: orders.length,
      orders: orders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get orders by status (must be before /:id)
router.get("/status/:status", async (req, res) => {
  try {
    const orders = await Order.find({ status: req.params.status }).sort({ createdAt: -1 });
    res.json({
      status: req.params.status,
      count: orders.length,
      orders: orders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "❌ Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (admin)
router.put("/:id", async (req, res) => {
  try {
    const validStatuses = ["Pending", "Confirmed", "Preparing", "Ready", "Delivered", "Cancelled"];
    
    if (req.body.status && !validStatuses.includes(req.body.status)) {
      return res.status(400).json({ 
        error: `Invalid status. Valid statuses: ${validStatuses.join(", ")}` 
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status || req.body.status,
        customerName: req.body.customerName || undefined,
        phone: req.body.phone || undefined
      },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: "❌ Order not found" });
    }
    
    res.json({
      message: "✅ Order updated successfully",
      order: order
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete order (admin)
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "❌ Order not found" });
    }
    res.json({
      message: "✅ Order deleted successfully",
      deletedOrder: order
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
