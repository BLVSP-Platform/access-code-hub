import { betterAuth } from "better-auth";
import { MongoClient, ServerApiVersion } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import 'dotenv/config'

if (!process.env.MONGODB_USERNAME) throw new Error("MONGODB_USERNAME not provided");
if (!process.env.MONGODB_PASSWORD) throw new Error("MONGODB_PASSWORD not provided");
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.upfmf6g.mongodb.net/?appName=Cluster0`;
console.log(`Logging into mongo with ${MONGODB_URI}`)

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