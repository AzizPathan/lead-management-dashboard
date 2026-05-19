# Vercel Frontend Deployment Guide

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your backend API deployed and accessible (e.g., Railway, Render, Heroku)
3. Git repository pushed to GitHub, GitLab, or Bitbucket

## Step-by-Step Deployment

### 1. Prepare Your Backend API

First, deploy your backend server to a hosting service. Popular options:
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform

Make note of your backend API URL (e.g., `https://your-api.railway.app`)

### 2. Push to Git Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

5. **Add Environment Variable**:
   - Click **"Environment Variables"**
   - Add: `VITE_API_URL` = `https://your-backend-api-url.com/api`
   - Example: `VITE_API_URL` = `https://smart-leads-api.railway.app/api`

6. Click **"Deploy"**

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (enter your project name)
# - Directory? ./
# - Override settings? No

# Add environment variable
vercel env add VITE_API_URL

# When prompted, enter your backend API URL
# Example: https://your-backend-api.railway.app/api

# Deploy to production
vercel --prod
```

### 4. Configure Environment Variables

In Vercel Dashboard:
1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `https://your-backend-api.com/api` | Production, Preview, Development |

**Important**: Replace `https://your-backend-api.com/api` with your actual backend URL

### 5. Update Backend CORS Settings

Update your backend `.env` file to allow requests from Vercel:

```env
CLIENT_URL=https://your-vercel-app.vercel.app,http://localhost:5173
```

In your backend `server/src/app.ts`, ensure CORS is configured:

```typescript
app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || '*',
  credentials: true
}));
```

### 6. Verify Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Test login functionality
3. Check browser console for any API connection errors

## Troubleshooting

### Issue: API requests failing

**Solution**: Check that:
- `VITE_API_URL` environment variable is set correctly in Vercel
- Backend CORS allows your Vercel domain
- Backend API is running and accessible

### Issue: 404 on page refresh

**Solution**: The `vercel.json` file should handle this with rewrites. Ensure it exists in your root directory.

### Issue: Environment variables not working

**Solution**: 
- Redeploy after adding environment variables
- Ensure variable names start with `VITE_` for Vite to expose them
- Check in browser console: `import.meta.env.VITE_API_URL`

### Issue: Build fails

**Solution**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `cd client && npm run build`

## Custom Domain (Optional)

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

## Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you push to other branches or open PRs

## Files Created for Vercel

- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to exclude from deployment

## Next Steps

1. Deploy your backend API
2. Update `VITE_API_URL` in Vercel with your backend URL
3. Update backend `CLIENT_URL` with your Vercel URL
4. Test the deployed application

## Support

- Vercel Documentation: https://vercel.com/docs
- Vite Documentation: https://vitejs.dev/guide/
