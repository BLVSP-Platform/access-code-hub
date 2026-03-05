import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/ui/login-form";
import { useAuth } from "@/hooks/use-auth";

export const LoginPage = () => {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) return <Navigate to="/" replace />;

	return <LoginForm />;
};
