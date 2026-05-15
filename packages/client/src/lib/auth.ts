import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, useSession, updateUser } = createAuthClient({
	baseURL: import.meta.env.VITE_SERVER_URL,
	fetchOptions: {
		credentials: "include",
	},
});
