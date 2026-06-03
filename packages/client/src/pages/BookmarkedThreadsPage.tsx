import { Box, Heading, Link, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api, formatDate } from "@/lib/utils";
import type { Thread } from "./ThreadDetailPage";

function BookmarkedThreadsPage() {
	const [bookmarkedThreads, setBookmarkedThreads] = useState<Thread[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBookmarkedThreads = async () => {
			try {
				const res = await fetch(api("/api/thread/bookmarks/me"));
				if (!res.ok) throw new Error(res.statusText);
				const data: Thread[] = await res.json();
				setBookmarkedThreads(data);
			} catch (err) {
				console.error("Failed to fetch bookmarked threads:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchBookmarkedThreads();
	}, []);

	if (loading) {
		return <Text>Loading...</Text>;
	}

	return (
		<Stack>
			<Heading as="h1" size="4xl">
				My Bookmarked Threads
			</Heading>

			<Box overflowX="auto" width="100%">
				<Table.Root
					size="lg"
					variant="outline"
					showColumnBorder
					css={{
						"--chakra-colors-border": "#5B5B5B",
						_dark: { "--chakra-colors-border": "#5e5e5e" },
					}}
				>
					<Table.Header>
						<Table.Row bg="secondary">
							<Table.ColumnHeader>Title</Table.ColumnHeader>
							<Table.ColumnHeader>Topic</Table.ColumnHeader>
							<Table.ColumnHeader>Tags</Table.ColumnHeader>
							<Table.ColumnHeader>Date Created</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{bookmarkedThreads.length === 0 ? (
							<Table.Row>
								<Table.Cell colSpan={4}>No bookmarked threads yet.</Table.Cell>
							</Table.Row>
						) : (
							bookmarkedThreads.map((t) => (
								<Table.Row key={t._id} bg="tertiary">
									<Table.Cell>
										<Link href={`/thread/${t._id}`}>{t.title}</Link>
									</Table.Cell>
									<Table.Cell>{t.topic}</Table.Cell>
									<Table.Cell>{t.tags}</Table.Cell>
									<Table.Cell>{formatDate(t.createdAt)}</Table.Cell>
								</Table.Row>
							))
						)}
					</Table.Body>
				</Table.Root>
			</Box>
		</Stack>
	);
}

export default BookmarkedThreadsPage;
