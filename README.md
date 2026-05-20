# BLVSP Platform

Monorepo for Access Code Hub.

- **Client**: React + Vite + TypeScript
- **Server**: Express + TypeScript + MongoDB + Better Auth

## Quick Start

```bash
npm install
npm run dev
```

Client runs at `http://localhost:5173`. Server runs at `http://localhost:8000`.

## Project Structure

```
packages/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # UI components, datatable, navbar
│   │   ├── pages/        # Route pages (Home, Create, ToolDetail)
│   │   ├── lib/          # Utils
│   │   ├── App.tsx       # Router + Navbar
│   │   └── main.tsx      # Entry point
│   └── .env
└── server/          # Express backend
    ├── index.ts    # Server entry
    └── .env
```

## Environment Variables

### Server (`packages/server/.env`)

Copy `.env.example` to `.env`:

```bash
MONGODB_URI=mongodb://localhost:27017/blvsp       # MongoDB connection string
CLIENT_URL=http://localhost:5173                   # Frontend URL
SERVER_URL=http://localhost:8000                   # Backend URL
SERVER_PORT=8000                                   # Server port
BETTER_AUTH_SECRET=your-secret-here                # Random string for Better Auth signing
```

### Client (`packages/client/.env`)

Copy `.env.example` to `.env`:

```bash
VITE_CLIENT_URL=http://localhost:5173/
VITE_SERVER_URL=http://localhost:8000/
```

## Setup MongoDB

### Option 1 — MongoDB Atlas (cloud)

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster, get connection string
3. Set `MONGODB_URI` in `packages/server/.env`

### Option 2 — Local MongoDB

1. Install MongoDB Community Edition: [docs.mongodb.com/manual/installation](https://docs.mongodb.com/manual/installation/)
2. Start MongoDB:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Windows
   net start MongoDB
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client + server concurrently |
| `npm run dev:client` | Run client only |
| `npm run dev:server` | Run server only |
| `npm run build` | Build client (run from `packages/client/`) |