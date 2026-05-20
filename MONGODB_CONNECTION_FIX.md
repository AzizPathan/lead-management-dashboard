# MongoDB Connection Timeout Fix

## Error
```
Operation `users.findOne()` buffering timed out after 10000ms
```

This means your server cannot connect to MongoDB.

---

## ✅ Quick Fix for Railway

### Step 1: Verify MongoDB is Running

1. Go to Railway dashboard
2. Check **MongoDB** service has green "Online" status
3. If offline, click on it and check logs

### Step 2: Set MONGO_URI Variable

#### Method 1: Using Reference (Recommended)

1. Go to **server** service → **Variables** tab
2. Delete any existing `MONGO_URL` or `MONGO_URI` variable
3. Click **"+ New Variable"**
4. Variable name: `MONGO_URI`
5. Click **"Add Reference"** button
6. Select: **MongoDB** service
7. Select variable: `MONGO_URL`
8. Save

Result: `MONGO_URI=${{MongoDB.MONGO_URL}}`

#### Method 2: Manual Copy

1. Go to **MongoDB** service → **Variables**
2. Copy the `MONGO_URL` value
   - Should look like: `mongodb://mongo:xxxxx@mongodb.railway.internal:27017`
3. Go to **server** service → **Variables**
4. Add variable:
   - Name: `MONGO_URI`
   - Value: (paste the URL)

### Step 3: Redeploy

Railway will automatically redeploy. Wait 1-2 minutes.

### Step 4: Check Logs

1. Go to **server** service → **Deployments**
2. Click latest deployment
3. Look for: **"MongoDB connected"** ✅

---

## Alternative: Use MongoDB Atlas

If Railway MongoDB isn't working, use MongoDB Atlas (free):

### 1. Create Atlas Account

1. Go to https://mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create **M0 Free** cluster

### 2. Create Database User

1. Security → Database Access
2. Add New Database User
3. Username: `smartleads`
4. Password: (generate strong password)
5. Database User Privileges: **Read and write to any database**

### 3. Whitelist All IPs

1. Security → Network Access
2. Add IP Address
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Confirm

### 4. Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy connection string:
   ```
   mongodb+srv://smartleads:<password>@cluster0.xxxxx.mongodb.net/smart-leads?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

### 5. Add to Railway

In Railway server variables:
```
MONGO_URI=mongodb+srv://smartleads:yourpassword@cluster0.xxxxx.mongodb.net/smart-leads?retryWrites=true&w=majority
```

### 6. Redeploy & Check Logs

Look for "MongoDB connected" in deployment logs.

---

## Troubleshooting

### Error: "MongooseServerSelectionError"

**Cause**: Cannot reach MongoDB server

**Solutions**:
1. Check MongoDB service is running in Railway
2. Verify `MONGO_URI` is set correctly
3. For Atlas: Check IP whitelist includes 0.0.0.0/0
4. Check connection string format

### Error: "Authentication failed"

**Cause**: Wrong username/password

**Solutions**:
1. For Railway: Use the auto-generated `MONGO_URL` from MongoDB service
2. For Atlas: Verify username and password in connection string
3. Check database user has correct permissions

### Error: "buffering timed out"

**Cause**: Server cannot connect to database

**Solutions**:
1. Verify `MONGO_URI` environment variable is set
2. Check MongoDB service is online
3. Redeploy server service
4. Check server logs for connection errors

### MongoDB Connected but Still Errors

**Cause**: Database might be empty

**Solution**: Seed the database

```bash
# Using Railway CLI
railway run npm run seed:prod --workspace server

# Or temporarily change start command in Railway:
# Settings → Deploy → Start Command
# Change to: npm run seed:prod --workspace server && npm start --workspace server
# Redeploy, then change back to: npm start --workspace server
```

---

## Verify Connection

### Test Backend Health

Visit: `https://your-server.railway.app/health`

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

If `database: "disconnected"`, MongoDB is not connected.

---

## Complete Environment Variables

### Railway Server

```env
MONGO_URI=${{MongoDB.MONGO_URL}}
# OR for Atlas:
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart-leads

JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d
CLIENT_URL=https://lead-management-dashboard-client.vercel.app
PORT=5000
```

---

## Quick Checklist

- [ ] MongoDB service is running (green "Online" status)
- [ ] `MONGO_URI` variable is set in server service
- [ ] `MONGO_URI` references MongoDB service or uses Atlas URL
- [ ] Server redeployed after adding variable
- [ ] Deployment logs show "MongoDB connected"
- [ ] Health endpoint shows `database: "connected"`
- [ ] Database is seeded with demo data

---

## Still Not Working?

1. **Check Railway MongoDB logs**:
   - MongoDB service → Deployments → Latest → Logs
   - Look for errors

2. **Check server logs**:
   - Server service → Deployments → Latest → Logs
   - Look for connection errors

3. **Try MongoDB Atlas**:
   - Sometimes Railway MongoDB has issues
   - Atlas free tier is reliable

4. **Share the error**:
   - Copy the exact error from Railway logs
   - Check if it's a different issue

---

After fixing, your server should connect to MongoDB successfully! 🎉
