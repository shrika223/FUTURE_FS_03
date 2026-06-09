const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    minlength: [3, 'Customer name must be at least 3 characters long'],
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  items: [
    {
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      _id: false
    }
  ],
  total: {
    type: Number,
    required: true,
    min: 0,
    get: (v) => parseFloat(v.toFixed(2))
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
    default: "Pending"
  },
  deliveryAddress: {
    type: String,
    trim: true,
    maxlength: [300, 'Address cannot exceed 300 characters']
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: [500, 'Special instructions cannot exceed 500 characters']
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
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ phone: 1 });

// Validation to ensure items array is not empty
orderSchema.pre('save', function(next) {
  if (!this.items || this.items.length === 0) {
    next(new Error('Order must have at least one item'));
  }
  next();
});

// Update updatedAt timestamp before save
orderSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
