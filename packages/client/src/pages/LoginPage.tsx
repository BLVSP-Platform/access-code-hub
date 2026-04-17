import { Navigate } from "react-router-dom";
import { AuthDialog } from "@/components/ui/AuthDialog";
import { useAuth } from "@/hooks/use-auth";

export const LoginPage = () => {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) return <Navigate to="/" replace />;

	return <AuthDialog />;
};
