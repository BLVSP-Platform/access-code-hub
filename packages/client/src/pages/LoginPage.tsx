import { Button, Heading, Stack } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { AuthDialog } from "@/components/ui/AuthDialog";
import { useAuth } from "@/hooks/use-auth";

export const LoginPage = () => {
	const { isAuthenticated, isPending } = useAuth();

	if (isPending) return null;

	if (isAuthenticated) return <Navigate to="/profile" replace />;

	return (
		<Stack align="center" textAlign="center" gap="6">
			<Heading as="h1" size="4xl">
				You must be logged in to access this page.
			</Heading>

			<AuthDialog>
				<Button bg="primary">Log in / Sign up</Button>
			</AuthDialog>
		</Stack>
	);
};
