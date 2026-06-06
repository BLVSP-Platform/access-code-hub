import { Box, Button, Heading, HStack, IconButton, Stack, Text, Textarea, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LuBookmark, LuBookmarkCheck, LuTrash2 } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/utils";

export interface Thread {
	_id: string;
	title: string;
	userId: string;
	username: string;
	topic: string;
	content: string;
	tags: string;
	createdAt: string;
	updatedAt: string;
	commentCount: number;
	bookmarked: boolean;
}

export interface Comment {
	_id: string;
	threadId: string;
	userId: string;
	username: string;
	content: string;
	createdAt: string;
}

export interface Reply {
	_id: string;
	threadId: string;
	parentId: string;
	userId: string;
	username: string;
	content: string;
	createdAt: string;
	replies: Reply[];
}

export default function ThreadDetailPage() {
	const [thread, setThread] = useState<Thread>();
	const [loading, setLoading] = useState(true);
	const [bookmarked, setBookmarked] = useState(false);
	const [bookmarkLoading, setBookmarkLoading] = useState(false);

	const [comments, setComments] = useState<Comment[]>([]);
	const [commentsLoading, setCommentsLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const commentRef = useRef<HTMLTextAreaElement>(null);

	const { isAuthenticated, user } = useAuth();

	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		const fetchThread = async () => {
			try {
				const res = await fetch(api(`/api/thread/${id}`), {
					credentials: "include",
				});
				if (!res.ok) throw new Error(res.statusText);
				const data: Thread = await res.json();
				setThread(data);
			} catch (err) {
				console.error("Failed to fetch thread:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchThread();
	}, [id]);

	useEffect(() => {
		if (!thread) return;
		setBookmarked(thread.bookmarked);
	}, [thread]);

	useEffect(() => {
		if (!id) return;
		const fetchComments = async () => {
			try {
				const res = await fetch(api(`/api/thread/${id}/comments`));
				if (!res.ok) throw new Error(res.statusText);
				setComments(await res.json());
			} catch (err) {
				console.error("Failed to fetch comments:", err);
			} finally {
				setCommentsLoading(false);
			}
		};
		fetchComments();
	}, [id]);

	const toggleBookmark = async () => {
		if (!thread?._id || bookmarkLoading) return;

		setBookmarkLoading(true);

		try {
			if (bookmarked) {
				await fetch(api(`/api/thread/${thread._id}/bookmark`), {
					method: "DELETE",
					credentials: "include",
				});
				setBookmarked(false);
			} else {
				await fetch(api(`/api/thread/${thread._id}/bookmark`), {
					method: "POST",
					credentials: "include",
				});
				setBookmarked(true);
			}
		} catch (err) {
			console.error("Bookmark toggle failed:", err);
		} finally {
			setBookmarkLoading(false);
		}
	};

	const submitComment = async () => {
		const content = commentRef.current?.value.trim();
		if (!content || !id) return;

		setSubmitting(true);
		try {
			const fd = new FormData();
			fd.append("content", content);

			const res = await fetch(api(`/api/thread/${id}/comments`), {
				method: "POST",
				body: fd,
				credentials: "include",
			});
			if (!res.ok) throw new Error(res.statusText);

			const newComment: Comment = await res.json();
			setComments((prev) => [newComment, ...prev]);
			if (commentRef.current) commentRef.current.value = "";
		} catch (err) {
			console.error("Failed to post comment:", err);
		} finally {
			setSubmitting(false);
		}
	};

	const deleteComment = async (commentId: string) => {
		try {
			const res = await fetch(api(`/api/thread/${id}/comments/${commentId}`), {
				method: "DELETE",
				credentials: "include",
			});
			if (!res.ok) throw new Error(res.statusText);
			setComments((prev) => prev.filter((c) => c._id !== commentId));
		} catch (err) {
			console.error("Failed to delete comment:", err);
		}
	};

	if (loading) {
		return <Text>Loading...</Text>;
	}

	return (
		<Stack>
			<HStack align="center" gap={1}>
				<IconButton
					aria-label="bookmark tool"
					variant="ghost"
					onClick={toggleBookmark}
					disabled={!isAuthenticated} // @todo: probably pop a toast here
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
					{thread?.title}
				</Heading>
			</HStack>

			<VStack mt={4} gap={6} align="start">
				<Text fontSize="sm" color="gray.500">
					Posted by{" "}
					<Text as="span" fontWeight="semibold">
						{thread?.username ?? "Unknown"}
					</Text>
				</Text>

				<Text>{thread?.content ?? "N/A"}</Text>

				<Text>
					<Text as="span" fontWeight="bold">
						Topic:{" "}
					</Text>
					{thread?.topic ?? "N/A"}
				</Text>

				<Text>
					<Text as="span" fontWeight="bold">
						Tags(s):{" "}
					</Text>
					{thread?.tags ?? "N/A"}
				</Text>
			</VStack>

			<Box w="full">
				<Heading as="h2" size="xl" mb={4}>
					Comments ({comments.length})
				</Heading>

				{isAuthenticated && (
					<VStack align="stretch" mb={6} gap={2}>
						<Textarea ref={commentRef} placeholder="Write a comment…" resize="vertical" rows={3} />
						<Button
							alignSelf="flex-end"
							bg="primary"
							onClick={submitComment}
							loading={submitting}
							disabled={submitting}
						>
							Post comment
						</Button>
					</VStack>
				)}

				{commentsLoading ? (
					<Text>Loading comments…</Text>
				) : comments.length === 0 ? (
					<Text color="gray.500">No comments yet. Be the first!</Text>
				) : (
					<VStack align="stretch" gap={4}>
						{comments.map((comment) => (
							<Box key={comment._id} p={4} borderWidth="1px" borderRadius="md">
								<HStack justify="space-between" mb={1}>
									<Text fontWeight="bold">{comment.username}</Text>
									<HStack gap={2}>
										<Text fontSize="sm" color="gray.500">
											{new Date(comment.createdAt).toLocaleDateString()}
										</Text>
										{user?.user.id === comment.userId && (
											<IconButton
												aria-label="Delete comment"
												variant="ghost"
												size="xs"
												color="red.400"
												onClick={() => deleteComment(comment._id)}
											>
												<LuTrash2 />
											</IconButton>
										)}
									</HStack>
								</HStack>
								<Text>{comment.content}</Text>
							</Box>
						))}
					</VStack>
				)}
			</Box>
		</Stack>
	);
}
