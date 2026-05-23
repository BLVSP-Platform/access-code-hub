# Access Code Hub Server

Express backend for Access Code Hub.

## Setup

1. Copy `.env.example` to `.env`:

2. Set `MONGODB_URI` to your MongoDB connection string.

3. Set `BETTER_AUTH_SECRET` to a random string.

## Run

```bash
npm run dev
```

Server starts on `PORT` (default: `8000`).

## Comments

Better Auth uses MongoDB connection. All other MongoDB transactions should be done using Mongoose.