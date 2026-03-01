# 🚀 VERCEL DEPLOYMENT GUIDE - RR ENTERPRISES

Complete guide to deploy your billing system to Vercel (both frontend & backend from single repo).

---

## 📋 DEPLOYMENT OPTIONS

### Option 1: Two Separate Projects (RECOMMENDED ✅)
Deploy frontend and backend as separate Vercel projects. This is simpler and more reliable.

### Option 2: Monorepo Deployment
Deploy both from one repo using Vercel's monorepo features (advanced).

---

## 🎯 OPTION 1: SEPARATE PROJECTS (EASIEST)

This deploys frontend and backend as two independent projects.

### Step 1: Deploy Backend First

#### A. Prepare Backend for Vercel
1. Backend is already configured with `backend/vercel.json`
2. No changes needed to code!

#### B. Deploy Backend to Vercel
```bash
# In terminal, go to backend directory
cd /Users/prabhatkumar/Desktop/roushan/backend

# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### C. During Deployment, Answer Prompts:
```
Set up and deploy? Y
Which scope? [Your account]
Link to existing project? N
Project name? rr-enterprises-backend
Directory? ./
Override settings? N
```

#### D. Add Environment Variables
After deployment, go to Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Click: Your project (rr-enterprises-backend)
3. Go to: Settings → Environment Variables
4. Add these variables:

```
DB_HOST=<your-postgres-host>
DB_PORT=5432
DB_USER=<your-db-username>
DB_PASS=<your-db-password>
DB_NAME=<your-db-name>
JWT_SECRET=<random-string-here>
NODE_ENV=production
```

**IMPORTANT:** You need a PostgreSQL database hosted online!

**Database Options:**
- **Neon** (Free tier): https://neon.tech
- **Supabase** (Free tier): https://supabase.com
- **Railway** (Free $5 credit): https://railway.app
- **ElephantSQL** (Free 20MB): https://www.elephantsql.com

5. Redeploy: `vercel --prod` (to apply env vars)

#### E. Get Your Backend URL
After successful deployment:
```
✅ Backend URL: https://rr-enterprises-backend.vercel.app
```

**Test it:**
```bash
curl https://rr-enterprises-backend.vercel.app
# Should return: {"status":"ok","message":"RR Enterprises API"}
```

---

### Step 2: Deploy Frontend

#### A. Update Frontend API URL
Edit `frontend/src/index.js` or create `.env.production`:

```bash
# Create production environment file
cat > frontend/.env.production << EOF
REACT_APP_API_URL=https://rr-enterprises-backend.vercel.app
EOF
```

#### B. Update API Calls (if needed)
If your frontend doesn't use env variables, update the base URL:

Find in your code (usually in fetch calls):
```javascript
// Change from:
fetch('http://localhost:4000/api/...')

// To:
fetch('https://rr-enterprises-backend.vercel.app/api/...')
```

Or better, use environment variable:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
fetch(`${API_URL}/api/...`)
```

#### C. Deploy Frontend to Vercel
```bash
# Go to frontend directory
cd /Users/prabhatkumar/Desktop/roushan/frontend

# Deploy
vercel --prod
```

#### D. During Deployment, Answer Prompts:
```
Set up and deploy? Y
Which scope? [Your account]
Link to existing project? N
Project name? rr-enterprises-frontend
Directory? ./
Override settings? N
```

#### E. Get Your Frontend URL
After successful deployment:
```
✅ Frontend URL: https://rr-enterprises-frontend.vercel.app
```

---

### Step 3: Update CORS in Backend

Add your frontend URL to CORS whitelist:

Edit `backend/app.js`:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://rr-enterprises-frontend.vercel.app'  // Add this
  ],
  credentials: true
}));
```

Then redeploy backend:
```bash
cd backend
vercel --prod
```

---

## 🎯 OPTION 2: MONOREPO DEPLOYMENT (ADVANCED)

Deploy both frontend and backend from the root directory.

### Step 1: Use Root vercel.json

The `vercel.json` in root is already configured!

### Step 2: Deploy from Root
```bash
cd /Users/prabhatkumar/Desktop/roushan

