# Master Instructions for Building the Food Waste Management System

## 1. Project Overview & Context

You are building a production-ready, modern **Food Waste Management System** web application based on the provided project synopsis. The application connects Surplus Food Donors (Restaurants, Canteens, Event Organizers, Individuals) with Recipients (NGOs, Needy individuals, Community Centers) and gives Admins full management oversight.

* **Frontend Tech Stack:** Next.js (App Router), React, Tailwind CSS, Lucide React Icons, Framer Motion (animations), Canvas Confetti.

* **Backend & Database:** Node.js / Next.js API Routes, MongoDB (via Mongoose), Supabase Storage (for food image uploads), NextAuth.js / JWT Auth (Credentials + Google OAuth 2.0).

* **Primary Design Theme:** **Eco Emerald & Clean Slate**

  * Primary Accent: Deep Emerald Green `#0F5132` / `#10B981`

  * Secondary/Background: `#F8FAFC` slate light background with white card containers.

  * Border radius: `rounded-2xl` for modern soft UI look.

## 2. Environment Setup & Configuration (`.env.local`)

The application relies on MongoDB for database storage, Supabase for media asset storage, and Google Developer Console credentials for Google Authentication.

```
# Database
MONGODB_URI=your_mongodb_connection_string

# Supabase Media Storage
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=food-images

# Authentication & Google OAuth
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id_from_gcp
GOOGLE_CLIENT_SECRET=your_google_client_secret_from_gcp

```

## 3. Database Schemas (Mongoose)

### 3.1 User Schema (`models/User.js`)

* `name`: String (Required)

* `email`: String (Required, Unique)

* `password`: String (Optional for Google OAuth users, Hashed for Credentials users)

* `provider`: Enum \[`credentials`, `google`\] (Default: `credentials`)

* `image`: String (Google Profile Avatar URL if logged in via Google)

* `role`: Enum \[`DONOR`, `RECIPIENT`, `ADMIN`\] (Default: `DONOR`)

* `phone`: String

* `address`: String

* `city`: String

* `organizationName`: String (Optional)

* `createdAt`: Date (Default: `Date.now`)

### 3.2 Food Listing Schema (`models/FoodListing.js`)

* `donorId`: ObjectId (Ref: User, Required)

* `title`: String (Required)

* `category`: Enum \[`Cooked Food`, `Raw Ingredients`, `Packaged Food`, `Bakery & Snacks`\]

* `quantity`: String (e.g., "50 Meals", "15 Kg")

* `expiryHours`: Number (Hours until expiry)

* `pickupAddress`: String (Required)

* `city`: String (Required)

* `imageUrl`: String (Supabase public storage URL)

* `description`: String

* `status`: Enum \[`AVAILABLE`, `REQUESTED`, `COMPLETED`, `EXPIRED`\] (Default: `AVAILABLE`)

* `createdAt`: Date (Default: `Date.now`)

### 3.3 Request Schema (`models/Request.js`)

* `foodListingId`: ObjectId (Ref: FoodListing, Required)

* `donorId`: ObjectId (Ref: User, Required)

* `recipientId`: ObjectId (Ref: User, Required)

* `status`: Enum \[`PENDING`, `APPROVED`, `REJECTED`, `COMPLETED`, `CANCELLED`\] (Default: `PENDING`)

* `message`: String

* `requestedAt`: Date (Default: `Date.now`)

## 4. Google OAuth & Authentication Flow

1. **Dual Login Options:** Provide standard Email/Password inputs alongside a prominent **"Continue with Google"** button on both `/login` and `/register` pages.

