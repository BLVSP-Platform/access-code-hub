import { AbsoluteCenter, Grid, Heading, Stack } from "@chakra-ui/react";
import { LuBookmark, LuFile, LuSearch } from "react-icons/lu";
import { PageNavItem } from "@/components/ui/PageNavItem";

function CommunityNavPage() {
	return (
		<Stack>
			<Heading as="h1" size="4xl">
				Community
			</Heading>

			<Stack>
				<AbsoluteCenter>
					<Grid templateColumns="1fr" gap={6}>
						<PageNavItem to="browsethreads" title="Browse Threads" icon={<LuSearch />} />
						<PageNavItem to="postthread" title="Create Post" icon={<LuFile />} />
						<PageNavItem to="bookmarkthread" title="Bookmarked Threads" icon={<LuBookmark />} />
					</Grid>
				</AbsoluteCenter>
			</Stack>
		</Stack>
	);
}

export default CommunityNavPage;
