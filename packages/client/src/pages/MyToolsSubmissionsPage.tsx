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
	RatingGroup,
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
import type { Tool } from "./ToolIndexPage";

type SubmittedTool = Tool & {
	createdAt: string;
	updatedAt: string;
};

function MyToolSubmissionsPage() {
	const navigate = useNavigate();
	const { data: sessionData, isPending: sessionPending } = useSession();
	const user = sessionData?.user;

	const [search, setSearch] = useState("");
	const [tools, setTools] = useState<SubmittedTool[]>([]);
	const [filteredTools, setFilteredTools] = useState<SubmittedTool[]>([]);
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

		const fetchMySubmissions = async () => {
			try {
				const res = await fetch(api("/api/tools/submissions/me"), { credentials: "include" });
				if (!res.ok) throw new Error("Failed to load submissions.");
				const data: SubmittedTool[] = await res.json();
				setTools(data);
				setFilteredTools(data);
			} catch (e) {
				setError(e instanceof Error ? e.message : "Something went wrong.");
			} finally {
				setLoading(false);
			}
		};

		fetchMySubmissions();
	}, [user, sessionPending, navigate]);

	const handleFilterSubmit = () => {
		const results = tools.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
		setFilteredTools(results);

		if (liveRegionRef.current) {
			liveRegionRef.current.textContent = `${results.length} ${results.length === 1 ? "tool" : "tools"} found.`;
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
					aria-label="Search your tool submissions by name"
				>
					Find a Tool
				</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
						<Dialog.Header>
							<Dialog.Title id="search-dialog-title">Find My Submissions</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<VStack>
								<Box width="100%">
									<InputGroup startElement={<LuSearch aria-hidden="true" />}>
										<Input
											ref={searchInputRef}
											placeholder="Search by tool name"
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											onKeyDown={handleSearchKeyDown}
											aria-label="Search your tool submissions by name"
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
					My Submissions
				</Heading>
				<Text fontSize="xs" mt={4} color="gray.500">
					{tools.length} {tools.length === 1 ? "tool" : "tools"} submitted
				</Text>
			</HStack>

			{error && (
				<Box role="alert" p="4" borderRadius="md" bg="red.50" borderWidth="1px" borderColor="red.200">
					<Text color="red.600">{error}</Text>
				</Box>
			)}

			<HStack gap={-2}>{searchDialog}</HStack>

			<Box ref={resultsRef} tabIndex={-1} outline="none">
				{filteredTools.length === 0 && !error ? (
					<Text role="status" color="gray.500" py={8} textAlign="center">
						{search ? `No submissions matched "${search}".` : "You haven't submitted any tools yet."}
					</Text>
				) : (
					<Box overflowX="auto" width="100%">
						<Table.Root
							size="lg"
							variant="outline"
							showColumnBorder
							aria-label="My tool submissions"
							aria-rowcount={filteredTools.length}
							css={{
								"--chakra-colors-border": "#5B5B5B",
								_dark: {
									"--chakra-colors-border": "#5e5e5e",
								},
							}}
						>
							<Table.Header>
								<Table.Row bg="secondary">
									<Table.ColumnHeader scope="col">Name</Table.ColumnHeader>
									<Table.ColumnHeader scope="col">Compatibility</Table.ColumnHeader>
									<Table.ColumnHeader scope="col">Description</Table.ColumnHeader>
									<Table.ColumnHeader scope="col">Overall Rating</Table.ColumnHeader>
									<Table.ColumnHeader scope="col">Submitted</Table.ColumnHeader>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{filteredTools.map((tool) => (
									<Table.Row key={tool._id} bg="tertiary">
										<Table.Cell>
											<Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
										</Table.Cell>
										<Table.Cell>{tool.compatibility ?? "—"}</Table.Cell>
										<Table.Cell maxWidth="400px">
											<Text lineClamp={2} title={tool.description}>
												{tool.description}
											</Text>
										</Table.Cell>
										<Table.Cell>
											<RatingGroup.Root
												readOnly
												count={5}
												value={tool.avgRating ?? 0}
												size="sm"
												aria-label={
													tool.avgRating != null
														? `Rated ${tool.avgRating} out of 5 stars`
														: "No rating yet"
												}
												css={{
													"--chakra-colors-bg-emphasized": "#b1b1b1",
													_dark: {
														"--chakra-colors-bg-emphasized": "#605d70",
													},
												}}
											>
												<RatingGroup.HiddenInput aria-hidden="true" />
												<RatingGroup.Control aria-hidden="true" />
											</RatingGroup.Root>
										</Table.Cell>
										<Table.Cell>{formatDate(tool.createdAt)}</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					</Box>
				)}
			</Box>
		</Stack>
	);
}

export default MyToolSubmissionsPage;
