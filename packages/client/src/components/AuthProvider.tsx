import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export function RequireAuth({ children }: { children?: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}

export function RequireModerator({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isAdminOrModerator, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (!isAdminOrModerator) return <Navigate to="/forbidden" replace />;

	return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isAdmin, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (!isAdmin) return <Navigate to="/forbidden" replace />;

	return <>{children}</>;
}
