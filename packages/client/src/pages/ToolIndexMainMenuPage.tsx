import { AbsoluteCenter, Box, Link as ChakraLink, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { LuBookmark, LuFile, LuSearch, LuThumbsUp } from "react-icons/lu";
import { Link as ReactLink } from "react-router-dom";

interface ToolIndexPageProps {
	to: string;
	title: string;
	icon: React.ReactNode;
}

const ToolIndexPageItem = ({ to, title, icon }: ToolIndexPageProps) => {
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

function ToolIndexMainMenuPage() {
	return (
		<Stack>
			<Heading as="h1" size="4xl">
				Tool Index Main Menu
			</Heading>

			<Stack>
				<AbsoluteCenter>
					<Grid templateColumns="1fr" gap={6}>
						<ToolIndexPageItem to="toolsindex" title="Browse Tools" icon={<LuSearch />} />
						<ToolIndexPageItem to="submission" title="Submit a New Tool" icon={<LuFile />} />
						<ToolIndexPageItem to="submitreviews" title="Submit Reviews for Tools" icon={<LuThumbsUp />} />
						<ToolIndexPageItem to="bookmarktool" title="My Bookmarked Tools" icon={<LuBookmark />} />
					</Grid>
				</AbsoluteCenter>
			</Stack>
		</Stack>
	);
}

export default ToolIndexMainMenuPage;
