import { Router } from "express";
import { connectDatabase } from "./db.js";
import { adminLogin, login, register, requireAdmin, requireAuth, updateRole } from "./auth.js";
import FoodListing from "./models/FoodListing.js";
import Request from "./models/Request.js";
import User from "./models/User.js";
import { sampleListings } from "./data/sampleListings.js";

export const authRouter = Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/admin-login", adminLogin);
authRouter.patch("/role", requireAuth, updateRole);

export const foodRouter = Router();

foodRouter.get("/", async (_req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) return res.json(sampleListings);
    await connectDatabase();
    const listings = await FoodListing.find({ status: "AVAILABLE" }).populate("donorId", "name image").sort({ createdAt: -1 });
    const now = Date.now();
    const liveListings = [];
    for (const listing of listings) {
      const expiry = new Date(listing.createdAt).getTime() + Number(listing.expiryHours || 0) * 60 * 60 * 1000;
      if (expiry <= now && listing.renewOnExpiry) {
        listing.createdAt = new Date();
        listing.status = "AVAILABLE";
        await listing.save();
        liveListings.push(listing);
      } else if (expiry > now) {
        liveListings.push(listing);
      }
    }
    return res.json([...liveListings, ...sampleListings]);
  } catch (error) {
    console.warn("Food database unavailable; serving sample listings.", error.message);
    return res.json(sampleListings);
  }
});

foodRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    await connectDatabase();
    const listing = await FoodListing.create({ ...req.body, donorId: req.user.id, renewOnExpiry: req.user.role === "ADMIN" });
    return res.status(201).json(listing);
  } catch (error) {
    return next(error);
  }
});

foodRouter.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await connectDatabase();
    const filter = req.user.role === "ADMIN" ? { _id: req.params.id } : { _id: req.params.id, donorId: req.user.id };
    const listing = await FoodListing.findOneAndDelete(filter);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

export const requestRouter = Router();
requestRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    await connectDatabase();
    const listing = await FoodListing.findById(req.body.foodListingId);
    if (!listing || listing.status !== "AVAILABLE") return res.status(409).json({ message: "This food is no longer available" });
    const request = await Request.create({ foodListingId: listing._id, donorId: listing.donorId, recipientId: req.user.id, message: req.body.message });
    listing.status = "REQUESTED";
    await listing.save();
    return res.status(201).json(request);
  } catch (error) {
    return next(error);
  }
});
requestRouter.get("/mine", requireAuth, async (req, res, next) => {
  try {
    await connectDatabase();
    return res.json(await Request.find({ $or: [{ recipientId: req.user.id }, { donorId: req.user.id }] }).populate("foodListingId"));
  } catch (error) {
    return next(error);
  }
});

export const adminRouter = Router();
adminRouter.get("/stats", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    await connectDatabase();
    const [users, listings, requests, admins] = await Promise.all([
      User.countDocuments(), FoodListing.countDocuments(), Request.countDocuments(), User.countDocuments({ role: "ADMIN" }),
    ]);
    return res.json({ users, listings, requests, admins });
  } catch (error) { return next(error); }
});

adminRouter.get("/users", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    await connectDatabase();
    return res.json(await User.find({}, "name email image role provider createdAt").sort({ createdAt: -1 }));
  } catch (error) { return next(error); }
});

adminRouter.post("/users", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { name, email, password, role = "RECIPIENT" } = req.body;
    if (!name || !email || !password || !["DONOR", "RECIPIENT", "ADMIN"].includes(role)) return res.status(400).json({ message: "Name, email, password and valid role are required" });
    await connectDatabase();
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: "A user with this email already exists" });
    const bcrypt = (await import("bcryptjs")).default;
    const user = await User.create({ name, email: email.toLowerCase(), role, passwordHash: await bcrypt.hash(password, 12) });
    return res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) { return next(error); }
});

adminRouter.patch("/users/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!["DONOR", "RECIPIENT", "ADMIN"].includes(req.body.role)) return res.status(400).json({ message: "Invalid role" });
    await connectDatabase();
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("name email role image");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error) { return next(error); }
});

adminRouter.delete("/users/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ message: "You cannot delete your own admin account" });
    await connectDatabase();
    await User.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (error) { return next(error); }
});

adminRouter.get("/listings", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    await connectDatabase();
    return res.json(await FoodListing.find({}).populate("donorId", "name email").sort({ createdAt: -1 }));
  } catch (error) { return next(error); }
});

adminRouter.patch("/listings/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await connectDatabase();
    const allowed = ["title", "category", "quantity", "expiryHours", "pickupAddress", "city", "description", "imageUrl", "status", "renewOnExpiry"];
    const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const listing = await FoodListing.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    return res.json(listing);
  } catch (error) { return next(error); }
});

adminRouter.delete("/listings/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await connectDatabase();
    await FoodListing.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (error) { return next(error); }
});
