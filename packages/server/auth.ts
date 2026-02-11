import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "./db"

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blvsp'

if (!MONGODB_URI) throw new Error("");

export const auth = betterAuth({
    database: mongodbAdapter(client.db(), {
        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: ["http://localhost:5173"]
});