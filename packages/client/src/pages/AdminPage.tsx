import { Badge, Box, Button, Dialog, Heading, HStack, Link, Portal, Stack, Table, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuCheck, LuX } from "react-icons/lu";
import { api, decodeEntities } from "@/lib/utils";

interface PendingTool {
	_id: string;
	slug: string;
	name: string;
	description: string;
	link: string;
	email: string;
	compatibility?: string;
	videos?: string;
	guidelines?: string;
	limits?: string;
	comments?: string;
	isCreator?: boolean;
	createdAt: string;
}

type ActionType = "approve" | "reject";

function ToolModerationTab() {
	const [tools, setTools] = useState<PendingTool[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedTool, setSelectedTool] = useState<PendingTool | null>(null);
	const [action, setAction] = useState<ActionType | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [detailTool, setDetailTool] = useState<PendingTool | null>(null);

	useEffect(() => {
		const fetchPending = async () => {
			try {
				const res = await fetch(api("/api/admin/tools/pending"), { credentials: "include" });
				const data = await res.json();
				setTools(data);
			} catch (err) {
				console.error("Failed to fetch pending tools:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchPending();
	}, []);

	const openDialog = (tool: PendingTool, actionType: ActionType) => {
		setSelectedTool(tool);
		setAction(actionType);
	};

	const closeDialog = () => {
		setSelectedTool(null);
		setAction(null);
	};

	const handleConfirm = async () => {
		if (!selectedTool || !action) return;
		setSubmitting(true);
		try {
			await fetch(api(`/api/admin/tools/${selectedTool.slug}/${action}`), {
				method: "POST",
				credentials: "include",
			});
			setTools((prev) => prev.filter((t) => t._id !== selectedTool._id));
			closeDialog();
		} catch (err) {
			console.error("Failed to update tool:", err);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <Text>Loading pending tools...</Text>;
	if (tools.length === 0) return <Text color="fg.muted">No pending tools to review.</Text>;

	return (
		<>
			<Table.Root size="lg" variant="outline" showColumnBorder css={{ "--chakra-colors-border": "#5B5B5B" }}>
				<Table.Header>
					<Table.Row bg="secondary">
						<Table.ColumnHeader>Name</Table.ColumnHeader>
						<Table.ColumnHeader>Submitted By</Table.ColumnHeader>
						<Table.ColumnHeader>Details</Table.ColumnHeader>
						<Table.ColumnHeader>Actions</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{tools.map((tool) => (
						<Table.Row key={tool._id} bg="tertiary">
							<Table.Cell>{tool.name}</Table.Cell>
							<Table.Cell>{tool.email}</Table.Cell>
							<Table.Cell>
								<Button variant="subtle" size="sm" onClick={() => setDetailTool(tool)}>
									More Details
								</Button>
							</Table.Cell>
							<Table.Cell>
								<HStack gap={2}>
									<Button
										size="sm"
										bg="green.500"
										variant="subtle"
										onClick={() => openDialog(tool, "approve")}
									>
										<LuCheck /> Approve
									</Button>
									<Button
										size="sm"
										bg="red.400"
										variant="subtle"
										onClick={() => openDialog(tool, "reject")}
									>
										<LuX /> Reject
									</Button>
								</HStack>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>

			<Dialog.Root
				open={!!detailTool}
				onOpenChange={({ open }) => {
					if (!open) setDetailTool(null);
				}}
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content maxWidth="600px">
							<Dialog.Header>
								<Dialog.Title>{detailTool?.name}</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Stack gap={4}>
									<Box>
										<Text fontWeight="bold" mb={1}>
											Description
										</Text>
										<Text>{detailTool?.description}</Text>
									</Box>
									{[
										{
											label: "Link",
											value: detailTool?.link ? decodeEntities(detailTool.link) : undefined,
										},
										{ label: "Submitted By", value: detailTool?.email },
										{ label: "Compatibility", value: detailTool?.compatibility },
										{ label: "Videos", value: detailTool?.videos },
										{ label: "Guidelines", value: detailTool?.guidelines },
										{ label: "Limits", value: detailTool?.limits },
										{ label: "Comments", value: detailTool?.comments },
										{ label: "Is Creator", value: detailTool?.isCreator ? "Yes" : "No" },
										{
											label: "Submitted",
											value: detailTool
												? new Date(detailTool.createdAt).toLocaleString("en-US", {
														month: "long",
														day: "numeric",
														year: "numeric",
														hour: "numeric",
														minute: "2-digit",
														hour12: true,
													})
												: undefined,
										},
									].map(({ label, value }) =>
										value ? (
											<Box key={label}>
												<Text fontWeight="bold" mb={1}>
													{label}
												</Text>
												{label === "Link" ? (
													<Link href={value} target="_blank" color="blue.400">
														{value}
													</Link>
												) : (
													<Text>{value}</Text>
												)}
											</Box>
										) : null,
									)}
								</Stack>
							</Dialog.Body>
							<Dialog.Footer>
								<Button variant="ghost" onClick={() => setDetailTool(null)}>
									Close
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>

			<Dialog.Root
				open={!!selectedTool}
				onOpenChange={({ open }) => {
					if (!open) closeDialog();
				}}
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>{action === "approve" ? "Approve Tool" : "Reject Tool"}</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Text>
									Are you sure you want to{" "}
									<Badge colorScheme={action === "approve" ? "green" : "red"}>{action}</Badge>{" "}
									<strong>{selectedTool?.name}</strong>?
									{action === "reject" &&
										" This will mark it as rejected and hide it from the public index."}
								</Text>
							</Dialog.Body>
							<Dialog.Footer>
								<Button variant="ghost" onClick={closeDialog} disabled={submitting}>
									Cancel
								</Button>
								<Button
									colorScheme={action === "approve" ? "green" : "red"}
									onClick={handleConfirm}
									loading={submitting}
								>
									Confirm {action === "approve" ? "Approval" : "Rejection"}
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</>
	);
}

function AdminPage() {
	return (
		<Stack gap={6}>
			<Heading size="4xl">Admin</Heading>
			<Tabs.Root defaultValue="tools">
				<Tabs.List>
					<Tabs.Trigger value="tools">Tool Approvals</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="tools" pt={4}>
					<ToolModerationTab />
				</Tabs.Content>
			</Tabs.Root>
		</Stack>
	);
}

export default AdminPage;
