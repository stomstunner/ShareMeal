import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import { Router } from "express";
import { requireAuth } from "./auth.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
export const uploadRouter = Router();

uploadRouter.post("/", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "An image file is required" });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ message: "Supabase storage is not configured" });
  }
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const safeName = req.file.originalname.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `${req.user.id}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(process.env.SUPABASE_BUCKET || "food-images").upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: false });
  if (error) return res.status(502).json({ message: "Image upload failed", detail: error.message });
  const { data } = supabase.storage.from(process.env.SUPABASE_BUCKET || "food-images").getPublicUrl(path);
  return res.status(201).json({ url: data.publicUrl });
});
