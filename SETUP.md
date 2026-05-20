# Smart Leads Dashboard Setup

This guide covers local development, Docker, Vercel frontend deployment, and Railway backend deployment.

## 1. Requirements

- Node.js 20 or newer
- npm
- MongoDB locally, MongoDB Atlas, or Railway MongoDB
- Docker Desktop, optional

## 2. Install Dependencies

From the project root:

```bash
npm install
```

## 3. Local Development

Create `.env` in the project root:

```env
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174
VITE_API_URL=http://localhost:5000/api
```

Seed demo data:

```bash
npm run seed
```

Start frontend and backend:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

Demo users:

```text
admin@smartleads.dev / Password123
sales@smartleads.dev / Password123
```

## 4. Docker Setup

Start the full stack:

```bash
docker compose up -d --build
```

Seed Docker database:

```bash
docker compose exec server npm run seed:prod --workspace server
```

Docker URLs:

```text
Frontend: http://localhost:5173
Backend: http://localhost:5000
```

Note: `mongodb://mongo:27017/smart-leads` is only for Docker Compose. Do not use it on Railway.

## 5. Railway Backend Deployment

Create a Railway service for the backend from this repository.

Railway uses:

```text
railway.json
server/Dockerfile
```

Set these Railway environment variables:

```env
MONGO_URI=mongodb+srv://USER:PASSWORD@HOST/smart-leads
JWT_SECRET=replace-with-a-long-random-production-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://lead-management-dashboard-client.vercel.app
```

Do not set this on Railway:

```env
MONGO_URI=mongodb://mongo:27017/smart-leads
```

After deploy, test:

```text
https://server-production-e97f.up.railway.app/
https://server-production-e97f.up.railway.app/health
```

## 6. Vercel Frontend Deployment

Set this Vercel environment variable:

```env
VITE_API_URL=https://server-production-e97f.up.railway.app/api
```

If Vercel root directory is project root:

```text
Build Command: cd client && npm install && npm run build
Output Directory: client/dist
```

If Vercel root directory is `client`:

```text
Build Command: npm run build
Output Directory: dist
```

After changing `VITE_API_URL`, redeploy Vercel.

## 7. Common Errors

### CORS Error

Make sure Railway has:

```env
CLIENT_URL=https://lead-management-dashboard-client.vercel.app
```

Make sure Vercel has:

```env
VITE_API_URL=https://server-production-e97f.up.railway.app/api
```

### MongoDB ENOTFOUND mongo

You used Docker Mongo URL on Railway. Replace it with MongoDB Atlas or Railway Mongo URL:

```env
MONGO_URI=mongodb+srv://USER:PASSWORD@HOST/smart-leads
```

### Database Is Not Connected

Check:

- `MONGO_URI` is set on Railway backend
- MongoDB username/password are correct
- MongoDB Atlas network access allows Railway
- Railway backend was redeployed after env changes

### Route Not Found

Use API routes with `/api`:

```text
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
GET /api/leads
```

## 8. Useful Commands

Run checks:

```bash
npm run lint
npm run build
```

Restart Docker backend:

```bash
docker compose up -d --build server
```

Restart Docker frontend:

```bash
docker compose up -d --build client
```
