import {
	Badge,
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

type UserComment = {
	_id: string;
	threadId: string;
	threadTitle: string;
	threadTopic: string;
	parentId: string | null;
	content: string;
	createdAt: string;
	updatedAt: string;
};

function MyCommentsPage() {
	const navigate = useNavigate();
	const { data: sessionData, isPending: sessionPending } = useSession();
	const user = sessionData?.user;

	const [search, setSearch] = useState("");
	const [comments, setComments] = useState<UserComment[]>([]);
	const [filteredComments, setFilteredComments] = useState<UserComment[]>([]);
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

		const fetchMyComments = async () => {
			try {
				const res = await fetch(api("/api/thread/comments/me"), { credentials: "include" });
				if (!res.ok) throw new Error("Failed to load comments.");
				const data: UserComment[] = await res.json();
				setComments(data);
				setFilteredComments(data);
			} catch (e) {
				setError(e instanceof Error ? e.message : "Something went wrong.");
			} finally {
				setLoading(false);
			}
		};

		fetchMyComments();
	}, [user, sessionPending, navigate]);

	const handleFilterSubmit = () => {
		const q = search.toLowerCase();
		const results = comments.filter(
			(c) => c.content.toLowerCase().includes(q) || (c.threadTitle ?? "").toLowerCase().includes(q),
		);
		setFilteredComments(results);

		if (liveRegionRef.current) {
			liveRegionRef.current.textContent = `${results.length} ${results.length === 1 ? "comment" : "comments"} found.`;
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
					aria-label="Search your comments by content or thread title"
				>
					Find a Comment
				</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
						<Dialog.Header>
							<Dialog.Title id="search-dialog-title">Find My Comments</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<VStack>
								<Box width="100%">
									<InputGroup startElement={<LuSearch aria-hidden="true" />}>
										<Input
											ref={searchInputRef}
											placeholder="Search by content or thread title"
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											onKeyDown={handleSearchKeyDown}
											aria-label="Search your comments by content or thread title"
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
			{/* Screen-reader live region for search result announcements */}
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
					My Comments
				</Heading>
				<Text fontSize="xs" mt={4} color="gray.500">
					{comments.length} {comments.length === 1 ? "comment" : "comments"} posted
				</Text>
			</HStack>

			{error && (
				<Box role="alert" p="4" borderRadius="md" bg="red.50" borderWidth="1px" borderColor="red.200">
					<Text color="red.600">{error}</Text>
				</Box>
			)}

			<HStack gap={-2}>{searchDialog}</HStack>

			<Box ref={resultsRef} tabIndex={-1} outline="none">
				{filteredComments.length === 0 && !error ? (
					<Text role="status" color="gray.500" py={8} textAlign="center">
						{search ? `No comments matched "${search}".` : "You haven't posted any comments yet."}
					</Text>
				) : (
					<Table.Root
						size="lg"
						variant="outline"
						showColumnBorder
						aria-label="My comments"
						aria-rowcount={filteredComments.length}
					>
						<Table.Header>
							<Table.Row bg="secondary">
								<Table.ColumnHeader scope="col">Comment</Table.ColumnHeader>
								<Table.ColumnHeader scope="col">Thread</Table.ColumnHeader>
								<Table.ColumnHeader scope="col">Type</Table.ColumnHeader>
								<Table.ColumnHeader scope="col">Posted</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{filteredComments.map((c) => (
								<Table.Row key={c._id} bg="tertiary">
									<Table.Cell maxW="400px">
										<Text lineClamp={2} title={c.content}>
											{c.content}
										</Text>
									</Table.Cell>
									<Table.Cell>
										<Link href={`/community/threads/${c.threadId}`}>
											{c.threadTitle ?? "Unknown Thread"}
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Badge
											colorPalette={c.parentId ? "purple" : "blue"}
											aria-label={c.parentId ? "Reply to a comment" : "Top-level comment"}
										>
											{c.parentId ? "Reply" : "Comment"}
										</Badge>
									</Table.Cell>
									<Table.Cell>{formatDate(c.createdAt)}</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				)}
			</Box>
		</Stack>
	);
}

export default MyCommentsPage;
