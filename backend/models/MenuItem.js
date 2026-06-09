const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
    minlength: [3, 'Name must be at least 3 characters long']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    minlength: [10, 'Description must be at least 10 characters long']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    get: (v) => parseFloat(v.toFixed(2))
  },
  category: {
    type: String,
    enum: ['Coffee', 'Drinks', 'Food', 'Sweet Treats'],
    default: 'Coffee'
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { getters: true }
});

// Index for better query performance
menuItemSchema.index({ name: 1 });
menuItemSchema.index({ category: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
