import { createAuthClient } from "better-auth/react";
import { rateLimiterClient } from "better-auth-rate-limiter/client";

export const { signIn, signUp, useSession } = createAuthClient({
	baseURL: import.meta.env.VITE_CLIENT_URL,
	plugins: [rateLimiterClient()],
});
