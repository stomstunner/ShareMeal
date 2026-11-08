# TASK: Build "ShareMeal" - Food Waste Management System
Reference Design & Layout: High-Energy, Professional, vibrant green-yellow-coral brand style (image_2.png).

## 1. TECH STACK & GLOBAL STYLES
- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion, React Icons.
- **Backend/DB**: MongoDB (with Mongoose), Supabase (Storage Buckets), NextAuth.js (with Google OAuth & credentials).
- **Global Themes**: Use "forest green" (`#15803D`), "vibrant sunshine yellow" (`#FBBF24`), and "rich coral-orange" (`#F97316`) for core accents, with massive use of rounded UI elements (`rounded-2xl`, `rounded-3xl`) and organic background wave designs.

---

## 2. LANDING PAGE / HOMEPAGE FRONTEND (Inspired by image_2.png)
- **Navbar**: White with a organic green gradient blurred background. Brand logo "ShareMeal" (green leaf icon) on the left. Navigation: `Home`, `Browse Food`, `Impact`, `Dashboard`. Buttons: `Login` and a dedicated `Continue with Google` (with OAuth redirect).
- **Hero Section**:
  - Left: A major, bold professional heading: `MINIMIZE WASTE. MAXIMIZE IMPACT.`
  - Subtitle: `Connecting surplus food with communities in need. No waste, just sharing.`
  - Action Items: Twin 3D/hover-state CTA buttons: `Donate Surplus Food` (Forest green pulsing animation) and `Claim Available Food` (Coral orange highlight animation). Add a wide "Continue with Google" OAuth button.
  - Right: A rich, custom semi-realistic vector illustration of community teamwork (people loading/sharing crates of fresh food together onto a pickup truck or table).
- **"Your Impact, In Numbers" Section**:
  - A dashboard strip highlighting metrics directly linked to MongoDB aggregate pipelines:
    - Counter 1: `15,400+ kg Saved` (Dynamic icon, green upward badge).
    - Counter 2: `8,500+ Lives Impacted` (Dynamic tracking icon, orange upward badge).
- **"Urgent Listings Near You" Grid**:
  - responsive grid showing actual dynamic listings from MongoDB with the matching Supabase image uploaded.
  - Feature 3D card layout: Real food image, top corner time alert badge `Expires in 3 hrs` (red overlay), tag overlay `Cooked` / `Raw`, and a primary CTA "Claim" button that pops on hover.
- **"How It Works" Section**:
  - Colorful 3-step visualization: `1. Donate` (Fill form), `2. Approve` (Match with Recipient), `3. Share` (Pickup and deliver) on top of cute organic shapes and process direction arrows.

---

## 3. FULL-STACK BACKEND & SERVICE INTEGRATION

### A. NextAuth.js (Google & Credentials Router)
```javascript
// path: src/app/api/auth/[...nextauth]/route.js
// Set up GoogleProvider (OAuth Client/Secret) and CredentialsProvider.
// Create the signup/onboarding redirection flow:
// If a user connects with Google first-time without a pre-assigned Role ('Donor' or 'Recipient'), 
// forcefully redirect them to `/onboarding/role` to select their profile role. Only allow browsing/donating once role is saved to DB.