import { Heading, HStack, IconButton, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuBookmark } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export interface Thread {
	_id: string;
	title: string;
	userId: string;
	topic: string;
	content: string;
	tags: string;
}

export default function ThreadDetailPage() {
	const [thread, setThread] = useState<Thread>();
	const [loading, setLoading] = useState(true);
	const { isAuthenticated } = useAuth();

	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		const fetchThread = async () => {
			try {
				const res = await fetch(`/api/thread/${id}`);
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

	if (loading) {
		return <Text>Loading...</Text>;
	}

	return (
		<Stack>
			<HStack align="center" gap={1}>
				<IconButton
					aria-label="bookmark tool"
					variant="ghost"
					// onClick={toggleBookmark}
					disabled={!isAuthenticated} // @todo: probably pop a toast here
					// loading={bookmarkLoading}
					// color={bookmarked ? "green.400" : "gray.400"}
					color={"gray.400"}
				>
					{/* {bookmarked ? (
            <LuBookmarkCheck style={{ width: "32px", height: "32px" }} />
          ) : (
            <LuBookmark style={{ width: "32px", height: "32px" }} />
          )} */}
					<LuBookmark style={{ width: "32px", height: "32px" }} />
				</IconButton>
				<Heading as="h1" size="4xl">
					{thread?.title}
				</Heading>
			</HStack>

			<VStack mt={4} gap={6} align="start">
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
		</Stack>
	);
}
