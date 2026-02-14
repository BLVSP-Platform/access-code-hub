import { createAuthClient } from "better-auth/react"
import "dotenv/config";

export const { signIn, signUp, useSession } = createAuthClient({
    baseURL: `http://localhost:${process.env.CLIENT_PORT}/`
});