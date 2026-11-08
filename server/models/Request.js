import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  foodListingId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodListing", required: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"], default: "PENDING" },
  message: String,
}, { timestamps: true });

export default mongoose.models.Request || mongoose.model("Request", requestSchema);
