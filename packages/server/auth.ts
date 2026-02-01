import { betterAuth } from "better-auth";
import { MongoClient, ServerApiVersion } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import 'dotenv/config'

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not provided");
    process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;
console.log(`Logging into mongo with ${MONGODB_URI}`);

const client = new MongoClient(MONGODB_URI, {
    serverApi: ServerApiVersion.v1,
});

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