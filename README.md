# Access Code Hub

Access Code Hub is a screen reader accessible platform where Blind and Low Vision Software Professionals (BLVSPs) can find software tools for accessibility, network with other BLVSPs and get involved in community outreach through volunteering. 

- **Client**:
    - [React](https://github.com/facebook/react)
    - [Chakra UI](https://github.com/chakra-ui/chakra-ui)
    - [Vite](https://github.com/vitejs/vite)
    - [TypeScript](https://github.com/microsoft/TypeScript)
- **Server**:
    - [Express](https://github.com/expressjs/express) 
    - [TypeScript](https://github.com/microsoft/TypeScript) 
    - [Better Auth](https://github.com/better-auth/better-auth)
    - [MongoDB](https://www.mongodb.com/docs/drivers/node/current/) 
    - [Mongoose](https://github.com/Automattic/mongoose) 

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
MONGODB_URI=mongodb://localhost:27017/blvsp        # MongoDB connection string
CLIENT_URL=http://localhost:5173                   # Frontend URL
SERVER_URL=http://localhost:8000                   # Backend URL
PORT=8000                                          # Server port
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