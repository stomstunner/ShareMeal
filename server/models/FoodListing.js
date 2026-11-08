import mongoose from "mongoose";

const foodListingSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ["Cooked", "Raw", "Bakery", "Packaged"], required: true },
  quantity: { type: String, required: true },
  expiryHours: { type: Number, required: true, min: 1 },
  pickupAddress: { type: String, required: true },
  city: { type: String, required: true },
  imageUrl: String,
  description: String,
  status: { type: String, enum: ["AVAILABLE", "REQUESTED", "COMPLETED", "EXPIRED"], default: "AVAILABLE" },
  renewOnExpiry: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.FoodListing || mongoose.model("FoodListing", foodListingSchema);
