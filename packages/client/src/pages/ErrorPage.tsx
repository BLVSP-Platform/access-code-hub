import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

const NOT_FOUND_MESSAGE = "The page you are looking for does not exist or may have been moved.";

const UNEXPECTED_ERROR_MESSAGE = "An unexpected error occurred. Please try again later.";

function getErrorMessage(data: unknown, errorMessage: string) {
	if (typeof data === "string") {
		return data;
	}

	if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
		return data.message;
	}

	return errorMessage;
}

function ErrorPage() {
	const error = useRouteError();
	const navigate = useNavigate();

	let heading = "Something Went Wrong";
	let message = UNEXPECTED_ERROR_MESSAGE;

	if (!error) {
		heading = "Page Not Found";
		message = NOT_FOUND_MESSAGE;
	} else if (isRouteErrorResponse(error)) {
		message = getErrorMessage(error.data, message);

		if (error.status === 404) {
			heading = "Page Not Found";
			message = getErrorMessage(error.data, NOT_FOUND_MESSAGE);
		}
	} else if (error instanceof Error && import.meta.env.DEV) {
		message = error.message;
	}

	return (
		<Stack gap={4}>
			<Heading size="4xl">{heading}</Heading>
			<Text>{message}</Text>

			<Flex gap="4" w="100%" justify="flex-start">
				<Button
					borderColor="primary"
					_hover={{ bg: "primary", color: "white" }}
					size="xl"
					variant="outline"
					onClick={() => navigate("/")}
				>
					Return to Home
				</Button>
			</Flex>
		</Stack>
	);
}

export default ErrorPage;
