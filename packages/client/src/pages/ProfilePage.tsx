
import { For, Image, Heading, HStack, Stack, Box, Input, Button, Center, Tag, Text, Spinner } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { updateUser, useSession } from "@/lib/auth";

const defaultAvatar =
	"https://t4.ftcdn.net/jpg/00/64/67/27/240_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg";

function parseToolsList(raw: string | null | undefined): string[] {
	if (!raw?.trim()) return [];
	return raw
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);
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
		imageUrl: "",
	});

	const syncFromUser = useCallback(() => {
		if (!user) return;
		setProfile({
			name: user.name ?? "",
			about: user.about ?? "",
			toolsText: (user.toolsList ?? "").split(",").map((t) => t.trim()).filter(Boolean).join(", "),
			imageUrl: user.image ?? "",
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
			const toolsList = profile.toolsText
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
				.join(", ");

			const { error } = await updateUser({
				name: profile.name,
				about: profile.about,
				toolsList,
				image: profile.imageUrl.trim() || undefined,
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

	const displayImage = profile.imageUrl.trim() || defaultAvatar;
	const viewToolsTags = parseToolsList(user?.toolsList);

	/* Button Component */
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

	/* Tags, for listing tools neatly */
	const CustomTag = ({ tags }: { tags: string[] }) => (
		<HStack>
			<For each={tags}>
				{(tag, index) => (
					<Tag.Root size="xl" key={`${tag}-${index}`}>
						<Tag.Label>{tag}</Tag.Label>
					</Tag.Root>
				)}
			</For>
		</HStack>
	);

	/* Form Field Component for editing info */
	type FormFieldProps = {
		label: string;
		placeholder: string;
		value: string;
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	};

	function FormField({ label, placeholder, value, onChange }: FormFieldProps) {
		return (
			<Box>
				<Box as="label" fontSize="sm" fontWeight="medium" mb="2" display="block">
					{label}
				</Box>
				<Input placeholder={placeholder} value={value} onChange={onChange} borderColor="gray.300" />
			</Box>
		);
	}

	if (isPending) {
		return (
			<Center minH="50vh">
				<Spinner size="xl" />
			</Center>
		);
	}

	if (!user) {
		return (
			<Stack>
				<Heading as="h1" size="4xl">
					Profile
				</Heading>
				<Text>Sign in to view your profile.</Text>
			</Stack>
		);
	}

	// Edit Mode View
	if (isEditing) {
		return (
			<Stack>
				<Heading as="h1" size="4xl">
					Edit Your Profile
				</Heading>
				<Center h="70vh">
					<Stack align="center" gap="8" maxW="md" w="full">
						<Image
							src={displayImage}
							boxSize="200px"
							borderRadius="full"
							border="2px solid"
							borderColor="gray.300"
							fit="cover"
							alt="Profile"
						/>

						<Stack w="full" gap="4">
							<FormField
								label="Profile image URL"
								placeholder="https://…"
								value={profile.imageUrl}
								onChange={(e) => handleChange("imageUrl", e.target.value)}
							/>
							<Text fontSize="sm" color="gray.600">
								Better Auth stores a URL for your avatar. Paste an image link you control (for example from your
								hosting or Gravatar).
							</Text>
						</Stack>

						<Stack w="full" gap="4">
							<FormField
								label="Name"
								placeholder="Enter your name"
								value={profile.name}
								onChange={(e) => handleChange("name", e.target.value)}
							/>

							<FormField
								label="About me"
								placeholder="Tell us about yourself"
								value={profile.about}
								onChange={(e) => handleChange("about", e.target.value)}
							/>

							<FormField
								label="Tools (comma-separated)"
								placeholder="TypeScript, React, Node"
								value={profile.toolsText}
								onChange={(e) => handleChange("toolsText", e.target.value)}
							/>
						</Stack>

						{saveError ? (
							<Text color="red.500" fontSize="sm">
								{saveError}
							</Text>
						) : null}

						<HStack w="full" gap="3">
							<CustomButton
								onClick={() => {
									syncFromUser();
									setSaveError("");
									setIsEditing(false);
								}}
								disabled={saving}
							>
								Cancel
							</CustomButton>
							<CustomButton onClick={handleSave} loading={saving}>
								Save
							</CustomButton>
						</HStack>
					</Stack>
				</Center>
			</Stack>
		);
	}

	return (
		<>
			<Heading as="h1" size="4xl">
				Profile
			</Heading>
			<Stack align="center">
				<Stack align="left" mt="10" gap="6" w="300px">
					<Image
						src={displayImage}
						boxSize="300px"
						borderRadius="full"
						border="1px solid"
						fit="cover"
						alt="Profile"
					/>

					<Box as="section" fontSize="xl" display="flex" flexDir="column" gap="6">
						<p>Name: {user.name || "—"}</p>
						<p>Email: {user.email}</p>
						<p>About: {user.about?.trim() ? user.about : "—"}</p>
						<p>
							Tools used:{" "}
							{viewToolsTags.length ? <CustomTag tags={viewToolsTags} /> : <Text as="span">—</Text>}
						</p>
					</Box>

					<CustomButton onClick={() => setIsEditing(true)}>Edit profile</CustomButton>
				</Stack>
			</Stack>
		</>
	);
}

export default ProfilePage;