2. **NextAuth Configuration (`lib/authOptions.js`):**

   * Configure `CredentialsProvider` for traditional login.

   * Configure `GoogleProvider` using `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

   * **Callbacks (`signIn` & `jwt` & `session`):**

     * Check if user exists in MongoDB upon Google sign-in.

     * If new user, create a user record in MongoDB using their Google name, email, and avatar image.

     * If Google user is missing a `role`, redirect them to a quick modal/page `/onboarding/role` to select whether they are a **Donor** or **Recipient**.

## 5. Key Application Architecture & Pages

### 5.1 Root Layout & Global Components

* `app/layout.js`: Global SessionProvider (NextAuth), Toast Notification Provider, Theme Setup.

* `components/Navbar.jsx`: Responsive Navbar showing user profile avatar (Google avatar if present), role badge (`Donor`/`Recipient`), dynamic navigation links, and logout button.

* `components/Footer.jsx`: Platform stats link, quick navigation, contact info, social links.

### 5.2 Page Routes (`app/`)

1. **`app/page.js` (Landing Page)**

   * **Hero Section:** Clean hero with background graphics, key action buttons.

   * **Impact Stat Counter:** Total Meals Saved, Donors Onboarded, NGOs Connected.

   * **How It Works:** Interactive 3-step walkthrough.

   * **Recent Active Listings Carousel/Grid:** Highlighting available food items.

2. **`app/login/page.js` & `app/register/page.js`**

   * Clean card-based auth forms.

   * **Google Sign-In Button:** Modern styled button with official Google SVG logo.

   * Divider (`--- OR ---`) separating Google Login and Email/Password form.

   * Role selection tabs (`Donor` vs `Recipient`) for registration.

3. **`app/onboarding/role/page.js`**

   * First-time Google login screen to choose role (`Donor` or `Recipient`) before redirecting to respective dashboard.

4. **`app/donor/dashboard/page.js`**

   * **Header:** Quick stats (Total Food Posted, Active Items, Successful Donations).

   * **Modal / Form:** "Add New Surplus Food" with Supabase image dropzone upload.

   * **Active Listings Table/Cards:** Edit status, delete, or view incoming requests for that item.

   * **Requests Manager:** Action buttons for Donor to `Approve` or `Reject` recipient requests.

5. **`app/explore/page.js` (Recipient Feed)**

   * Top Search bar + Category pills filter.

   * Real-time filtered grid of `FoodListing` cards.

   * Each card displays image, title, donor city, quantity badge, expiry clock badge, and "Claim / Request" modal trigger.

6. **`app/requests/page.js` (Status Tracker)**

   * Shows all active requests for the logged-in recipient.

   * Interactive Progress Bar: `PENDING` $\rightarrow$ `APPROVED` $\rightarrow$ `COMPLETED`.

   * Donor contact details and pickup location unlocked once status changes to `APPROVED`.

7. **`app/admin/dashboard/page.js`**

   * Analytics overview cards (Users count, Total listings, Completed claims).

   * Management Tabs:

     * Manage Users (Filter by role, ban/delete option).

     * Manage Listings (Moderate inappropriate posts).

     * Global System Audit Logs.

## 6. Step-by-Step Development Order for Cline

### Step 1: Initialization & Dependencies Setup

Execute the following setup commands:

```
npx create-next-app@latest . --javascript --tailwind --eslint --app --src-dir=false
npm install mongoose @supabase/supabase-js next-auth bcryptjs lucide-react clsx tailwind-merge framer-motion react-hot-toast

```

### Step 2: Database & Utility Connections

1. Create `lib/mongodb.js` to handle cached Mongoose database connection.

2. Create `lib/supabase.js` initializing the Supabase client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

3. Create `lib/authOptions.js` configuring NextAuth with both Credentials Provider and Google Provider.

### Step 3: Models & API Endpoints

Create all models in `/models` folder:

* `models/User.js` (updated with `provider` and `image` fields)

* `models/FoodListing.js`

* `models/Request.js`

Implement API routes in `app/api/`:

* `app/api/auth/register/route.js`

* `app/api/user/role/route.js` (Update role for Google Auth users)

* `app/api/food/route.js` (GET all available listings, POST new listing)

* `app/api/food/[id]/route.js` (GET single, PUT status, DELETE)

* `app/api/requests/route.js` (POST create request, GET recipient/donor requests)

* `app/api/requests/[id]/route.js` (PATCH status update: Approve/Reject/Complete)

* `app/api/admin/stats/route.js` (GET overall system numbers)

### Step 4: UI Components Development

Build reusable components in `/components`:

* `Navbar.jsx` (Displays user avatar from Google OAuth if logged in via Google)

* `GoogleAuthButton.jsx` (Custom Google Sign-In button component trigger `signIn('google')`)

* `FoodCard.jsx` (Displays food image from Supabase, status badge, details, and Request modal trigger)

* `ImageUploader.jsx` (Handles image selection, uploads directly to Supabase Storage bucket, returns public URL)

* `StatusBadge.jsx` (Color-coded pills for Available, Requested, Approved, Completed)

* `ImpactCounter.jsx`

### Step 5: Page Assembly & Polish

1. Assemble Landing Page (`app/page.js`) with responsive Hero and Live Impact metrics.

2. Build Auth pages with Google OAuth Button & Role selector.

3. Build Onboarding screen for new Google users to pick their role.

4. Build Donor Dashboard with modern tabs for listings & incoming requests.

5. Build Recipient Explore page with search filters.

6. Build Request Tracking page with step timeline visualization.

7. Build Admin Dashboard with data tables and metrics overview.

### Step 6: Testing & Validation

* Test Google Sign-In flow:

  1. Click "Continue with Google".

  2. Select Google Account.

  3. Set Role (Donor / Recipient) on Onboarding screen.

  4. Verify user record created in MongoDB with avatar URL.

* Test standard food donation & request cycle.

## 7. Deployment Readiness Guide

* In Google Cloud Console (APIs & Services $\rightarrow$ Credentials):

  * Set Authorized Javascript Origins: `http://localhost:3000` (Local) and `https://your-domain.vercel.app` (Production).

  * Set Authorized Redirect URIs: `http://localhost:3000/api/auth/callback/google` and `https://your-domain.vercel.app/api/auth/callback/google`.

* Map `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local` and deployment dashboard (Vercel).

* Supabase Bucket `food-images` must have **Public Access Policy enabled** for GET operations.