# InventoryOS

Modern single-location inventory management SaaS built with
React + TypeScript + Vite (frontend) and Express + TypeScript + Prisma (backend).

## Prerequisites

- Node.js >= 20
- npm >= 10
- PostgreSQL 15+

## Quick Start

```bash
# 1. Install all dependencies (hoisted workspace install)
npm install

# 2. Copy and fill environment variables
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET at minimum

# 3. Generate Prisma client and run initial migration
cd backend
npx prisma migrate dev --name init
cd ..

# 4. Start both dev servers concurrently
npm run dev
```

Frontend: http://localhost:5173  
Backend:  http://localhost:3001

## Project Structure

```
inventoryos/
├── frontend/          # React + Vite SPA
├── backend/           # Express REST API
├── prisma/            # Prisma schema & migrations
├── .env.example       # Environment variable template
└── package.json       # npm workspace root
```

## Available Scripts (run from repo root)

| Command                | Description                        |
|------------------------|------------------------------------|
| `npm run dev`          | Start both servers concurrently    |
| `npm run dev:frontend` | Start Vite dev server only         |
| `npm run dev:backend`  | Start Express server only          |
| `npm run build`        | Production build for both          |
| `npm run lint`         | Run ESLint on both packages        |

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind    |
| Routing    | React Router v6                         |
| Data       | TanStack Query v5, Axios                |
| Backend    | Express 4, TypeScript, tsx              |
| Database   | PostgreSQL + Prisma ORM                 |
| Auth       | JWT (jsonwebtoken)                      |
| Validation | Zod                                     |
