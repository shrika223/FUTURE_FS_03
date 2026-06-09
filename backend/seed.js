const mongoose = require("mongoose");
require("dotenv").config();

const menuSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number
});
const Menu = mongoose.model("Menu", menuSchema);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    await Menu.insertMany([
      { name: "Espresso", description: "Strong black coffee", price: 120 },
      { name: "Cappuccino", description: "Coffee with milk foam", price: 150 },
      { name: "Blueberry Muffin", description: "Freshly baked muffin", price: 80 },
      { name: "Veg Sandwich", description: "Grilled sandwich with veggies", price: 100 }
    ]);

    console.log("✅ Menu items added");
    mongoose.connection.close();
  })
  .catch(err => console.error("❌ Error:", err));
