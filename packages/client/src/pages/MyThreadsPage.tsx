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
import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/lib/auth";
import { api, formatDate } from "@/lib/utils";
import type { Thread } from "./ThreadDetailPage";

function MyThreadsPage() {
	const navigate = useNavigate();
	const { data: sessionData, isPending: sessionPending } = useSession();
	const user = sessionData?.user;

	const [search, setSearch] = useState("");
	const [threads, setThreads] = useState<Thread[]>([]);
	const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const searchInputRef = useRef<HTMLInputElement>(null);
	const resultsRef = useRef<HTMLDivElement>(null);
	const liveRegionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (sessionPending) return;
		if (!user) {
			navigate("/login", { replace: true });
			return;
		}

		const fetchMyThreads = async () => {
			try {
				const res = await fetch(api("/api/thread/me"), { credentials: "include" });
				if (!res.ok) throw new Error("Failed to load threads.");
				const data: Thread[] = await res.json();
				setThreads(data);
				setFilteredThreads(data);
			} catch (e) {
				setError(e instanceof Error ? e.message : "Something went wrong.");
			} finally {
				setLoading(false);
			}
		};

		fetchMyThreads();
	}, [user, sessionPending, navigate]);

	const handleFilterSubmit = () => {
		const results = threads.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
		setFilteredThreads(results);

		if (liveRegionRef.current) {
			liveRegionRef.current.textContent = `${results.length} ${results.length === 1 ? "thread" : "threads"} found.`;
		}

		resultsRef.current?.focus();
	};

	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") handleFilterSubmit();
	};

	const searchDialog = (
		<Dialog.Root onOpenChange={(open) => open && setTimeout(() => searchInputRef.current?.focus(), 0)}>
			<Dialog.Trigger asChild>
				<Button
					rounded="full"
					backgroundColor="primary"
					color="white"
					aria-label="Search your threads by title"
				>
					Find a Thread
				</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
						<Dialog.Header>
							<Dialog.Title id="search-dialog-title">Find My Threads</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<VStack>
								<Box width="100%">
									<InputGroup startElement={<LuSearch aria-hidden="true" />}>
										<Input
											ref={searchInputRef}
											placeholder="Search by thread title"
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											onKeyDown={handleSearchKeyDown}
											aria-label="Search your threads by title"
										/>
									</InputGroup>
								</Box>
							</VStack>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Flex justify="center" w="100%">
									<Button onClick={handleFilterSubmit} bg="primary" w="200px">
										Search
									</Button>
								</Flex>
							</Dialog.ActionTrigger>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<CloseButton size="xl" aria-label="Close search dialog" />
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);

	if (sessionPending || loading) {
		return <Text role="status">Loading...</Text>;
	}

	return (
		<Stack gap={4}>
			<Box
				ref={liveRegionRef}
				aria-live="polite"
				aria-atomic="true"
				position="absolute"
				left="-9999px"
				width="1px"
				height="1px"
				overflow="hidden"
			/>

			<HStack mb={8}>
				<Heading as="h1" size="4xl">
					My Threads
				</Heading>
				<Text fontSize="xs" mt={4} color="gray.500">
					{threads.length} {threads.length === 1 ? "thread" : "threads"} posted
				</Text>
			</HStack>

			{error && (
				<Box role="alert" p="4" borderRadius="md" bg="red.50" borderWidth="1px" borderColor="red.200">
					<Text color="red.600">{error}</Text>
				</Box>
			)}

			<HStack gap={-2}>{searchDialog}</HStack>

			<Box ref={resultsRef} tabIndex={-1} outline="none">
				{filteredThreads.length === 0 && !error ? (
					<Text role="status" color="gray.500" py={8} textAlign="center">
						{search ? `No threads matched "${search}".` : "You haven't posted any threads yet."}
					</Text>
				) : (
					<Table.Root
						size="lg"
						variant="outline"
						showColumnBorder
						aria-label="My threads"
						aria-rowcount={filteredThreads.length}
					>
						<Table.Header>
							<Table.Row bg="secondary">
								<Table.ColumnHeader scope="col">Title</Table.ColumnHeader>
								<Table.ColumnHeader scope="col">Topic</Table.ColumnHeader>
								<Table.ColumnHeader scope="col">Comments</Table.ColumnHeader>
								<Table.ColumnHeader scope="col">Last Activity</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{filteredThreads.map((t) => (
								<Table.Row key={t._id} bg="tertiary">
									<Table.Cell>
										<Link href={`/community/threads/${t._id}`}>{t.title}</Link>
									</Table.Cell>
									<Table.Cell>{t.topic}</Table.Cell>
									<Table.Cell>{t.commentCount ?? 0}</Table.Cell>
									<Table.Cell>{formatDate(t.updatedAt)}</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				)}
			</Box>
		</Stack>
	);
}

export default MyThreadsPage;
