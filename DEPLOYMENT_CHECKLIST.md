# Deployment Checklist

## ✅ Frontend (Vercel)

### Files Created
- [x] `vercel.json` - Vercel configuration
- [x] `.vercelignore` - Exclude unnecessary files

### Steps
1. [ ] Push code to GitHub/GitLab/Bitbucket
2. [ ] Sign up/login to Vercel (https://vercel.com)
3. [ ] Import your repository
4. [ ] Configure build settings:
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
5. [ ] Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.com/api`
6. [ ] Deploy

### After Deployment
- [ ] Note your Vercel URL: `https://__________.vercel.app`
- [ ] Test the application
- [ ] Update backend CORS with Vercel URL

---

## ✅ Backend (Railway/Render/Heroku)

### Recommended: Railway (Easiest)

1. [ ] Sign up at https://railway.app
2. [ ] Click "New Project" → "Deploy from GitHub repo"
3. [ ] Select your repository
4. [ ] Add service: MongoDB
5. [ ] Configure server service:
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. [ ] Add environment variables:
   ```
   MONGO_URI=<from MongoDB service>
   JWT_SECRET=<generate random string>
   JWT_EXPIRES_IN=7d
   PORT=5000
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
7. [ ] Deploy
8. [ ] Run seed command: `npm run seed:prod`

### After Backend Deployment
- [ ] Note your backend URL: `https://__________.railway.app`
- [ ] Update Vercel `VITE_API_URL` with this URL + `/api`
- [ ] Redeploy Vercel frontend

---

## 🔑 Environment Variables Summary

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend.railway.app/api
```

### Railway/Backend (Server)
```
MONGO_URI=mongodb://...
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=https://your-app.vercel.app
```

---

## 🧪 Testing After Deployment

1. [ ] Visit your Vercel URL
2. [ ] Try to register a new user
3. [ ] Try to login
4. [ ] Create a new lead
5. [ ] Test filters and search
6. [ ] Test CSV export
7. [ ] Check browser console for errors

---

## 📝 URLs to Remember

- Frontend (Vercel): `https://__________.vercel.app`
- Backend API: `https://__________.railway.app`
- GitHub Repo: `https://github.com/________/________`

---

## 🆘 Quick Fixes

### API not connecting
1. Check `VITE_API_URL` in Vercel environment variables
2. Check backend CORS includes Vercel URL
3. Check backend is running

### 404 on page refresh
- Ensure `vercel.json` exists with rewrites configuration

### Login not working
1. Check JWT_SECRET is set in backend
2. Check CORS credentials are enabled
3. Check browser console for errors
