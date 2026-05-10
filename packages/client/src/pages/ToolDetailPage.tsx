import { Heading, IconButton, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuBookmark } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { decodeEntities } from "@/lib/utils";
import type { Tool } from "./ToolIndexPage";

export default function ToolDetailPage() {
	const [tool, setTool] = useState<Tool>();
	const [loading, setLoading] = useState(true);
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

	if (loading) {
		return <Text>Loading...</Text>;
	}

	return (
		<Stack>
			<Heading as="h1" size="4xl">
				<IconButton variant="ghost">
					<LuBookmark />
				</IconButton>
				{tool?.name}
			</Heading>

			<VStack mt={4} gap={4} align="start">
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
					{tool?.video ?? "N/A"}
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
					{tool?.limitations ?? "N/A"}
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
