# 🚨 CORS Error - Quick Fix

## Problem
```
Access to XMLHttpRequest at 'https://server-production-e97f.up.railway.app/api/auth/register' 
from origin 'https://lead-management-dashboard-client.vercel.app' has been blocked by CORS policy
```

## ✅ Solution (2 Minutes)

### 1. Go to Railway Dashboard
🔗 https://railway.app → Your Project → **Server Service**

### 2. Add Environment Variable

Click **"Variables"** tab → **"+ New Variable"**

```
Name:  CLIENT_URL
Value: https://lead-management-dashboard-client.vercel.app
```

### 3. Save & Redeploy

Railway will automatically redeploy (takes ~2 minutes)

### 4. Test Again

Refresh your Vercel app and try to register/login again.

---

## ✅ Done!

Your frontend can now communicate with your backend.

---

## Still Not Working?

### Check These:

1. **Railway Backend Running?**
   - Visit: https://server-production-e97f.up.railway.app/health
   - Should show: `{"success":true,"data":{"status":"ok"}}`

2. **MongoDB Connected?**
   - Check Railway logs for "MongoDB connected"
   - If not, see `RAILWAY_DATABASE_SETUP.md`

3. **Vercel Environment Variable Set?**
   - Vercel → Your Project → Settings → Environment Variables
   - `VITE_API_URL` = `https://server-production-e97f.up.railway.app/api`

---

## Environment Variables Summary

### Railway (Backend)
```
CLIENT_URL=https://lead-management-dashboard-client.vercel.app
MONGO_URI=<your-mongodb-url>
JWT_SECRET=<your-secret-key>
JWT_EXPIRES_IN=7d
PORT=5000
```

### Vercel (Frontend)
```
VITE_API_URL=https://server-production-e97f.up.railway.app/api
```

---

## Need More Help?

See detailed guide: `CORS_FIX.md`
