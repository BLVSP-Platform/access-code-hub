import { Heading, HStack, IconButton, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuBookmark } from "react-icons/lu";
import { useParams } from "react-router-dom";
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
				<HStack align="start">
					<Text fontWeight="bold">Description:</Text>
					<Text>{tool?.description ?? "N/A"}</Text>
				</HStack>

				<HStack align="start">
					<Text fontWeight="bold">Compatibility Information:</Text>
					<Text>{tool?.compatibility ?? "N/A"}</Text> {/* @todo: compatibility vs compatibility info*/}
				</HStack>

				<HStack align="start">
					<Text fontWeight="bold">Tutorial Video(s):</Text>
					<Text>{tool?.video ?? "N/A"}</Text>
				</HStack>

				<HStack align="start">
					<Text fontWeight="bold">Guidelines:</Text>
					<Text>{tool?.guidelines ?? "N/A"}</Text>
				</HStack>

				<HStack align="start">
					<Text fontWeight="bold">Limitations:</Text>
					<Text>{tool?.limitations ?? "N/A"}</Text>
				</HStack>

				<HStack align="start">
					<Text fontWeight="bold">User Reviews:</Text>
					<Text>Reviews will go here!</Text> {/** @todo: reviews! */}
				</HStack>

				<HStack align="start">
					<Text fontWeight="bold">Link:</Text>
					<Link href={tool?.link ?? "N/A"}>{tool?.link}</Link>
				</HStack>
			</VStack>
		</Stack>
	);
}
