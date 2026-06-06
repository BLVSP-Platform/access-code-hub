import { Button, Heading, Stack } from "@chakra-ui/react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthDialog } from "@/components/ui/AuthDialog";
import { useAuth } from "@/hooks/use-auth";

export const LoginPage = () => {
	const { isAuthenticated } = useAuth();
	const location = useLocation();
	const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

	if (isAuthenticated) return <Navigate to={from} replace />;

	return (
		<Stack align="center" textAlign="center" gap="6">
			<Heading as="h1" size="4xl">
				You must be logged in to access this page.
			</Heading>

			<AuthDialog redirectTo={from}>
				<Button bg="primary">Log in / Sign up</Button>
			</AuthDialog>
		</Stack>
	);
};
