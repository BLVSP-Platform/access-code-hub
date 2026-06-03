import { Box, Heading, Link, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api, decodeEntities } from "@/lib/utils";
import type { Tool } from "./ToolIndexPage";

type Bookmark = {
	toolId: Tool;
};

function BookmarkedToolsPage() {
	const [bookmarkedTools, setBookmarkedTools] = useState<Tool[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTools = async () => {
			try {
				const res = await fetch(api("/api/tools/bookmarks/me"), {
					credentials: "include",
				});
				const data: Bookmark[] = await res.json();
				const tools = data.map((b) => b.toolId);
				setBookmarkedTools(tools);
			} catch (err) {
				console.error("Failed to fetch tools:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchTools();
	}, []);

	if (loading) {
		return <Text>Loading....</Text>;
	}

	return (
		<Stack>
			<Heading as="h1" size="4xl">
				My Bookmarked Tools
			</Heading>

			<Box overflowX="auto" width="100%">
				<Table.Root
					size="lg"
					variant="outline"
					showColumnBorder
					css={{
						"--chakra-colors-border": "#5B5B5B",
						_dark: {
							"--chakra-colors-border": "#5e5e5e",
						},
					}}
				>
					<Table.Header>
						<Table.Row bg="secondary">
							<Table.ColumnHeader>Name</Table.ColumnHeader>
							<Table.ColumnHeader>Compatibility</Table.ColumnHeader>
							<Table.ColumnHeader>Description</Table.ColumnHeader>
							<Table.ColumnHeader>Link</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{bookmarkedTools.map((tool) => (
							<Table.Row key={tool._id} bg="tertiary" width="100%">
								<Table.Cell>
									<Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
								</Table.Cell>
								<Table.Cell>{tool.compatibility}</Table.Cell>
								<Table.Cell maxWidth="500px">
									<Text>{tool.description}</Text>
								</Table.Cell>
								<Table.Cell>
									<Link>{decodeEntities(tool.link)}</Link>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</Box>
		</Stack>
	);
}

export default BookmarkedToolsPage;
