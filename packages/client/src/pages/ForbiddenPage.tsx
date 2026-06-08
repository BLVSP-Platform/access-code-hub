import { Heading, Stack, Text } from "@chakra-ui/react";

function ForbiddenPage() {
	return (
		<Stack>
			<Heading size="4xl">Access Denied</Heading>
			<Text>You must be an admin or moderator to view this page.</Text>
		</Stack>
	);
}

export default ForbiddenPage;
