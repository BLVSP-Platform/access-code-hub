import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, admin as adminRole, moderator, user } from "./permissions";

export const { signIn, signUp, signOut, useSession, updateUser } = createAuthClient({
	baseURL: import.meta.env.VITE_SERVER_URL,
	fetchOptions: {
		credentials: "include",
	},
	plugins: [
		adminClient({
			ac,
			roles: { admin: adminRole, moderator, user },
		}),
		inferAdditionalFields({
			user: {
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
		}),
	],
});
