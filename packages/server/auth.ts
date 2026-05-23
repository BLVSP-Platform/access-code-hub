import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { rateLimiter } from "better-auth-rate-limiter";
import { client } from "./db";
import "dotenv/config";

if (!process.env.CLIENT_URL) throw new Error("CLIENT_URL not provided");
if (!process.env.SERVER_URL) throw new Error("SERVER_URL not provided");
console.log("CLIENT_URL", process.env.CLIENT_URL);

export const auth = betterAuth({
	database: mongodbAdapter(client.db(), {
		client,
	}),
	user: {
		additionalFields: {
			about: {
				type: "string",
				required: false,
				defaultValue: "",
			},
			toolsList: {
				type: "string",
				required: false,
				defaultValue: "",
			},
			pfp: {
				type: "string",
				required: false,
				defaultValue: "default-pfp.png",
			},
		},
	},
	emailAndPassword: {
		enabled: true,
	},
	rateLimit: {
		enabled: true,
	},
	trustedOrigins: [process.env.CLIENT_URL],
	baseURL: process.env.SERVER_URL,
	advanced: {
		defaultCookieAttributes: {
			secure: true,
			httpOnly: true,
			sameSite: "none",
			partitioned: true,
		},
	},
	plugins: [
		rateLimiter({
			window: 60,
			max: 100,
			storage: "database",
			detection: "ip",
		}),
	],
});
