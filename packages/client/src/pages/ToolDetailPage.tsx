import {
	Box,
	Button,
	Heading,
	HStack,
	IconButton,
	Link,
	RatingGroup,
	Separator,
	Stack,
	Text,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuBookmark, LuBookmarkCheck } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { api, decodeEntities } from "@/lib/utils";
import type { Tool } from "./ToolIndexPage";

type Review = {
	_id: string;
	userId: string;
	toolId: string;
	rating: number;
	body?: string;
	createdAt: string;
};

const StarRating = ({
	value,
	readOnly = false,
	onValueChange,
}: {
	value: number;
	readOnly?: boolean;
	onValueChange?: (value: number) => void;
}) => (
	<RatingGroup.Root value={value} count={5} readOnly={readOnly} onValueChange={(e) => onValueChange?.(e.value)}>
		<RatingGroup.HiddenInput />
		<RatingGroup.Control>
			{Array.from({ length: 5 }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: for ratings are fine
				<RatingGroup.Item key={i + 1} index={i + 1}>
					<RatingGroup.ItemIndicator />
				</RatingGroup.Item>
			))}
		</RatingGroup.Control>
	</RatingGroup.Root>
);

export default function ToolDetailPage() {
	const [tool, setTool] = useState<Tool>();
	const [loading, setLoading] = useState(true);
	const [bookmarked, setBookmarked] = useState(false);
	const [bookmarkLoading, setBookmarkLoading] = useState(false);

	const [reviews, setReviews] = useState<Review[]>([]);
	const [myReview, setMyReview] = useState<Review | null>(null);
	const [draftRating, setDraftRating] = useState(0);
	const [draftBody, setDraftBody] = useState("");
	const [reviewLoading, setReviewLoading] = useState(false);

	const { isAuthenticated, user } = useAuth();
	const { slug } = useParams<{ slug: string }>();

	useEffect(() => {
		if (!slug) return;
		const fetchTool = async () => {
			try {
				const res = await fetch(api(`/api/tools/${slug}`));
				const data = await res.json();
				setTool(data);
			} catch (err) {
				console.error("Failed to fetch tool:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchTool();
	}, [slug]);

	useEffect(() => {
		if (!tool) return;
		setBookmarked(tool.bookmarked);

		const fetchReviews = async () => {
			try {
				const res = await fetch(api(`/api/tools/${tool._id}/reviews`));
				const data: Review[] = await res.json();
				setReviews(data);

				if (user) {
					const mine = data.find((r) => r.userId === user.user.id) ?? null;
					setMyReview(mine);
					if (mine) {
						setDraftRating(mine.rating);
						setDraftBody(mine.body ?? "");
					}
				}
			} catch (err) {
				console.error("Failed to fetch reviews:", err);
			}
		};

		fetchReviews();
	}, [tool, user]);

	const toggleBookmark = async () => {
		if (!tool?._id || bookmarkLoading) return;
		setBookmarkLoading(true);
		try {
			if (bookmarked) {
				await fetch(api(`/api/tools/${tool._id}/bookmark`), { method: "DELETE", credentials: "include" });
				setBookmarked(false);
			} else {
				await fetch(api(`/api/tools/${tool._id}/bookmark`), { method: "POST", credentials: "include" });
				setBookmarked(true);
			}
		} catch (err) {
			console.error("Bookmark toggle failed:", err);
		} finally {
			setBookmarkLoading(false);
		}
	};

	const submitReview = async () => {
		if (!tool?._id || draftRating === 0 || reviewLoading) return;
		setReviewLoading(true);
		try {
			const res = await fetch(api(`/api/tools/${tool._id}/reviews`), {
				method: "PUT",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ rating: draftRating, body: draftBody }),
			});
			const updated: Review = await res.json();

			setMyReview(updated);
			setReviews((prev) => {
				const without = prev.filter((r) => r.userId !== updated.userId);
				return [updated, ...without];
			});
		} catch (err) {
			console.error("Failed to submit review:", err);
		} finally {
			setReviewLoading(false);
		}
	};

	const deleteReview = async () => {
		if (!tool?._id || !myReview || reviewLoading) return;
		setReviewLoading(true);
		try {
			await fetch(api(`/api/tools/${tool._id}/reviews`), { method: "DELETE", credentials: "include" });
			setReviews((prev) => prev.filter((r) => r._id !== myReview._id));
			setMyReview(null);
			setDraftRating(0);
			setDraftBody("");
		} catch (err) {
			console.error("Failed to delete review:", err);
		} finally {
			setReviewLoading(false);
		}
	};

	if (loading) return <Text>Loading...</Text>;

	const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

	return (
		<Stack>
			<HStack align="center" gap={1}>
				<IconButton
					aria-label="bookmark tool"
					variant="ghost"
					onClick={toggleBookmark}
					disabled={!isAuthenticated}
					loading={bookmarkLoading}
					color={bookmarked ? "green.400" : "gray.400"}
				>
					{bookmarked ? (
						<LuBookmarkCheck style={{ width: "32px", height: "32px" }} />
					) : (
						<LuBookmark style={{ width: "32px", height: "32px" }} />
					)}
				</IconButton>
				<Heading as="h1" size="4xl">
					{tool?.name}
				</Heading>
			</HStack>

			<VStack mt={4} gap={6} align="start">
				<Text>
					<Text as="span" fontWeight="bold">
						Description:{" "}
					</Text>
					{tool?.description ?? "N/A"}
				</Text>

				<Text>
					<Text as="span" fontWeight="bold">
						Compatibility Information:{" "}
					</Text>
					{tool?.compatibility ?? "N/A"}
				</Text>

				<Text>
					<Text as="span" fontWeight="bold">
						Tutorial Video(s):{" "}
					</Text>
					{tool?.videos ?? "N/A"}
				</Text>

				<Text>
					<Text as="span" fontWeight="bold">
						Guidelines:{" "}
					</Text>
					{decodeEntities(tool?.guidelines ?? "N/A")}
				</Text>

				<Text>
					<Text as="span" fontWeight="bold">
						Limitations:{" "}
					</Text>
					{tool?.limits ?? "N/A"}
				</Text>

				<Text>
					<Text as="span" fontWeight="bold">
						Link:{" "}
					</Text>
					<Link href={tool?.link ?? "N/A"}>{decodeEntities(tool?.link ?? "N/A")}</Link>
				</Text>

				<Box w="full">
					<HStack mb={3} gap={3}>
						<Heading as="h2" size="xl" fontWeight="bold">
							Reviews
						</Heading>
						{avgRating !== null && (
							<HStack gap={2}>
								<StarRating value={avgRating} readOnly />
								<Text color="gray.500" fontSize="sm">
									{avgRating.toFixed(1)} ({reviews.length})
								</Text>
							</HStack>
						)}
					</HStack>

					{isAuthenticated && (
						<Box mb={6} p={4} borderWidth="1px" borderRadius="md">
							<Text fontWeight="bold" mb={2}>
								{myReview ? "Your Review" : "Leave a Review"}
							</Text>
							<StarRating value={draftRating} onValueChange={setDraftRating} />
							<Textarea
								placeholder="Write something... (optional)"
								value={draftBody}
								onChange={(e) => setDraftBody(e.target.value)}
								mt={3}
								mb={3}
							/>
							<HStack>
								<Button
									onClick={submitReview}
									loading={reviewLoading}
									disabled={draftRating === 0}
									size="sm"
									bg="primary"
								>
									{myReview ? "Update" : "Submit"}
								</Button>
								{myReview && (
									<Button
										onClick={deleteReview}
										loading={reviewLoading}
										variant="ghost"
										colorPalette="red"
										size="sm"
									>
										Delete
									</Button>
								)}
							</HStack>
						</Box>
					)}

					{reviews.length === 0 ? (
						<Text color="gray.500">No reviews yet.</Text>
					) : (
						<VStack gap={4} align="stretch">
							{reviews.map((review, i) => (
								<Box key={review._id}>
									<HStack mb={1} gap={3}>
										<StarRating value={review.rating} readOnly />
										{review.userId === user?.user.id && (
											<Text fontSize="xs" color="gray.400">
												(you)
											</Text>
										)}
										<Text fontSize="xs" color="gray.400" ml="auto">
											{new Date(review.createdAt).toLocaleDateString()}
										</Text>
									</HStack>
									{review.body && <Text fontSize="sm">{review.body}</Text>}
									{i < reviews.length - 1 && <Separator mt={4} />}
								</Box>
							))}
						</VStack>
					)}
				</Box>
			</VStack>
		</Stack>
	);
}
