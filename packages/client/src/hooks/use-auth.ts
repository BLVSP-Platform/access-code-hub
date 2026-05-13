import { useSession } from "@/lib/auth";

export function useAuth() {
	const { data, isPending } = useSession();

	return {
		isAuthenticated: Boolean(data?.user),
		isPending,
		user: data?.user,
		session: data?.session,
	};
}
