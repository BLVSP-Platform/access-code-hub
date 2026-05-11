import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
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
	trustedOrigins: [process.env.CLIENT_URL, "https://ach-frontend-production.up.railway.app"],
	baseURL: process.env.SERVER_URL,
	advanced: {
		crossSubdomainCookies: {
			enabled: true,
			domain: ".railway.app",
		},
		defaultCookieAttributes: {
			secure: true,
			httpOnly: true,
			sameSite: "none",
			partitioned: true,
		},
	},
});
