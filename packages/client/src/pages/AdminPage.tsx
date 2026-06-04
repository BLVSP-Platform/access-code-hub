import { Badge, Button, Dialog, Heading, HStack, Link, Portal, Stack, Table, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuCheck, LuX } from "react-icons/lu";
import { api } from "@/lib/utils";

interface PendingTool {
	_id: string;
	slug: string;
	name: string;
	description: string;
	link: string;
	email: string;
	compatibility?: string;
	createdAt: string;
}

type ActionType = "approve" | "reject";

function ToolModerationTab() {
	const [tools, setTools] = useState<PendingTool[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedTool, setSelectedTool] = useState<PendingTool | null>(null);
	const [action, setAction] = useState<ActionType | null>(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const fetchPending = async () => {
			try {
				const res = await fetch(api("/api/admin/tools/pending"), {
					credentials: "include",
				});
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
						<Table.ColumnHeader>Compatibility</Table.ColumnHeader>
						<Table.ColumnHeader>Description</Table.ColumnHeader>
						<Table.ColumnHeader>Submitted</Table.ColumnHeader>
						<Table.ColumnHeader>Actions</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{tools.map((tool) => (
						<Table.Row key={tool._id} bg="tertiary">
							<Table.Cell>
								<Link href={tool.link} target="_blank">
									{tool.name}
								</Link>
							</Table.Cell>
							<Table.Cell>{tool.email}</Table.Cell>
							<Table.Cell>{tool.compatibility ?? "—"}</Table.Cell>
							<Table.Cell maxWidth="400px">
								<Text lineClamp={2}>{tool.description}</Text>
							</Table.Cell>
							<Table.Cell whiteSpace="nowrap">
								{new Date(tool.createdAt).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
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
