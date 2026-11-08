import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./models/User.js";
import { connectDatabase } from "./db.js";

function createToken(user) {
  if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not configured");
  return jwt.sign({ id: user._id.toString(), name: user.name, email: user.email, image: user.image || "", provider: user.provider, role: user.role || null }, process.env.SESSION_SECRET, { expiresIn: "7d" });
}

export function configureGoogle() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return false;
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      await connectDatabase();
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error("Google account did not provide an email"));
      let user = await User.findOne({ email });
      if (!user) user = await User.create({ email, name: profile.displayName, googleId: profile.id, image: profile.photos?.[0]?.value, provider: "google" });
      else if (profile.photos?.[0]?.value && user.image !== profile.photos[0].value) {
        user.image = profile.photos[0].value;
        user.googleId = profile.id;
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
  return true;
}

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try {
    req.user = jwt.verify(token, process.env.SESSION_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ message: "Admin access required" });
  return next();
}

export async function register(req, res) {
  const { name, email, password, role = null } = req.body;
  if (role && !["DONOR", "RECIPIENT"].includes(role)) return res.status(400).json({ message: "Only Donor or Recipient roles are available for registration" });
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
  if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
  await connectDatabase();
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: "An account with this email already exists" });
  const user = await User.create({ name, email, role, passwordHash: await bcrypt.hash(password, 12) });
  return res.status(201).json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, image: user.image, role: user.role } });
}

export async function login(req, res) {
  const { email, password } = req.body;
  await connectDatabase();
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user?.passwordHash || !(await bcrypt.compare(password || "", user.passwordHash))) return res.status(401).json({ message: "Invalid email or password" });
  return res.json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, image: user.image, role: user.role } });
}

export async function adminLogin(req, res) {
  const email = req.body.email?.toLowerCase();
  const password = req.body.password || "";
  if (email === process.env.ADMIN_EMAIL?.toLowerCase() && password === process.env.ADMIN_PASSWORD) {
    await connectDatabase();
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name: "ShareMeal Admin", email, passwordHash: await bcrypt.hash(password, 12), role: "ADMIN", provider: "credentials" });
    else if (user.role !== "ADMIN") { user.role = "ADMIN"; await user.save(); }
    return res.json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, image: user.image, role: "ADMIN" } });
  }
  await connectDatabase();
  const user = await User.findOne({ email, role: "ADMIN" });
  if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: "Invalid admin credentials" });
  return res.json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, image: user.image, role: "ADMIN" } });
}

export async function updateRole(req, res) {
  const { role } = req.body;
  if (!["DONOR", "RECIPIENT"].includes(role)) return res.status(400).json({ message: "Choose Donor or Recipient" });
  await connectDatabase();
  const user = await User.findByIdAndUpdate(req.user.id, { role }, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, image: user.image, role: user.role } });
}

export function googleCallback(req, res) {
  const token = createToken(req.user);
  const redirect = process.env.GOOGLE_SUCCESS_REDIRECT || "http://localhost:5173/";
  return res.redirect(`${redirect}?token=${encodeURIComponent(token)}`);
}
