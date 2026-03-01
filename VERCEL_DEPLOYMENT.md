# Deploy to Vercel - Complete Guide

## 🚀 Quick Steps (Both Frontend & Backend on Vercel)

### Prerequisites
- GitHub account with your code pushed
- Vercel account (sign up at https://vercel.com)
- Neon PostgreSQL database ready

---

## Part 1: Deploy Backend API

### Step 1: Create New Vercel Project for Backend

1. Go to https://vercel.com and log in
2. Click **"Add New..."** → **"Project"**
3. Import your repository: `prabhat76/rrenterprises`
4. **IMPORTANT**: Name it `rrenterprises-api` or `rrenterprises-backend`

### Step 2: Configure Backend Project

In the project configuration screen:

**Framework Preset:** Other (leave blank)

**Root Directory:** Click **"Edit"** → Select **`backend`**

**Build Command:** Leave empty (Vercel auto-detects)

**Output Directory:** Leave empty

**Install Command:** `npm install`

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add these:

```
DB_HOST = ep-fancy-snow-aib3um5n-pooler.c-4.us-east-1.aws.neon.tech
DB_USER = neondb_owner
DB_PASS = npg_w7mPGtrWo8jF
DB_NAME = neondb
DB_PORT = 5432
DB_DIALECT = postgres
DB_SSL = true
JWT_SECRET = your-random-secret-key-change-this
NODE_ENV = production
FRONTEND_URL = https://your-frontend.vercel.app
```

**Note:** You'll update `FRONTEND_URL` after deploying frontend in Part 2.

### Step 4: Deploy Backend

1. Click **"Deploy"**
2. Wait for deployment (takes 2-3 minutes)
3. **Copy your backend URL**: `https://rrenterprises-api.vercel.app`

Test it by visiting: `https://rrenterprises-api.vercel.app/api/products`

---

## Part 2: Deploy Frontend

### Step 1: Create New Vercel Project for Frontend

1. Click **"Add New..."** → **"Project"** again
2. Import the **SAME** repository: `prabhat76/rrenterprises`
3. Name it `rrenterprises` or `rrenterprises-frontend`

### Step 2: Configure Frontend Project

**Framework Preset:** Create React App (auto-detected)

**Root Directory:** Already configured in `vercel.json` ✅

**Build Command:** Auto-detected from `vercel.json` ✅

**Output Directory:** `frontend/build` (from `vercel.json`) ✅

### Step 3: Add Environment Variable

Click **"Environment Variables"** and add:

```
REACT_APP_API_URL = https://rrenterprises-api.vercel.app
```

**Replace** with your actual backend URL from Part 1!

### Step 4: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (takes 2-3 minutes)
3. Your app is live at: `https://rrenterprises.vercel.app`

---

## Part 3: Update CORS Configuration

### Step 1: Update Backend Environment Variable

1. Go to backend project: `rrenterprises-api`
2. Click **Settings** → **Environment Variables**
3. Find `FRONTEND_URL`
4. **Edit** it to your actual frontend URL: `https://rrenterprises.vercel.app`

### Step 2: Redeploy Backend

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

---

## Part 4: Initialize Database

### Option A: Using Neon SQL Editor (Easiest)

1. Go to https://neon.tech dashboard
2. Select your project
3. Click **"SQL Editor"**
4. Copy contents of `schema.sql` from your repo
5. Paste and **Run** the SQL
6. Data is now initialized!

### Option B: Using Vercel Backend Shell

1. Go to your backend project settings
2. Navigate to Functions → Select any function → Click "View Runtime Logs"
3. You can't directly run scripts on Vercel serverless, so use Neon dashboard instead

### Seed Products (Optional)

You'll need to run `seed-products.js` locally connected to Neon:

```bash
cd backend
# Update .env with Neon credentials
node seed-products.js
```

---

## 🎉 Testing Your Deployed App

### Test Backend API
```bash
# Health check
curl https://rrenterprises-api.vercel.app

# Get products (should return empty array initially)
curl https://rrenterprises-api.vercel.app/api/products
```

### Test Frontend
1. Visit: `https://rrenterprises.vercel.app`
2. Try to register a new user
3. Login with credentials
4. Check if dashboard loads

### Test QR Scanner (Mobile)
1. Open on mobile: `https://rrenterprises.vercel.app/qr-scanner.html`
2. Grant camera permissions
3. Scan a generated QR code

---

## 📋 Deployment Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend environment variables configured
- [ ] Backend URL copied for frontend
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable (`REACT_APP_API_URL`) set
- [ ] CORS updated with frontend URL
- [ ] Backend redeployed with updated CORS
- [ ] Database schema initialized in Neon
- [ ] Product data seeded
- [ ] Test user registration/login
- [ ] Test API endpoints
- [ ] Test QR scanner on mobile

---

## 🔧 Troubleshooting

### "Failed to fetch" or CORS errors
- ✅ Check `FRONTEND_URL` is set correctly in backend
- ✅ Redeploy backend after changing environment variables
- ✅ Frontend URL must match exactly (no trailing slash)

### "Database connection failed"
- ✅ Check all `DB_*` environment variables are set
- ✅ Verify Neon database is not paused
- ✅ Ensure `DB_SSL=true` for Neon

### Frontend shows "Cannot read properties"
- ✅ Check `REACT_APP_API_URL` is set correctly
- ✅ Redeploy frontend after changing environment variables
- ✅ API URL should not have trailing slash

### 504 Gateway Timeout
- ✅ Vercel serverless has 10-second timeout
- ✅ Check database query performance
- ✅ Consider adding indexes to frequently queried columns

### QR Scanner not working
- ✅ Must be accessed via HTTPS (Vercel provides this)
- ✅ Camera permissions must be granted
- ✅ Works best on mobile browsers (Chrome/Safari)

---

## 🔐 Security Recommendations

### Before Going Production:

1. **Change JWT Secret**
   - Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - Update in backend environment variables

2. **Restrict CORS**
   - Set exact frontend URL in `FRONTEND_URL`
   - Don't use wildcard `*` in production

3. **Database Credentials**
   - Never commit `.env` files
   - Rotate Neon password periodically

4. **Add Rate Limiting**
   - Consider adding `express-rate-limit`
   - Protect login endpoints

---

## 📊 Project URLs Summary

After deployment, save these URLs:

```
Frontend: https://rrenterprises.vercel.app
Backend:  https://rrenterprises-api.vercel.app
Database: Neon Console https://console.neon.tech

QR Scanner: https://rrenterprises.vercel.app/qr-scanner.html
```

---

## 🔄 Continuous Deployment

Both projects auto-deploy on git push to `master`:

```bash
git add .
git commit -m "Update feature"
git push origin master
# Vercel automatically deploys both frontend and backend!
```

---

## 💰 Vercel Limits (Free Tier)

- **100 GB Bandwidth/month** - Good for 10K-50K visitors
- **100 GB-Hours serverless** - ~3M function invocations
- **6000 build minutes/month** - ~200 deployments

Your app should stay within free tier for development/testing.

---

## 🎯 Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend  
3. ✅ Initialize database
4. ✅ Test the app
5. 🚀 Share with users!

Need help? Check Vercel docs: https://vercel.com/docs
