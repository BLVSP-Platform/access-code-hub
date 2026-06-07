// AdminPage.tsx
import {
	Badge,
	Box,
	Button,
	Dialog,
	Heading,
	HStack,
	Portal,
	Stack,
	Table,
	Tabs,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuCheck, LuX } from "react-icons/lu";
import { api } from "@/lib/utils";

interface VolunteerSubmission {
	_id: string;
	userId: string;
	email: string;
	shortAnswer: string;
	createdAt: string;
}

type ActionType = "approve" | "reject";

function VolunteerTab() {
	const [submissions, setSubmissions] = useState<VolunteerSubmission[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	// Detail dialog
	const [detailOpen, setDetailOpen] = useState(false);
	const [detailContent, setDetailContent] = useState<VolunteerSubmission | null>(null);

	// Confirm dialog
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmContent, setConfirmContent] = useState<{
		submission: VolunteerSubmission;
		action: ActionType;
	} | null>(null);
	const [confirmStep, setConfirmStep] = useState<1 | 2>(1);

	useEffect(() => {
		const fetchSubmissions = async () => {
			try {
				const res = await fetch(api("/api/admin/volunteer"), { credentials: "include" });
				const data = await res.json();
				setSubmissions(data);
			} catch (err) {
				console.error("Failed to fetch volunteer submissions:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchSubmissions();
	}, []);

	const openDetailDialog = (submission: VolunteerSubmission) => {
		setDetailContent(submission);
		setDetailOpen(true);
	};

	const openConfirmDialog = (submission: VolunteerSubmission, action: ActionType) => {
		setConfirmContent({ submission, action });
		setConfirmStep(1);
		setConfirmOpen(true);
	};

	const handleConfirm = async () => {
		if (!confirmContent) return;
		const { submission, action } = confirmContent;
		setSubmitting(true);
		try {
			await fetch(api(`/api/admin/volunteer/${submission._id}/${action}`), {
				method: "POST",
				credentials: "include",
			});
			setSubmissions((prev) => prev.filter((s) => s._id !== submission._id));
			setConfirmOpen(false);
		} catch (err) {
			console.error("Failed to update volunteer submission:", err);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <Text>Loading volunteer submissions...</Text>;
	if (submissions.length === 0) return <Text color="fg.muted">No pending volunteer submissions.</Text>;

	return (
		<>
			<Table.Root size="lg" variant="outline" showColumnBorder css={{ "--chakra-colors-border": "#5B5B5B" }}>
				<Table.Header>
					<Table.Row bg="secondary">
						<Table.ColumnHeader>Email</Table.ColumnHeader>
						<Table.ColumnHeader>Details</Table.ColumnHeader>
						<Table.ColumnHeader>Actions</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{submissions.map((submission) => (
						<Table.Row key={submission._id} bg="tertiary">
							<Table.Cell>{submission.email}</Table.Cell>
							<Table.Cell>
								<Button variant="subtle" size="sm" onClick={() => openDetailDialog(submission)}>
									More Details
								</Button>
							</Table.Cell>
							<Table.Cell>
								<HStack gap={2}>
									<Button
										size="sm"
										bg="green.500"
										variant="subtle"
										onClick={() => openConfirmDialog(submission, "approve")}
									>
										<LuCheck /> Approve
									</Button>
									<Button
										size="sm"
										bg="red.400"
										variant="subtle"
										onClick={() => openConfirmDialog(submission, "reject")}
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
						<Dialog.Content maxWidth="500px">
							<Dialog.Header>
								<Dialog.Title>Volunteer Application</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Stack gap={4}>
									{[
										{ label: "Email", value: detailContent?.email },
										{ label: "User ID", value: detailContent?.userId },
										{ label: "How they'd like to help", value: detailContent?.shortAnswer },
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
												<Text>{value}</Text>
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
			<Dialog.Root
				open={confirmOpen}
				onOpenChange={({ open }) => {
					setConfirmOpen(open);
					if (!open) setConfirmStep(1);
				}}
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>
									{confirmContent?.action === "approve" ? "Approve Volunteer" : "Reject Volunteer"}
								</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Text>
									Are you sure you want to{" "}
									<Badge color={confirmContent?.action === "approve" ? "green" : "red"}>
										{confirmContent?.action}
									</Badge>{" "}
									<strong>{confirmContent?.submission.email}</strong>?
									{confirmContent?.action === "approve"
										? " This will grant them moderator access."
										: " Their application will be marked as rejected."}
								</Text>
							</Dialog.Body>
							<Dialog.Footer>
								<Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={submitting}>
									Cancel
								</Button>
								{confirmStep === 1 ? (
									<Button
										bg={confirmContent?.action === "approve" ? "green.500" : "red.400"}
										onClick={() => setConfirmStep(2)}
									>
										{confirmContent?.action === "approve" ? "Make Moderator" : "Reject"}
									</Button>
								) : (
									<Button
										bg={confirmContent?.action === "approve" ? "green.500" : "red.400"}
										onClick={handleConfirm}
										loading={submitting}
									>
										I am absolutely sure
									</Button>
								)}
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
			<Tabs.Root defaultValue="volunteers">
				<Tabs.List>
					<Tabs.Trigger value="volunteers">Volunteer Applications</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="volunteers" pt={4}>
					<VolunteerTab />
				</Tabs.Content>
			</Tabs.Root>
		</Stack>
	);
}

export default AdminPage;