# Deploy entire monorepo
vercel --prod
```

### Step 3: Configure Build Settings

During setup, Vercel will ask:
```
Output Directory: frontend/build
```

### Step 4: Add Environment Variables

In Vercel Dashboard, add all backend env vars (same as Option 1).

### ⚠️ Challenges with Monorepo:
- Backend runs as serverless functions (different behavior)
- Database connections need special handling
- File uploads may not work (uploads/ folder is ephemeral)
- More complex debugging

**Recommendation:** Use Option 1 (Separate Projects) for simpler setup!

---

## 🗄️ DATABASE SETUP

Your app needs PostgreSQL. Local `localhost` won't work on Vercel!

### Recommended: Neon (Free Tier)

1. Go to: https://neon.tech
2. Sign up (free)
3. Create new project: "rr-enterprises-db"
4. Get connection string:
   ```
   postgres://user:password@ep-xxx.neon.tech/roushan
   ```
5. Parse it into env variables:
   ```
   DB_HOST=ep-xxx.neon.tech
   DB_PORT=5432
   DB_USER=user
   DB_PASS=password
   DB_NAME=roushan
   ```

### Import Your Schema

```bash
# Connect to Neon database
psql "postgres://user:password@ep-xxx.neon.tech/roushan"

# Run schema
\i /Users/prabhatkumar/Desktop/roushan/schema.sql

# Verify
\dt
# Should show 11 tables

# Exit
\q
```

### Seed Products (Optional)

Run the setup script pointing to Neon:
```bash
# Edit setup-db.js temporarily with Neon credentials
DB_HOST=ep-xxx.neon.tech node setup-db.js
```

---

## 🔑 ENVIRONMENT VARIABLES CHECKLIST

### Backend Environment Variables (Vercel Dashboard)
```
✅ DB_HOST          = your-postgres-host.neon.tech
✅ DB_PORT          = 5432
✅ DB_USER          = your-username
✅ DB_PASS          = your-password
✅ DB_NAME          = roushan
✅ JWT_SECRET       = random-secret-key-change-this
✅ NODE_ENV         = production
```

### Frontend Environment Variables (Optional)
```
✅ REACT_APP_API_URL = https://rr-enterprises-backend.vercel.app
```

---

## 🧪 TESTING CHECKLIST

After deployment, verify:

### Backend Tests
```bash
# 1. Health check
curl https://rr-enterprises-backend.vercel.app

# 2. Register user
curl -X POST https://rr-enterprises-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","email":"test@test.com"}'

# 3. Login
curl -X POST https://rr-enterprises-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Should return JWT token
```

### Frontend Tests
1. Open: https://rr-enterprises-frontend.vercel.app
2. Try register
3. Try login
4. Create customer
5. Create invoice
6. Add line items
7. Record payment
8. Generate PDF

---

## ⚡ QUICK DEPLOYMENT COMMANDS

### Deploy Both (Separate Projects)
```bash
# Backend
cd backend && vercel --prod

