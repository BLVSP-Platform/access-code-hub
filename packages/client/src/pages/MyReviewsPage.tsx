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

type UserReview = {
	_id: string;
	toolId: string;
	toolName: string;
	toolSlug: string;
	rating: number;
	body?: string;
	createdAt: string;
	updatedAt: string;
};

function MyReviewsPage() {
	const navigate = useNavigate();
	const { data: sessionData, isPending: sessionPending } = useSession();
	const user = sessionData?.user;

	const [search, setSearch] = useState("");
	const [reviews, setReviews] = useState<UserReview[]>([]);
	const [filteredReviews, setFilteredReviews] = useState<UserReview[]>([]);
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

		const fetchMyReviews = async () => {
			try {
				const res = await fetch(api("/api/tools/reviews/me"), { credentials: "include" });
				if (!res.ok) throw new Error("Failed to load reviews.");
				const data: UserReview[] = await res.json();
				setReviews(data);
				setFilteredReviews(data);
			} catch (e) {
				setError(e instanceof Error ? e.message : "Something went wrong.");
			} finally {
				setLoading(false);
			}
		};

		fetchMyReviews();
	}, [user, sessionPending, navigate]);

	const handleFilterSubmit = () => {
		const q = search.toLowerCase();
		const results = reviews.filter(
			(r) => (r.toolName ?? "").toLowerCase().includes(q) || (r.body ?? "").toLowerCase().includes(q),
		);
		setFilteredReviews(results);

		if (liveRegionRef.current) {
			liveRegionRef.current.textContent = `${results.length} ${results.length === 1 ? "review" : "reviews"} found.`;
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
					aria-label="Search your reviews by tool name or review text"
				>
					Find a Review
				</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
						<Dialog.Header>
							<Dialog.Title id="search-dialog-title">Find My Reviews</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<VStack>
								<Box width="100%">
									<InputGroup startElement={<LuSearch aria-hidden="true" />}>
										<Input
											ref={searchInputRef}
											placeholder="Search by tool name or review text"
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											onKeyDown={handleSearchKeyDown}
											aria-label="Search your reviews by tool name or review text"
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
					My Reviews
				</Heading>
				<Text fontSize="xs" mt={4} color="gray.500">
					{reviews.length} {reviews.length === 1 ? "review" : "reviews"} posted
				</Text>
			</HStack>

			{error && (
				<Box role="alert" p="4" borderRadius="md" bg="red.50" borderWidth="1px" borderColor="red.200">
					<Text color="red.600">{error}</Text>
				</Box>
			)}

			<HStack gap={-2}>{searchDialog}</HStack>

			<Box ref={resultsRef} tabIndex={-1} outline="none">
				{filteredReviews.length === 0 && !error ? (
					<Text role="status" color="gray.500" py={8} textAlign="center">
						{search ? `No reviews matched "${search}".` : "You haven't reviewed any tools yet."}
					</Text>
				) : (
					<Box overflowX="auto" width="100%">
						<Table.Root
							size="lg"
							variant="outline"
							showColumnBorder
							aria-label="My tool reviews"
							aria-rowcount={filteredReviews.length}
							css={{
								"--chakra-colors-border": "#5B5B5B",
								_dark: {
									"--chakra-colors-border": "#5e5e5e",
								},
							}}
						>
							<Table.Header>
								<Table.Row bg="secondary">
									<Table.ColumnHeader scope="col">Tool</Table.ColumnHeader>
									<Table.ColumnHeader scope="col">Rating</Table.ColumnHeader>
									<Table.ColumnHeader scope="col">Review</Table.ColumnHeader>
									<Table.ColumnHeader scope="col">Last Updated</Table.ColumnHeader>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{filteredReviews.map((review) => (
									<Table.Row key={review._id} bg="tertiary">
										<Table.Cell>
											<Link href={`/tools/${review.toolSlug}`}>
												{review.toolName ?? "Unknown Tool"}
											</Link>
										</Table.Cell>
										<Table.Cell>
											<RatingGroup.Root
												readOnly
												count={5}
												value={review.rating}
												size="sm"
												aria-label={`You rated this tool ${review.rating} out of 5 stars`}
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
										<Table.Cell maxWidth="500px">
											{review.body ? (
												<Text lineClamp={2} title={review.body}>
													{review.body}
												</Text>
											) : (
												<Text color="gray.400" fontStyle="italic">
													No written review
												</Text>
											)}
										</Table.Cell>
										<Table.Cell>{formatDate(review.updatedAt)}</Table.Cell>
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

export default MyReviewsPage;
