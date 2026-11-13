# ShareMeal Run Guide

## Requirements

- Node.js and npm installed
- Dependencies installed:

```powershell
npm install
```

## Environment setup

Create a `.env` file in the project root using `.env.example` as a template. The backend needs at least:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your-mongodb-connection-string
SESSION_SECRET=your-session-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
GOOGLE_SUCCESS_REDIRECT=http://localhost:5173/
```

### Google login setup

In Google Cloud Console, open **APIs & Services > Credentials**, edit the OAuth 2.0 Client ID, and add this exact value under **Authorized redirect URIs**:

```text
http://localhost:5000/api/auth/google/callback
```

Also add this under **Authorized JavaScript origins**:

```text
http://localhost:5173
```

Open the app using <http://localhost:5173> (not `127.0.0.1`) so the local URLs stay consistent. Google OAuth will show `redirect_uri_mismatch` until the exact callback URI above is saved in Google Cloud Console.

## Run frontend only

Open a PowerShell terminal in the project root:

```powershell
npm run dev:client
```

Frontend URL: <http://localhost:5173>

## Run backend only

Open another PowerShell terminal in the project root:

```powershell
npm run dev:server
```

Backend API URL: <http://localhost:5000>

Health check: <http://localhost:5000/api/health>

## Run frontend and backend together

From the project root:

```powershell
npm run dev
```

This starts both services:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:5000>

Keep the terminal open while using the website.
