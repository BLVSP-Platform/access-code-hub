import { createAuthClient } from "better-auth/react"
import "dotenv/config";

export const { signIn, signUp, useSession } = createAuthClient({
    baseURL: import.meta.env.CLIENT_URL
});