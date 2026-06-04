import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { client } from "./db";
import "dotenv/config";
import { ac, admin as adminRole, moderator, user } from "./permissions";

if (!process.env.CLIENT_URL) throw new Error("CLIENT_URL not provided");
if (!process.env.SERVER_URL) throw new Error("SERVER_URL not provided");

export const auth = betterAuth({
	database: mongodbAdapter(client.db(), {
		client,
	}),
	plugins: [
		admin({
			ac,
			roles: { admin: adminRole, moderator, user },
		}),
	],
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
});
