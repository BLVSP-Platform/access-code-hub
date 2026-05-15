import { AbsoluteCenter, Grid, Heading, Stack } from "@chakra-ui/react";
import { LuBookmark, LuFile, LuSearch, LuThumbsUp } from "react-icons/lu";
import { PageNavItem } from "@/components/ui/PageNavItem";

function ToolIndexMainMenuPage() {
	return (
		<Stack>
			<Heading as="h1" size="4xl">
				Tool Index Main Menu
			</Heading>

			<Stack>
				<AbsoluteCenter>
					<Grid templateColumns="1fr" gap={6}>
						<PageNavItem to="index" title="Browse Tools" icon={<LuSearch />} />
						<PageNavItem to="submit" title="Submit a New Tool" icon={<LuFile />} />
						<PageNavItem to="review" title="Submit Reviews for Tools" icon={<LuThumbsUp />} />
						<PageNavItem to="bookmarked" title="My Bookmarked Tools" icon={<LuBookmark />} />
					</Grid>
				</AbsoluteCenter>
			</Stack>
		</Stack>
	);
}

export default ToolIndexMainMenuPage;
