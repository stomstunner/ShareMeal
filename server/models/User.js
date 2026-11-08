import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: String,
  provider: { type: String, enum: ["credentials", "google"], default: "credentials" },
  googleId: String,
  image: String,
  role: { type: String, enum: ["DONOR", "RECIPIENT", "ADMIN"], default: null },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
