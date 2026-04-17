import { AbsoluteCenter, Box, Link as ChakraLink, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { LuBookmark, LuFile, LuSearch } from "react-icons/lu";
import { Link as ReactLink } from "react-router-dom";

interface CommunityPageProps {
	to: string;
	title: string;
	icon: React.ReactNode;
}

const CommunityPageItem = ({ to, title, icon }: CommunityPageProps) => {
	return (
		<Box bg="primary/33" borderWidth="1px" borderColor="secondary" w="700px" h="50px">
			<Heading as="h2" rounded="sm" py={2} textAlign="center" mb={2}>
				<ChakraLink asChild>
					<ReactLink to={to}>
						{icon}
						<Text color="black" textAlign="center">
							{title}
						</Text>
					</ReactLink>
				</ChakraLink>
			</Heading>
		</Box>
	);
};

function CommunityNavPage() {
	return (
		<Stack>
			<Heading as="h1" size="4xl">
				Community
			</Heading>

			<Stack>
				<AbsoluteCenter>
					<Grid templateColumns="1fr" gap={6}>
						<CommunityPageItem to="browsethreads" title="Browse Threads" icon={<LuSearch />} />
						<CommunityPageItem to="postthread" title="Create Post" icon={<LuFile />} />
						<CommunityPageItem to="bookmarkthread" title="Bookmarked Threads" icon={<LuBookmark />} />
					</Grid>
				</AbsoluteCenter>
			</Stack>
		</Stack>
	);
}

export default CommunityNavPage;
