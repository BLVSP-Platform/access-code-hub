import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, useSession } = createAuthClient({
	baseURL: import.meta.env.VITE_CLIENT_URL,
});
