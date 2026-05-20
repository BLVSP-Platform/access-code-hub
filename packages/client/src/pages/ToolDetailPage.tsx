import { Heading, HStack, IconButton, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuBookmark, LuBookmarkCheck } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { decodeEntities } from "@/lib/utils";
import type { Tool } from "./ToolIndexPage";

export default function ToolDetailPage() {
	const [tool, setTool] = useState<Tool>();
	const [loading, setLoading] = useState(true);
	const [bookmarked, setBookmarked] = useState(false);
	const [bookmarkLoading, setBookmarkLoading] = useState(false);

	const { slug } = useParams<{ slug: string }>();

	useEffect(() => {
		if (!slug) return;

		const fetchTool = async () => {
			try {
				const res = await fetch(`/api/tools/${slug}`);
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
	}, [tool]);

	const toggleBookmark = async () => {
		if (!tool?._id || bookmarkLoading) return;

		setBookmarkLoading(true);

		try {
			if (bookmarked) {
				await fetch(`/api/tools/${tool._id}/bookmark`, {
					method: "DELETE",
				});
				setBookmarked(false);
			} else {
				await fetch(`/api/tools/${tool._id}/bookmark`, {
					method: "POST",
				});
				setBookmarked(true);
			}
		} catch (err) {
			console.error("Bookmark toggle failed:", err);
		} finally {
			setBookmarkLoading(false);
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
					{tool?.compatibility ?? "N/A"} {/* @todo: compatibility vs compatibility info*/}
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
						User Reviews:{" "}
					</Text>
					Reviews will go here! {/** @todo: reviews! */}
				</Text>

				<Text>
					<Text as="span" fontWeight="bold">
						Link:{" "}
					</Text>
					<Link href={tool?.link ?? "N/A"}>{decodeEntities(tool?.link ?? "N/A")}</Link>{" "}
					{/** @todo: escape links in submission? */}
				</Text>
			</VStack>
		</Stack>
	);
}
