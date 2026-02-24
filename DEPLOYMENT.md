# Deployment Guide for RR Enterprises

## Overview
This project consists of two parts:
- **Frontend**: React application (deploy to Vercel)
- **Backend**: Node.js API (deploy to Render, Railway, or similar)

## Quick Deploy Steps

### 1. Deploy Backend First

#### Option A: Deploy to Render (Recommended)
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `prabhat76/rrenterprises`
4. Configure:
   - **Name**: `rrenterprises-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
   - **Instance Type**: Free

5. Add Environment Variables:
   ```
   DB_HOST=<your-neon-db-host>
   DB_USER=neondb_owner
   DB_PASSWORD=<your-neon-password>
   DB_NAME=neondb
   DB_PORT=5432
   DB_DIALECT=postgres
   DB_SSL=true
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=4000
   ```

6. Click "Create Web Service"
7. **Save the deployed URL** (e.g., `https://rrenterprises-api.onrender.com`)

#### Option B: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add same environment variables as above
5. Set root directory to `backend`

### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New..." → "Project"
3. Import `prabhat76/rrenterprises` from GitHub
4. Vercel will auto-detect the configuration from `vercel.json`

5. **Add Environment Variable** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add: 
     ```
     REACT_APP_API_URL=https://rrenterprises-api.onrender.com
     ```
   - Replace with your actual backend URL from Step 1

6. Click "Deploy"

### 3. Update Database Connection (If using Neon)

The backend `.env` should use your Neon PostgreSQL credentials:

```env
DB_HOST=ep-fancy-snow-aib3um5n-pooler.c-4.us-east-1.aws.neon.tech
DB_USER=neondb_owner
DB_PASSWORD=npg_w7mPGtrWo8jF
DB_NAME=neondb
DB_PORT=5432
DB_DIALECT=postgres
DB_SSL=true
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Initialize Database

After backend is deployed, run database setup:

```bash
# SSH into your backend server or use Render Shell
cd backend
node setup-db.js
node seed-products.js
```

Or run SQL directly in Neon dashboard using `schema.sql`.

## Troubleshooting

### Frontend Build Fails on Vercel
- ✅ Fixed with `vercel.json` configuration
- Vercel now builds from `frontend` directory

### Backend Not Connecting to Database
- Check environment variables are set correctly
- Verify Neon database is accessible (not paused)
- Check SSL setting: `DB_SSL=true` for Neon

### API Requests Failing from Frontend
- Verify `REACT_APP_API_URL` environment variable is set in Vercel
- Check backend is running and accessible
- Check CORS is enabled in backend (already configured in `app.js`)

### "command not found: react-scripts"
- ✅ Fixed with `vercel.json` - now installs dependencies from `frontend/`

## Architecture

```
┌─────────────────┐
│  Vercel         │
│  (Frontend)     │
│  React App      │
└────────┬────────┘
         │ HTTPS
         │
┌────────▼────────┐         ┌─────────────────┐
│  Render/Railway │────────▶│  Neon Database  │
│  (Backend API)  │         │  PostgreSQL     │
└─────────────────┘         └─────────────────┘
```

## Environment Variables Summary

### Backend (Render/Railway)
```env
DB_HOST=<neon-host>
DB_USER=neondb_owner
DB_PASSWORD=<neon-password>
DB_NAME=neondb
DB_PORT=5432
DB_DIALECT=postgres
DB_SSL=true
JWT_SECRET=<random-secret>
PORT=4000
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Testing Deployed App

1. Visit your Vercel URL: `https://rrenterprises.vercel.app`
2. Try to login/register
3. Test QR scanner: Visit `/qr-scanner.html`
4. Scan products with mobile camera

## Production Checklist

- [ ] Backend deployed and running
- [ ] Database initialized with schema
- [ ] Seed data loaded
- [ ] Frontend environment variable configured
- [ ] CORS configured correctly
- [ ] JWT secret changed from default
- [ ] QR codes generated
- [ ] Mobile scanner tested over HTTPS

## Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs

---

**Important**: The frontend deployment on Vercel will fail until you:
1. Deploy the backend to Render/Railway
2. Set `REACT_APP_API_URL` in Vercel environment variables
