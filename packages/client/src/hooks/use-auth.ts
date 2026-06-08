import { useSession } from "@/lib/auth";

export function useAuth() {
	const { data, isPending } = useSession();

	return {
		user: data,
		isLoading: isPending,
		isAuthenticated: !isPending && !!data,
		isAdmin: data?.user?.role === "admin",
		isModerator: data?.user?.role === "moderator",
		isAdminOrModerator: ["admin", "moderator"].includes(data?.user?.role ?? ""),
	};
}
