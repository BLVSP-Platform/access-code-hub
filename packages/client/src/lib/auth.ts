import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, useSession, updateUser } = createAuthClient({
	baseURL: import.meta.env.VITE_SERVER_URL,
	plugins: [
		inferAdditionalFields({
			user: {
				about: { type: "string", required: false },
				toolsList: { type: "string", required: false },
			},
		}),
	],
	fetchOptions: {
		credentials: "include",
	},
});
