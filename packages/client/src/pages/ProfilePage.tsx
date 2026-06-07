import {
	Box,
	Button,
	type ButtonProps,
	Center,
	Heading,
	HStack,
	Input,
	type InputProps,
	Stack,
	Tag,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { Link, type LinkProps, useNavigate } from "react-router-dom";
import { signOut, updateUser, useSession } from "@/lib/auth";
import { normalizeToolsList } from "@/lib/utils";

// TODO : add pfps

function ProfilePageButton(props: ButtonProps & Partial<LinkProps>) {
	return (
		<Button
			borderColor="primary"
			w="full"
			_hover={{ bg: "primary", color: "white" }}
			variant="outline"
			size="lg"
			{...props}
		/>
	);
}

function TagList({ tags }: { tags: string[] }) {
	return (
		<HStack wrap="wrap" gap="2">
			{tags.map((tag) => (
				<Tag.Root size="xl" key={tag}>
					<Tag.Label>{tag}</Tag.Label>
				</Tag.Root>
			))}
		</HStack>
	);
}

type FormFieldProps = InputProps & {
	label: string;
};

function FormField({ label, ...inputProps }: FormFieldProps) {
	return (
		<Box w="full">
			<Box as="label" fontSize="2xl" fontWeight="medium" mb="2" display="block">
				{label}
			</Box>
			<Input borderColor="gray.300" size="xl" {...inputProps} />
		</Box>
	);
}

type ProfileInfo = {
	name: string;
	about: string;
	toolsText: string;
};

function ProfilePage() {
	const navigate = useNavigate();

	const { data, isPending } = useSession();
	const user = data?.user;

	const [isEditing, setIsEditing] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [saving, setSaving] = useState(false);

	const [signOutError, setSignOutError] = useState("");
	const [signingOut, setSigningOut] = useState(false);

	const [profile, setProfile] = useState<ProfileInfo>({
		name: "",
		about: "",
		toolsText: "",
	});

	const syncFromUser = useCallback(() => {
		if (!user) return;

		setProfile({
			name: user.name ?? "",
			about: user.about ?? "",
			toolsText: normalizeToolsList(user.toolsList).join(", "),
		});
	}, [user]);

	useEffect(() => {
		syncFromUser();
	}, [syncFromUser]);

	const handleChange = (field: keyof ProfileInfo, value: string) => {
		setProfile((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = async () => {
		setSaveError("");
		setSaving(true);

		try {
			const toolsList = normalizeToolsList(profile.toolsText).join(", ");

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

	const handleSignOut = async () => {
		setSignOutError("");
		setSigningOut(true);

		try {
			await signOut({
				fetchOptions: {
					onSuccess: () => {
						navigate("/login", { replace: true });
					},
				},
			});
		} catch (e) {
			setSignOutError(e instanceof Error ? e.message : "Could not sign out.");
		} finally {
			setSigningOut(false);
		}
	};

	if (isPending) {
		return <Text textStyle="2xl">Loading...</Text>;
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
						maxW="xl"
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
							label="Tools Used"
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
							<ProfilePageButton onClick={handleSave} loading={saving}>
								Save
							</ProfilePageButton>
						</HStack>
					</Stack>
				</Center>
			</Stack>
		);
	}

	const viewToolsTags = normalizeToolsList(user.toolsList);

	return (
		<Stack gap="8" px={16}>
			<Heading as="h1" size="4xl">
				Profile
			</Heading>

			<HStack w="full" justify="space-between" align="start">
				<Stack w="full" maxW="xl" gap="6" p="10" borderWidth="1px" borderRadius="2xl" boxShadow="sm">
					<Box>
						<Heading as="h2" size="2xl" fontWeight="medium" mb="2">
							Name:
						</Heading>
						<Text fontSize="xl">{user.name || "—"}</Text>
					</Box>

					<Box>
						<Heading as="h2" size="2xl" fontWeight="medium" mb="2">
							About:
						</Heading>
						<Text fontSize="xl">{user.about?.trim() ? user.about : "—"}</Text>
					</Box>

					<Box>
						<Heading as="h2" size="2xl" fontWeight="medium" mb="2">
							Tools Used:
						</Heading>
						{viewToolsTags.length ? <TagList tags={viewToolsTags} /> : <Text>—</Text>}
					</Box>
					<ProfilePageButton onClick={() => setIsEditing(true)}>Edit Profile</ProfilePageButton>
					<ProfilePageButton onClick={handleSignOut} loading={signingOut} disabled={signingOut}>
						Sign Out
					</ProfilePageButton>
					{signOutError && (
						<Text color="red.500" fontSize="sm">
							{signOutError}
						</Text>
					)}
				</Stack>

				<Stack p="10" alignItems="center">
					<Heading as="h3" size="3xl">
						My Activity Feed
					</Heading>

					<VStack gap={4} w="380px">
						<ProfilePageButton disabled>Tool Submissions</ProfilePageButton>
						<ProfilePageButton as={Link} to="/tools/bookmarked">
							Tool Bookmarks
						</ProfilePageButton>
						<ProfilePageButton disabled>Reviews</ProfilePageButton>
						<ProfilePageButton as={Link} to="/community/threads/mine">
							Threads
						</ProfilePageButton>
						<ProfilePageButton as={Link} to="/community/comments/mine">
							Comments
						</ProfilePageButton>
					</VStack>
				</Stack>
			</HStack>
		</Stack>
	);
}

export default ProfilePage;
