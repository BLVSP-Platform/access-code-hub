import {
	Badge,
	Box,
	Button,
	Dialog,
	Heading,
	HStack,
	Link,
	Portal,
	Stack,
	Table,
	Tabs,
	Tag,
	Text,
} from "@chakra-ui/react";
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

interface MentorshipSubmission {
	_id: string;
	userId: string;
	email: string;
	mentorshipRole: string;
	tags: string[];
}

type ActionType = "approve" | "reject";

function ToolModerationTab() {
	const [tools, setTools] = useState<PendingTool[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	// Detail dialog
	const [detailOpen, setDetailOpen] = useState(false);
	const [detailContent, setDetailContent] = useState<PendingTool | null>(null);

	// Confirm dialog
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmContent, setConfirmContent] = useState<{ tool: PendingTool; action: ActionType } | null>(null);

	useEffect(() => {
		const fetchPending = async () => {
			try {
				const res = await fetch(api("/api/moderator/tools/pending"), { credentials: "include" });
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

	const openDetailDialog = (tool: PendingTool) => {
		setDetailContent(tool);
		setDetailOpen(true);
	};

	const openConfirmDialog = (tool: PendingTool, action: ActionType) => {
		setConfirmContent({ tool, action });
		setConfirmOpen(true);
	};

	const handleConfirm = async () => {
		if (!confirmContent) return;
		const { tool, action } = confirmContent;
		setSubmitting(true);
		try {
			await fetch(api(`/api/moderator/tools/${tool.slug}/${action}`), {
				method: "POST",
				credentials: "include",
			});
			setTools((prev) => prev.filter((t) => t._id !== tool._id));
			setConfirmOpen(false);
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
								<Button variant="subtle" size="sm" onClick={() => openDetailDialog(tool)}>
									More Details
								</Button>
							</Table.Cell>
							<Table.Cell>
								<HStack gap={2}>
									<Button
										size="sm"
										bg="green.500"
										variant="subtle"
										onClick={() => openConfirmDialog(tool, "approve")}
									>
										<LuCheck /> Approve
									</Button>
									<Button
										size="sm"
										bg="red.400"
										variant="subtle"
										onClick={() => openConfirmDialog(tool, "reject")}
									>
										<LuX /> Reject
									</Button>
								</HStack>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>

			{/* Detail dialog */}
			<Dialog.Root open={detailOpen} onOpenChange={({ open }) => setDetailOpen(open)}>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content maxWidth="600px">
							<Dialog.Header>
								<Dialog.Title>{detailContent?.name}</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Stack gap={4}>
									<Box>
										<Text fontWeight="bold" mb={1}>
											Description
										</Text>
										<Text>{detailContent?.description}</Text>
									</Box>
									{[
										{
											label: "Link",
											value: detailContent?.link ? decodeEntities(detailContent.link) : undefined,
										},
										{ label: "Submitted By", value: detailContent?.email },
										{ label: "Compatibility", value: detailContent?.compatibility },
										{ label: "Videos", value: detailContent?.videos },
										{ label: "Guidelines", value: detailContent?.guidelines },
										{ label: "Limits", value: detailContent?.limits },
										{ label: "Comments", value: detailContent?.comments },
										{ label: "Is Creator", value: detailContent?.isCreator ? "Yes" : "No" },
										{
											label: "Submitted",
											value: detailContent
												? new Date(detailContent.createdAt).toLocaleString("en-US", {
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
								<Button variant="ghost" onClick={() => setDetailOpen(false)}>
									Close
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>

			{/* Confirm dialog */}
			<Dialog.Root open={confirmOpen} onOpenChange={({ open }) => setConfirmOpen(open)}>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>
									{confirmContent?.action === "approve" ? "Approve Tool" : "Reject Tool"}
								</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Text>
									Are you sure you want to{" "}
									<Badge color={confirmContent?.action === "approve" ? "green" : "red"}>
										{confirmContent?.action}
									</Badge>{" "}
									<strong>{confirmContent?.tool.name}</strong>?
									{confirmContent?.action === "reject" &&
										" This will mark it as rejected and hide it from the public index."}
								</Text>
							</Dialog.Body>
							<Dialog.Footer>
								<Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={submitting}>
									Cancel
								</Button>
								<Button
									bg={confirmContent?.action === "approve" ? "green.500" : "red.400"}
									onClick={handleConfirm}
									loading={submitting}
								>
									Confirm {confirmContent?.action === "approve" ? "Approval" : "Rejection"}
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</>
	);
}

function MentorshipTab() {
	const [submissions, setSubmissions] = useState<MentorshipSubmission[]>([]);
	const [loading, setLoading] = useState(true);

	// Detail dialog
	const [detailOpen, setDetailOpen] = useState(false);
	const [detailContent, setDetailContent] = useState<MentorshipSubmission | null>(null);

	useEffect(() => {
		const fetchSubmissions = async () => {
			try {
				const res = await fetch(api("/api/moderator/mentorship"), { credentials: "include" });
				const data = await res.json();
				setSubmissions(data);
			} catch (err) {
				console.error("Failed to fetch mentorship submissions:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchSubmissions();
	}, []);

	const openDetailDialog = (submission: MentorshipSubmission) => {
		setDetailContent(submission);
		setDetailOpen(true);
	};

	if (loading) return <Text>Loading mentorship submissions...</Text>;
	if (submissions.length === 0) return <Text color="fg.muted">No mentorship submissions to review.</Text>;

	return (
		<>
			<Table.Root size="lg" variant="outline" showColumnBorder css={{ "--chakra-colors-border": "#5B5B5B" }}>
				<Table.Header>
					<Table.Row bg="secondary">
						<Table.ColumnHeader>Email</Table.ColumnHeader>
						<Table.ColumnHeader>Role</Table.ColumnHeader>
						<Table.ColumnHeader>Tags</Table.ColumnHeader>
						<Table.ColumnHeader>Details</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{submissions.map((submission) => (
						<Table.Row key={submission._id} bg="tertiary">
							<Table.Cell>{submission.email}</Table.Cell>
							<Table.Cell>{submission.mentorshipRole}</Table.Cell>
							<Table.Cell>
								<HStack gap={1} flexWrap="wrap">
									{submission.tags.map((tag) => (
										<Tag.Root key={tag} size="sm" variant="subtle">
											<Tag.Label>{tag}</Tag.Label>
										</Tag.Root>
									))}
								</HStack>
							</Table.Cell>
							<Table.Cell>
								<Button variant="subtle" size="sm" onClick={() => openDetailDialog(submission)}>
									More Details
								</Button>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>

			{/* Detail dialog */}
			<Dialog.Root open={detailOpen} onOpenChange={({ open }) => setDetailOpen(open)}>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content maxWidth="500px">
							<Dialog.Header>
								<Dialog.Title>Mentorship Submission</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Stack gap={4}>
									{[
										{ label: "Email", value: detailContent?.email },
										{ label: "User ID", value: detailContent?.userId },
										{ label: "Role", value: detailContent?.mentorshipRole },
									].map(({ label, value }) =>
										value ? (
											<Box key={label}>
												<Text fontWeight="bold" mb={1}>
													{label}
												</Text>
												<Text>{value}</Text>
											</Box>
										) : null,
									)}
									{detailContent?.tags && detailContent.tags.length > 0 && (
										<Box>
											<Text fontWeight="bold" mb={2}>
												Tags
											</Text>
											<HStack gap={2} flexWrap="wrap">
												{detailContent.tags.map((tag) => (
													<Tag.Root key={tag} size="md" variant="subtle">
														<Tag.Label>{tag}</Tag.Label>
													</Tag.Root>
												))}
											</HStack>
										</Box>
									)}
								</Stack>
							</Dialog.Body>
							<Dialog.Footer>
								<Button variant="ghost" onClick={() => setDetailOpen(false)}>
									Close
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
			<Heading size="4xl">Moderator</Heading>
			<Tabs.Root defaultValue="tools">
				<Tabs.List>
					<Tabs.Trigger value="tools">Tool Approvals</Tabs.Trigger>
					<Tabs.Trigger value="mentorship">Mentorship Submissions</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="tools" pt={4}>
					<ToolModerationTab />
				</Tabs.Content>
				<Tabs.Content value="mentorship" pt={4}>
					<MentorshipTab />
				</Tabs.Content>
			</Tabs.Root>
		</Stack>
	);
}

export default AdminPage;
