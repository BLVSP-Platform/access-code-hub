import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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

	return <Text>{tool?.name}</Text>;
}
