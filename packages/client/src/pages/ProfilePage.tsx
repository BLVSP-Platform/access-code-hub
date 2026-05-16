import { Box, Button, Center, For, Heading, HStack, Input, Spinner, Stack, Tag, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { updateUser, useSession } from "@/lib/auth";

function parseToolsList(raw: string | null | undefined): string[] {
	if (!raw?.trim()) return [];

	return raw
		.split(",")
		.map((tool) => tool.trim())
		.filter(Boolean);
}

type CustomButtonProps = {
	children: React.ReactNode;
	onClick?: () => void;
	type?: "button" | "submit";
	loading?: boolean;
	disabled?: boolean;
};

function CustomButton({ children, onClick, type = "button", loading, disabled }: CustomButtonProps) {
	return (
		<Button
			borderColor="primary"
			w="full"
			_hover={{ bg: "primary", color: "white" }}
			variant="outline"
			size="lg"
			type={type}
			onClick={onClick}
			loading={loading}
			disabled={disabled}
		>
			{children}
		</Button>
	);
}

function CustomTag({ tags }: { tags: string[] }) {
	return (
		<HStack wrap="wrap" gap="2">
			<For each={tags}>
				{(tag, index) => (
					<Tag.Root size="lg" key={`${tag}-${index}`}>
						<Tag.Label>{tag}</Tag.Label>
					</Tag.Root>
				)}
			</For>
		</HStack>
	);
}

type FormFieldProps = {
	label: string;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function FormField({ label, placeholder, value, onChange }: FormFieldProps) {
	return (
		<Box w="full">
			<Box as="label" fontSize="sm" fontWeight="medium" mb="2" display="block">
				{label}
			</Box>
			<Input placeholder={placeholder} value={value} onChange={onChange} borderColor="gray.300" />
		</Box>
	);
}

function ProfilePage() {
	const { data, isPending } = useSession();
	const user = data?.user;

	const [isEditing, setIsEditing] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [saving, setSaving] = useState(false);

	const [profile, setProfile] = useState({
		name: "",
		about: "",
		toolsText: "",
	});

	const syncFromUser = useCallback(() => {
		if (!user) return;

		setProfile({
			name: user.name ?? "",
			about: user.about ?? "",
			toolsText: parseToolsList(user.toolsList).join(", "),
		});
	}, [user]);

	useEffect(() => {
		syncFromUser();
	}, [syncFromUser]);

	const handleChange = (field: keyof typeof profile, value: string) => {
		setProfile((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = async () => {
		setSaveError("");
		setSaving(true);

		try {
			const toolsList = parseToolsList(profile.toolsText).join(", ");

			const { error } = await updateUser({
				name: profile.name,
				about: profile.about,
				toolsList,
			});

			if (error) {
				setSaveError(error.message ?? "Could not save profile.");
				return;
			}

			setIsEditing(false);
		} catch (e) {
			setSaveError(e instanceof Error ? e.message : "Could not save profile.");
		} finally {
			setSaving(false);
		}
	};

	if (isPending) {
		return (
			<Center minH="50vh">
				<Spinner size="xl" />
			</Center>
		);
	}

	if (!user) {
		return (
			<Stack gap="4">
				<Heading as="h1" size="4xl">
					Profile
				</Heading>
				<Text>Sign in to view your profile.</Text>
			</Stack>
		);
	}

	if (isEditing) {
		return (
			<Stack gap="8">
				<Heading as="h1" size="4xl">
					Edit Your Profile
				</Heading>

				<Center>
					<Stack
						align="center"
						gap="6"
						maxW="md"
						w="full"
						p="8"
						borderWidth="1px"
						borderRadius="2xl"
						boxShadow="sm"
					>
						<FormField
							label="Name"
							placeholder="Enter your name"
							value={profile.name}
							onChange={(e) => handleChange("name", e.target.value)}
						/>

						<FormField
							label="About"
							placeholder="Tell us about yourself"
							value={profile.about}
							onChange={(e) => handleChange("about", e.target.value)}
						/>

						<FormField
							label="Tools"
							placeholder="TypeScript, React, Node"
							value={profile.toolsText}
							onChange={(e) => handleChange("toolsText", e.target.value)}
						/>

						{saveError ? (
							<Text color="red.500" fontSize="sm">
								{saveError}
							</Text>
						) : null}

						<HStack w="full" gap="3">
							<CustomButton onClick={handleSave} loading={saving}>
								Save
							</CustomButton>
						</HStack>
					</Stack>
				</Center>
			</Stack>
		);
	}

	const viewToolsTags = parseToolsList(user.toolsList);

	return (
		<Stack gap="8">
			<Heading as="h1" size="4xl">
				Profile
			</Heading>

			<Center>
				<Stack w="full" maxW="md" gap="6" p="8" borderWidth="1px" borderRadius="2xl" boxShadow="sm">
					<Box>
						<Text fontSize="sm" color="gray.500">
							Name
						</Text>
						<Heading size="xl">{user.name || "—"}</Heading>
					</Box>

					<Box>
						<Text fontSize="sm" color="gray.500">
							About
						</Text>
						<Text fontSize="lg">{user.about?.trim() ? user.about : "—"}</Text>
					</Box>

					<Box>
						<Text fontSize="sm" color="gray.500" mb="2">
							Tools
						</Text>

						{viewToolsTags.length ? <CustomTag tags={viewToolsTags} /> : <Text>—</Text>}
					</Box>

					<CustomButton onClick={() => setIsEditing(true)}>Edit profile</CustomButton>
				</Stack>
			</Center>
		</Stack>
	);
}

export default ProfilePage;
