import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export function RequireAuth({ children }: { children?: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isAdminOrModerator, isLoading } = useAuth();

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (!isAuthenticated) return <Navigate to="/login" replace />;

	if (!isAdminOrModerator) return <Navigate to="/forbidden" replace />;

	return <>{children}</>;
}