# Frontend
cd ../frontend && vercel --prod
```

### Redeploy After Changes
```bash
# Just run again
vercel --prod
```

### View Logs
```bash
vercel logs
```

---

## 🚨 COMMON ISSUES & FIXES

### Issue 1: "Database connection failed"
**Fix:** Check environment variables in Vercel Dashboard. Make sure DB_HOST is NOT localhost.

### Issue 2: "CORS error" in browser
**Fix:** Add frontend URL to backend CORS whitelist in `app.js`.

### Issue 3: "Cannot find module 'pg'"
**Fix:** Make sure `package.json` has `pg` in dependencies, then redeploy.

### Issue 4: "Function timeout"
**Fix:** Vercel free tier has 10s timeout. Optimize slow queries or upgrade plan.

### Issue 5: "File upload not working"
**Fix:** Vercel serverless has no persistent storage. Use Cloudinary or AWS S3 for uploads.

### Issue 6: "App shows old version"
**Fix:** Clear browser cache or force refresh (Ctrl+Shift+R).

---

## 💰 COST ESTIMATE

### Free Tier (Vercel)
- ✅ Frontend: FREE (unlimited static hosting)
- ✅ Backend: FREE (100 GB-hours/month serverless)
- ✅ Database (Neon): FREE (3GB storage, 1 project)

**Total: $0/month** for small business use! 🎉

### When to Upgrade
- If >100k requests/month → Vercel Pro ($20/month)
- If >3GB database → Neon Pro ($19/month)
- If need file storage → AWS S3 (~$1-5/month)

---

## 🔒 SECURITY FOR PRODUCTION

### Before Going Live:

1. **Change JWT Secret**
   ```
   Generate new: openssl rand -base64 32
   Update in Vercel env vars
   ```

2. **Use Strong DB Password**
   ```
   Minimum 16 characters, mixed case, numbers, symbols
   ```

3. **Enable HTTPS Only**
   ```javascript
   // In app.js, add:
   if (process.env.NODE_ENV === 'production') {
     app.use((req, res, next) => {
       if (req.header('x-forwarded-proto') !== 'https') {
         res.redirect(`https://${req.header('host')}${req.url}`);
       } else {
         next();
       }
     });
   }
   ```

4. **Add Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

5. **Backup Database**
   - Neon has automatic backups
   - Or schedule manual backups weekly

---

## 🎯 CUSTOM DOMAIN (OPTIONAL)

### Add Your Domain (e.g., rrenterprise.com)

1. Buy domain from: Namecheap, GoDaddy, Google Domains
2. In Vercel Dashboard:
   - Settings → Domains
   - Add: rrenterprise.com
   - Add: www.rrenterprise.com
3. Update DNS records (Vercel shows instructions)
4. Wait 24-48 hours for DNS propagation

**Result:**
- Frontend: https://rrenterprise.com
- Backend: https://api.rrenterprise.com

---

## 📊 MONITORING

### View Analytics
- Vercel Dashboard → Analytics
- See: Requests, errors, performance

### View Logs
```bash
vercel logs --follow
```

### Error Tracking
Consider adding (free tiers available):
- Sentry: https://sentry.io
- LogRocket: https://logrocket.com

---

## ✅ FINAL CHECKLIST

Before announcing to users:

```
□ Backend deployed and responding
□ Frontend deployed and loading
□ Database migrated to cloud (Neon/Supabase)
□ Environment variables set correctly
□ CORS configured with frontend URL
□ Registration working
□ Login working
□ Invoice creation working
□ Payment recording working
□ PDF export working
□ Stock deduction working
□ Reports loading
□ Mobile responsive (test on phone)
□ SSL enabled (https://)
□ Custom domain configured (optional)
```

---

## 🚀 DEPLOYMENT SUMMARY

**Simplest Approach:**

```bash
# 1. Setup cloud database
→ Sign up at neon.tech
→ Get connection string
→ Run schema.sql

# 2. Deploy backend
cd backend
vercel --prod
→ Add env vars in dashboard
→ Get backend URL

# 3. Update frontend with backend URL
echo "REACT_APP_API_URL=https://your-backend.vercel.app" > frontend/.env.production

# 4. Deploy frontend
cd frontend
vercel --prod
→ Get frontend URL

# 5. Update CORS in backend
→ Add frontend URL to cors whitelist
→ Redeploy backend

# 6. Test everything
→ Open frontend URL
→ Try all features
```

**Done! 🎉**

---

## 📞 NEED HELP?

- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Check logs:** `vercel logs`
- **Vercel Discord:** https://vercel.com/discord

---

## 🎓 NEXT STEPS

After successful deployment:

1. Share URL with team
2. Create admin account
3. Import customer data
4. Setup products
5. Test workflows
6. Train staff
7. Go live! 🚀

---

**Deployment Time: ~30 minutes**  
**Difficulty: Beginner-Friendly**  
**Cost: FREE (with free tiers)**

**Your app will be live at:**
- ✅ Frontend: `https://rr-enterprises-frontend.vercel.app`
- ✅ Backend: `https://rr-enterprises-backend.vercel.app`

**Good luck with your deployment! 🚀**
