# CORS Error Fix Guide

## The Problem

Your Vercel frontend (`https://lead-management-dashboard-client.vercel.app`) cannot connect to your Railway backend (`https://server-production-e97f.up.railway.app`) due to CORS policy.

## Quick Fix: Update Railway Environment Variables

### Step 1: Add CLIENT_URL to Railway

1. Go to your Railway project: https://railway.app
2. Click on your **server service**
3. Go to **"Variables"** tab
4. Add or update this variable:

**Variable Name**: `CLIENT_URL`  
**Variable Value**: 
```
https://lead-management-dashboard-client.vercel.app,http://localhost:5173
```

### Step 2: Redeploy

Railway will automatically redeploy your server after adding the variable.

### Step 3: Verify

1. Check deployment logs for "MongoDB connected"
2. Test your Vercel app again
3. CORS error should be gone ✅

---

## Alternative: If Still Not Working

The code already allows all `.vercel.app` domains automatically, but if you still have issues:

### Check Railway Logs

1. Go to Railway → Your server service
2. Click **"Deployments"**
3. Check logs for any errors

### Verify Environment Variables

Make sure these are set in Railway:

```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=https://lead-management-dashboard-client.vercel.app
```

### Test Backend Directly

Open in browser: `https://server-production-e97f.up.railway.app/health`

Should return:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "connected"
  }
}
```

---

## How CORS Works in Your App

Your server (`server/src/app.ts`) has this CORS configuration:

```typescript
const isAllowedOrigin = (origin: string): boolean => {
  // Allow origins in CLIENT_URL environment variable
  if (env.clientUrls.includes(origin)) return true;

  // Automatically allow all *.vercel.app domains
  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === "https:" && hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};
```

This means:
- ✅ All `https://*.vercel.app` domains are automatically allowed
- ✅ Any URL in `CLIENT_URL` environment variable is allowed
- ✅ Credentials (cookies, auth headers) are enabled

---

## Troubleshooting

### Error: "CORS blocked origin"

**Solution**: 
1. Add your Vercel URL to `CLIENT_URL` in Railway
2. Redeploy Railway service

### Error: "No 'Access-Control-Allow-Origin' header"

**Solution**:
1. Check Railway service is running
2. Verify environment variables are set
3. Check Railway logs for errors

### Error: "Failed to load resource: net::ERR_FAILED"

**Solution**:
1. Check Railway backend is accessible: `https://server-production-e97f.up.railway.app/health`
2. Verify MongoDB is connected
3. Check Railway logs

---

## Complete Environment Variables

### Railway (Backend)

```env
MONGO_URI=mongodb://mongo:xxxxx@mongodb.railway.internal:27017
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-leads

JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=https://lead-management-dashboard-client.vercel.app,http://localhost:5173
```

### Vercel (Frontend)

```env
VITE_API_URL=https://server-production-e97f.up.railway.app/api
```

---

## Quick Checklist

- [ ] Railway `CLIENT_URL` includes your Vercel URL
- [ ] Railway service is deployed and running
- [ ] MongoDB is connected (check logs)
- [ ] Backend health check works: `/health`
- [ ] Vercel `VITE_API_URL` is correct
- [ ] Both services redeployed after env changes

After completing these steps, your CORS error should be resolved! 🎉
