import {
	Box,
	Button,
	CloseButton,
	Dialog,
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
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { InfoTip } from "@/components/ui/toggle-tip";

// @todo: use backend type?
export interface Tool {
	id: string;
	slug: string;
	name: string;
	compatibility: string;
	description: string;
	rating: number;
	video: string;
	guidelines: string;
	limitations: string;
	link: string;
}

// @todo: NEEDS ACCESSIBILITY

function ToolIndexPage() {
	const [search, setSearch] = useState("");
	const [tools, setTools] = useState<Tool[]>([]);
	const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
	const [loading, setLoading] = useState(true);
	const [lastUpdated, setLastUpdated] = useState<string>("");

	useEffect(() => {
		const fetchTools = async () => {
			try {
				const res = await fetch("/api/tools");
				const data = await res.json();

				setTools(data);
				setFilteredTools(data);
			} catch (err) {
				console.error("Failed to fetch tools:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchTools();
	}, []);

	useEffect(() => {
		fetch("/api/tools/last-updated")
			.then((res) => res.json())
			.then((data) =>
				setLastUpdated(
					new Date(data.lastUpdated).toLocaleString("en-US", {
						month: "long",
						day: "numeric",
						year: "numeric",
						hour: "numeric",
						minute: "2-digit",
						hour12: true,
					}),
				),
			);
	}, []);

	const handleFilterSubmit = () => {
		const results = tools.filter((tool) => tool.name.toLowerCase().includes(search.toLowerCase()));
		setFilteredTools(results);
	};

	const searchDialog = (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<Button rounded="full" backgroundColor="primary" color="white">
					Find a Tool
				</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Find Tools</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<VStack>
								<Box width="100%">
									<InputGroup startElement={<LuSearch />}>
										<Input
											placeholder="Search by tool name"
											value={search}
											onChange={(e) => setSearch(e.target.value)}
										/>
									</InputGroup>
								</Box>
							</VStack>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button onClick={handleFilterSubmit} bg="primary">
									Submit
								</Button>{" "}
								{/* center this? */}
							</Dialog.ActionTrigger>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<CloseButton size="xl" />
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);

	if (loading) {
		return <Text>Loading....</Text>;
	}

	return (
		<Stack gap={4}>
			<HStack mb={8}>
				<Heading size="4xl">Tool Index</Heading>
				<Text fontSize="xs" mt={4}>
					Last Updated: {lastUpdated}
				</Text>
			</HStack>

			<HStack gap={-2}>
				{searchDialog}

				<Box mb={4}>
					<InfoTip content="Filter results by tool name" />
				</Box>
			</HStack>

			<Box overflowX="auto" width="100%">
				<Table.Root
					size="lg"
					variant="outline"
					showColumnBorder
					css={{
						"--chakra-colors-border": "#5B5B5B",
						_dark: {
							"--chakra-colors-border": "#5e5e5e",
						},
					}}
				>
					<Table.Header>
						<Table.Row bg="secondary">
							<Table.ColumnHeader>Name</Table.ColumnHeader>
							<Table.ColumnHeader>Compatibility</Table.ColumnHeader>
							<Table.ColumnHeader>Description</Table.ColumnHeader>
							<Table.ColumnHeader>Overall Ratings</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{filteredTools.map((tool) => (
							<Table.Row key={tool.id} bg="tertiary" width="100%">
								<Table.Cell>
									<Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
								</Table.Cell>
								<Table.Cell>{tool.compatibility}</Table.Cell>
								<Table.Cell maxWidth="500px">
									<Text>{tool.description}</Text>
								</Table.Cell>
								<Table.Cell>
									<RatingGroup.Root
										readOnly
										count={5}
										value={tool.rating}
										size="sm"
										css={{
											"--chakra-colors-bg-emphasized": "#b1b1b1",
											_dark: {
												"--chakra-colors-bg-emphasized": "#605d70",
											},
										}}
									>
										<RatingGroup.HiddenInput />
										<RatingGroup.Control />
									</RatingGroup.Root>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</Box>
		</Stack>
	);
}

export default ToolIndexPage;
