import { useSession } from "@/lib/auth";

export function useAuth() {
	const { data, isPending } = useSession();

	return {
		user: data,
		isLoading: isPending,
		isAuthenticated: !isPending && !!data,
	};
}
