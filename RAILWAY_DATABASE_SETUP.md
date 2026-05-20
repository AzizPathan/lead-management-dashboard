# Railway Database Setup Guide

## Quick Setup: Add MongoDB to Railway

### 1. Add MongoDB Service

1. Open your Railway project: https://railway.app/project/your-project
2. Click **"+ New"** button in your project
3. Select **"Database"**
4. Choose **"Add MongoDB"**
5. Railway creates a MongoDB instance automatically

### 2. Connect Server to MongoDB

#### Method A: Using Variable Reference (Recommended)

1. Go to your **server service**
2. Click **"Variables"** tab
3. Click **"+ New Variable"**
4. Select **"Add Reference"**
5. Choose your MongoDB service
6. Select `MONGO_URL` variable
7. Name it `MONGO_URI`
8. Save

#### Method B: Manual Connection String

1. Go to your **MongoDB service**
2. Click **"Variables"** tab
3. Copy the `MONGO_URL` value (looks like: `mongodb://mongo:xxxxx@mongodb.railway.internal:27017`)
4. Go to your **server service**
5. Add variable:
   - Name: `MONGO_URI`
   - Value: (paste the MongoDB URL)

### 3. Verify Environment Variables

Your Railway server should have these variables:

```
MONGO_URI=mongodb://mongo:xxxxx@mongodb.railway.internal:27017
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=https://your-vercel-app.vercel.app
```

### 4. Redeploy

Railway will automatically redeploy your server. Check the logs:

1. Go to your server service
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Check logs for: `MongoDB connected`

### 5. Seed the Database

After successful deployment, seed your database:

1. Go to your server service
2. Click on the **"..."** menu
3. Select **"Run Command"** or use Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run seed command
railway run npm run seed:prod --workspace server
```

**OR** use the web interface:
- Service → Settings → Deploy Command
- Temporarily change to: `npm run seed:prod --workspace server && npm start --workspace server`
- Redeploy
- Change back to: `npm start --workspace server`

---

## Alternative: MongoDB Atlas (Cloud)

### 1. Create Atlas Account

1. Go to https://mongodb.com/cloud/atlas/register
2. Sign up (free tier available)
3. Create a **M0 Free** cluster

### 2. Create Database User

1. Security → Database Access
2. Add New Database User
3. Set username and password
4. Grant **Read and Write** permissions

### 3. Whitelist IP

1. Security → Network Access
2. Add IP Address
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Confirm

### 4. Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy connection string:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/smart-leads?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

### 5. Add to Railway

In Railway server variables:
- `MONGO_URI` = `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smart-leads?retryWrites=true&w=majority`

---

## Troubleshooting

### Error: "Missing environment variable: MONGO_URI"

**Solution**: Add `MONGO_URI` to Railway environment variables

### Error: "MongooseServerSelectionError"

**Solution**: 
- Check MongoDB service is running
- Verify connection string is correct
- For Atlas: Check IP whitelist includes 0.0.0.0/0

### Error: "Authentication failed"

**Solution**:
- Verify username and password in connection string
- Check database user has correct permissions

### Check Connection

View your server logs in Railway:
- Look for: `MongoDB connected` ✅
- Or error messages ❌

---

## Environment Variables Checklist

### Railway Server Service

- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Random secret key (min 32 chars)
- [ ] `JWT_EXPIRES_IN` - Token expiration (e.g., 7d)
- [ ] `PORT` - Server port (Railway auto-assigns)
- [ ] `CLIENT_URL` - Your Vercel frontend URL

### Vercel Frontend

- [ ] `VITE_API_URL` - Your Railway backend URL + `/api`

---

## Next Steps

1. ✅ Add MongoDB to Railway
2. ✅ Connect server to MongoDB
3. ✅ Verify deployment logs show "MongoDB connected"
4. ✅ Seed the database
5. ✅ Test your application

Your backend should now be connected to the database!
