import { Heading, Stack } from "@chakra-ui/react";

function CommunityNavPage() {
	return (
		<Stack>
			<Heading as="h1" size="4xl">
				Page not avaliable yet! Sorry!
			</Heading>
		</Stack>
	);
}

export default CommunityNavPage;

/*
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
*/
