# Portfolio Monorepo

This repository is now organized as a production-ready monorepo with a separate frontend and backend.

## Structure

- frontend: Vite + React + TypeScript client
- backend: Express + TypeScript + Drizzle ORM API

## Local development

### 1. Install dependencies

From the repository root:

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 2. Environment variables

Create environment files:

- frontend/.env
- backend/.env

Example values:

```env
# frontend/.env
VITE_API_URL=http://localhost:3000
```

```env
# backend/.env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
JWT_SECRET=your-secret
NODE_ENV=development
PORT=3000
```

### 3. Run the app locally

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

## Build

```bash
cd frontend && npm run build
cd ../backend && npm run build
```

## Database

Run Drizzle migrations:

```bash
cd backend
npm run db:generate
npm run db:push
```

## Deployment

### Backend to Render

- Create a Render Web Service for the backend folder.
- Set the start command to: `npm run start`
- Provide environment variables: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, and `PORT`
- Ensure CORS allows your deployed frontend origin.

### Frontend to Vercel

- Import the frontend folder into Vercel.
- Set the build command to: `npm run build`
- Set the output directory to: `dist`
- Set environment variable: `VITE_API_URL` to the deployed backend URL.
