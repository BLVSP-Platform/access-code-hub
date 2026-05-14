import { Box, Heading, Link, Text } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";

interface PageNavItemProps {
	to: string;
	title: string;
	icon: React.ReactNode;
}

export const PageNavItem = ({ to, title, icon }: PageNavItemProps) => {
	return (
		<Box bg="primary/33" borderWidth="1px" borderColor="secondary" w="700px" h="50px">
			<Heading as="h2" rounded="sm" py={2} textAlign="center" mb={2}>
				<Link asChild>
					<ReactLink to={to}>
						{icon}
						<Text textAlign="center">{title}</Text>
					</ReactLink>
				</Link>
			</Heading>
		</Box>
	);
};
