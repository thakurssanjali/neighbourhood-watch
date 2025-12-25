# Deployment Guide

## Architecture
- **Server**: Hosted on Render (https://neighbourhood-watch-api.onrender.com)
- **Client**: Hosted on Vercel (automatically deploys when pushing to main)

## Client Deployment (Vercel)

### 1. Initial Setup on Vercel
1. Connect your GitHub repository to Vercel
2. Select the root folder as your project root
3. Override build settings:
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

### 2. Environment Variables on Vercel
Add this environment variable in Vercel dashboard:
```
VITE_API_URL=https://neighbourhood-watch-api.onrender.com/api
```

### 3. Automatic Deployment
- Every push to `main` branch automatically triggers a Vercel build
- The build is clean and only deploys the React client
- Server and API folders are automatically ignored

## Local Development

### Start Both Server and Client
```bash
npm run dev
```
This runs:
- Server on `http://localhost:5000`
- Client on `http://localhost:5173`

### Development Only
```bash
# Start server only
npm run dev:server

# Start client only
cd client && npm run dev
```

## Client Build

### Build for Production
```bash
cd client && npm run build
```

### Preview Build
```bash
cd client && npm run preview
```

## Environment Files

### `.env.production` (Client)
Automatically loaded by Vite during Vercel build:
```
VITE_API_URL=https://neighbourhood-watch-api.onrender.com/api
```

### `.env.local` (Development - Client)
Used locally during development:
```
VITE_API_URL=https://neighbourhood-watch-api.onrender.com/api
```

## File Structure
```
neighbourhood-watch/
├── client/                 # React Vite app (Deployed to Vercel)
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.local
│   ├── .env.production
│   └── vercel.json        # Client-specific Vercel config
├── server/                # Express API (Deployed to Render)
│   └── package.json
├── api/                   # Legacy API files (ignored by Vercel)
├── package.json           # Root (minimal - only dev scripts)
├── vercel.json           # Root Vercel config
└── .vercelignore         # Files to ignore during Vercel build
```

## Troubleshooting

### Build Fails: "vite: command not found"
- Fixed! The root build script now navigates to client folder before building
- Vercel configuration explicitly includes `npm install` in build command

### API Connection Issues
- Verify `VITE_API_URL` is set in Vercel environment variables
- Check that Render API is accessible: https://neighbourhood-watch-api.onrender.com/api
- Verify `.env.production` has correct API URL

### Local Development API Issues
- Update `.env.local` with your local/production API URL
- The API service automatically includes auth tokens in all requests

## Deployment Flow

```
Push to main branch
    ↓
GitHub webhook to Vercel
    ↓
Vercel runs: cd client && npm install && npm run build
    ↓
Vite builds React app (uses .env.production)
    ↓
Deploy dist folder to Vercel edge
    ↓
Rewrites all routes to index.html (for React Router)
    ↓
Live at vercel deployment URL
```

## Key Improvements
✅ Removed server dependencies from root package.json  
✅ Simplified Vercel build process  
✅ Clean separation of client and server builds  
✅ Automatic environment variable handling  
✅ Server/API folders ignored during Vercel deployment  
