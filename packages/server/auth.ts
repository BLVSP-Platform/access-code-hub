import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { rateLimiter } from "better-auth-rate-limiter";
import { client } from "./db";
import "dotenv/config";

if (!process.env.CLIENT_URL) throw new Error("CLIENT_URL not provided");
if (!process.env.SERVER_URL) throw new Error("SERVER_URL not provided");

export const auth = betterAuth({
	database: mongodbAdapter(client.db(), {
		client,
	}),
	emailAndPassword: {
		enabled: true,
	},
	rateLimit: {
		enabled: false, // Change to true in prod
	},
	trustedOrigins: [process.env.CLIENT_URL],
	baseURL: process.env.SERVER_URL,
	plugins: [
		rateLimiter({
			window: 60,
			max: 100,
			storage: "database",
			detection: "ip",
		}),
	],
});
