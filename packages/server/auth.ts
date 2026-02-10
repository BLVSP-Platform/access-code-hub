import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "./db"
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://cluster0.upfmf6g.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&appName=Cluster0'

// if (!MONGODB_URI) throw new Error("");

// const credentials = "C:\\Users\\green\\Downloads\\X509-cert-9033981711947858141.pem";

export const auth = betterAuth({
    database: mongodbAdapter(client.db(), {
        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: ["http://localhost:5173"]
});