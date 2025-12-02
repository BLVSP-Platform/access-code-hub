import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blvsp'

if (!MONGODB_URI) throw new Error("");

const client = new MongoClient(MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: ["http://localhost:5173"]
});