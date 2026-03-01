# 🚀 QUICK DEPLOYMENT REFERENCE

## ✅ Database Setup - DONE!
Your Neon PostgreSQL database is ready with all tables created.

**Connection Details:**
- Host: `ep-fancy-snow-aib3um5n-pooler.c-4.us-east-1.aws.neon.tech`
- Database: `neondb`
- User: `neondb_owner`
- Password: `npg_w7mPGtrWo8jF`

## 📦 DEPLOY BACKEND

### 1. Login to Vercel
```bash
cd backend
npx vercel login
```

### 2. Deploy Backend
```bash
npx vercel --prod
```

**Answer prompts:**
- Set up and deploy? **Y**
- Link to existing project? **N**
- Project name? **rr-enterprises-backend** (or any name)
- Directory? **./** (press Enter)
- Override settings? **N**

### 3. Add Environment Variables in Vercel Dashboard

After deployment, go to: https://vercel.com/dashboard

1. Click your project: **rr-enterprises-backend**
2. Go to: **Settings** → **Environment Variables**
3. Add these (copy from backend/.env.production):

```
DB_HOST=ep-fancy-snow-aib3um5n-pooler.c-4.us-east-1.aws.neon.tech
DB_PORT=5432
DB_USER=neondb_owner
DB_PASS=npg_w7mPGtrWo8jF
DB_NAME=neondb
JWT_SECRET=rr-enterprises-secret-key-2026-change-this-in-production
NODE_ENV=production
```

### 4. Redeploy Backend (to apply env vars)
```bash
npx vercel --prod
```

### 5. Get Your Backend URL
After successful deployment, copy the URL shown:
```
✅ Production: https://rr-enterprises-backend-xyz.vercel.app
```

## 📱 DEPLOY FRONTEND

### 1. Update API URL
Edit `frontend/.env.production` and replace with your actual backend URL:
```bash
REACT_APP_API_URL=https://rr-enterprises-backend-xyz.vercel.app
```

### 2. Deploy Frontend
```bash
cd ../frontend
npx vercel --prod
```

**Answer prompts:**
- Set up and deploy? **Y**
- Link to existing project? **N**
- Project name? **rr-enterprises-frontend** (or any name)
- Directory? **./** (press Enter)  
- Override settings? **N**

### 3. Get Your Frontend URL
After successful deployment:
```
✅ Production: https://rr-enterprises-frontend-abc.vercel.app
```

## 🔒 UPDATE CORS (Important!)

### 1. Edit backend/app.js
Find the CORS section and add your frontend URL:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://rr-enterprises-frontend-abc.vercel.app'  // ← Add your frontend URL
  ],
  credentials: true
}));
```

### 2. Redeploy Backend
```bash
cd ../backend
npx vercel --prod
```

## ✅ TESTING

Visit your frontend URL and test:
- ✅ Register new account
- ✅ Login
- ✅ Create customer
- ✅ Create invoice
- ✅ Add products
- ✅ Record payment
- ✅ Generate PDF

## 🎉 YOU'RE LIVE!

Your billing system is now deployed at:
- **Frontend:** https://rr-enterprises-frontend-abc.vercel.app
- **Backend:** https://rr-enterprises-backend-xyz.vercel.app

---

## 🚨 Troubleshooting

**Backend 500 error?**
- Check environment variables in Vercel dashboard
- View logs: `npx vercel logs`

**CORS error in browser?**
- Make sure you added frontend URL to backend CORS
- Redeploy backend after CORS update

**Database connection error?**
- Verify Neon database credentials
- Check if Neon database is running

**Frontend shows old content?**
- Clear browser cache (Ctrl+Shift+R)
- Check if build completed successfully

---

**Need help?** See detailed guide: [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)
