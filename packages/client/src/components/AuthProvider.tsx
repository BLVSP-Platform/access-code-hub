import { Navigate } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import { useAuth } from "@/hooks/use-auth";

export function RequireAuth({ children }: { children?: React.ReactNode }) {
	const { isAuthenticated, isPending } = useAuth();

	if (isPending) {
		return (
			<Center minH="40vh">
				<Spinner size="lg" />
			</Center>
		);
	}

	if (!isAuthenticated) return <Navigate to="/login" replace />;
	return <>{children}</>;
}
