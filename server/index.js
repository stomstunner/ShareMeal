import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import { configureGoogle, googleCallback } from "./auth.js";
import { adminRouter, authRouter, foodRouter, requestRouter } from "./routes.js";
import { uploadRouter } from "./upload.js";

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = new Set([
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
}));
app.use(express.json());
app.use(passport.initialize());
app.use("/api/auth", authRouter);
app.use("/api/food", foodRouter);
app.use("/api/requests", requestRouter);
app.use("/api/admin", adminRouter);
app.use("/api/uploads", uploadRouter);

if (configureGoogle()) {
  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
  app.get("/api/auth/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google` }), googleCallback);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "ShareMeal API" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ message: "Server error. Check the API logs." });
});

app.listen(port, () => {
  console.log(`ShareMeal API running at http://localhost:${port}`);
});
