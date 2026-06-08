import {
	Box,
	Button,
	CloseButton,
	Dialog,
	Flex,
	Heading,
	HStack,
	Input,
	InputGroup,
	Link,
	Portal,
	Stack,
	Table,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { InfoTip } from "@/components/ui/toggle-tip";
import { api, formatDate } from "@/lib/utils";
import type { Thread } from "./ThreadDetailPage";

// @todo: NEEDS ACCESSIBILITY

function ThreadsPage() {
	const [search, setSearch] = useState("");
	const [threads, setThreads] = useState<Thread[]>([]);
	const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
	const [loading, setLoading] = useState(true);
	const [lastUpdated, setLastUpdated] = useState<string>("");

	useEffect(() => {
		const fetchTools = async () => {
			try {
				const res = await fetch(api("/api/thread"));
				const data = await res.json();

				setThreads(data);
				setFilteredThreads(data);
			} catch (err) {
				console.error("Failed to fetch threads:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchTools();
	}, []);

	useEffect(() => {
		fetch(api("/api/thread/last-updated"))
			.then((res) => res.json())
			.then((data) =>
				setLastUpdated(
					new Date(data.lastUpdated).toLocaleString("en-US", {
						month: "long",
						day: "numeric",
						year: "numeric",
						hour: "numeric",
						minute: "2-digit",
						hour12: true,
					}),
				),
			);
	}, []);

	const handleFilterSubmit = () => {
		const results = threads.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
		setFilteredThreads(results);
	};

	const searchDialog = (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<Button rounded="full" backgroundColor="primary" color="white">
					Find a Thread
				</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Find Threads</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<VStack>
								<Box width="100%">
									<InputGroup startElement={<LuSearch />}>
										<Input
											placeholder="Search by thread name"
											value={search}
											onChange={(e) => setSearch(e.target.value)}
										/>
									</InputGroup>
								</Box>
							</VStack>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Flex justify="center" w="100%">
									<Button onClick={handleFilterSubmit} bg="primary" w="200px">
										Submit
									</Button>
								</Flex>
							</Dialog.ActionTrigger>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<CloseButton size="xl" />
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);

	if (loading) {
		return <Text>Loading....</Text>;
	}

	return (
		<Stack gap={4}>
			<HStack mb={8}>
				<Heading size="4xl">Browse Threads</Heading>
				<Text fontSize="xs" mt={4}>
					Last Updated: {lastUpdated}
				</Text>
			</HStack>

			<HStack gap={-2}>
				{searchDialog}

				<Box mb={4}>
					<InfoTip content="hellooo" /> {/* placeholder */}
				</Box>
			</HStack>

			<Table.Root size="lg" variant="outline" showColumnBorder>
				<Table.Header>
					<Table.Row bg="secondary">
						<Table.ColumnHeader>Title</Table.ColumnHeader>
						<Table.ColumnHeader>Posted By</Table.ColumnHeader>
						<Table.ColumnHeader>Topic</Table.ColumnHeader>
						<Table.ColumnHeader>Comments</Table.ColumnHeader>
						<Table.ColumnHeader>Last Activity</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{filteredThreads.map((t) => (
						<Table.Row key={t._id} bg="tertiary">
							<Table.Cell>
								<Link href={`threads/${t._id}`}>{t.title}</Link>
							</Table.Cell>
							<Table.Cell>{t.username ?? "Unknown"}</Table.Cell>
							<Table.Cell>{t.topic}</Table.Cell>
							<Table.Cell>{t.commentCount ?? 0}</Table.Cell>
							<Table.Cell>{formatDate(t.updatedAt)}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</Stack>
	);
}

export default ThreadsPage;
