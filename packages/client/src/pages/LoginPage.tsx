import { Navigate } from "react-router-dom";
import { AuthDialog } from "@/components/ui/AuthDialog";
import { useAuth } from "@/hooks/use-auth";

export const LoginPage = () => {
	const { isAuthenticated, isPending } = useAuth();

	if (isPending) return null;

	if (isAuthenticated) return <Navigate to="/profile" replace />;

	return <AuthDialog />;
};
