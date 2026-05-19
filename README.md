# Smart Leads Dashboard

A full-stack MERN lead management dashboard built with TypeScript, JWT authentication, RBAC, advanced filtering, backend pagination, CSV export, Docker, and a responsive React UI.

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS, React Router, React Hook Form
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose
- Auth: JWT, bcrypt password hashing
- DevOps: Docker Compose with MongoDB, API, and web services

## Features

- User registration and login
- Protected routes and JWT token handling
- Role-based access control: `admin` and `sales`
- Leads CRUD with typed models
- Combined filters for status, source, search, and sort
- Debounced search by name or email
- Backend pagination with 10 records per page
- CSV export using the active filters
- Responsive dashboard with loading, empty, and error states
- Dark mode
- Centralized API error handling and request validation

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
cp .env.example .env
cp .env.example server/.env
```

For local non-Docker development, use `MONGO_URI=mongodb://localhost:27017/smart-leads`.
Docker Compose overrides this automatically to `mongodb://mongo:27017/smart-leads` inside the server container.

3. Start MongoDB, then seed demo data:

```bash
npm run seed
```

4. Start both apps:

```bash
npm run dev
```

Client: `http://localhost:5173`  
API: `http://localhost:5000`

Demo credentials after seeding:

- Admin: `admin@smartleads.dev` / `Password123`
- Sales: `sales@smartleads.dev` / `Password123`

## Docker Setup

Create `.env` from `.env.example`, then run:

```bash
docker compose up --build
```

The dashboard will be available at `http://localhost:5173`.

To seed the Docker database:

```bash
docker compose exec server npm run seed:prod --workspace server
```

## Scripts

- `npm run dev`: run frontend and backend in development mode
- `npm run build`: build both workspaces
- `npm run seed`: seed demo users and leads
- `npm run lint`: run lint scripts

## API Documentation

See [docs/API.md](docs/API.md).

## Vercel + Railway Deployment

This repository includes deployment config for a split deployment:

- Frontend on Vercel using `vercel.json`
- Backend on Railway using `railway.json`

### Railway Backend

Create a Railway service from this repository. Railway will use `server/Dockerfile`.

Set these Railway environment variables:

```bash
MONGO_URI=mongodb+srv://USER:PASSWORD@HOST/smart-leads
JWT_SECRET=replace-with-a-long-random-production-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-vercel-app.vercel.app
```

Do not use `mongodb://mongo:27017/smart-leads` on Railway. That hostname only exists inside local Docker Compose. If Railway gives you `MONGO_URL` or `DATABASE_URL` from a MongoDB plugin, the server can use those too.

After deployment, your API base URL will look like:

```bash
https://your-railway-api.up.railway.app/api
```

### Vercel Frontend

Create a Vercel project from this repository. Vercel will use `vercel.json` to build `client`.

Set this Vercel environment variable:

```bash
VITE_API_URL=https://your-railway-api.up.railway.app/api
```

If your Vercel project root is set to `client`, use these settings:

```bash
Build Command: npm run build
Output Directory: dist
```

If your Vercel project root is the repository root, use these settings:

```bash
Build Command: cd client && npm install && npm run build
Output Directory: client/dist
```

After changing Vercel or Railway environment variables, redeploy the affected service.

## Submission Notes

Add your GitHub repository URL, deployment link, and updated resume before sending the assignment email:

Subject: `MERN Internship Assignment Submission - Your Name`

## Deployment

See detailed deployment guides:
- [Vercel Frontend Deployment](VERCEL_DEPLOYMENT.md) - Complete guide for deploying to Vercel
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Quick reference for both frontend and backend

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com and import your repository
3. Configure:
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Environment Variable: `VITE_API_URL` = `https://your-backend-api.com/api`
4. Deploy!

**Note**: You'll need to deploy your backend separately (Railway, Render, or Heroku recommended).
