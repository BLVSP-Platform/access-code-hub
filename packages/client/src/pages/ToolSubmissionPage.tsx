import {
	Box,
	Button,
	Field,
	Flex,
	Heading,
	HStack,
	Input,
	RadioGroup,
	type RadioGroupValueChangeDetails,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/FormDialog";

interface ToolSubmissionData {
	email: string;
	name: string;
	link: string;
	description: string;
	compatability?: string;
	videos?: string;
	guidelines?: string;
	limits?: string;
	comments?: string;
	isCreator: "true" | "false";
	creatorEmail?: string;
}

interface TextInputProps {
	name: keyof ToolSubmissionData;
	label: string;
	register: ReturnType<typeof useForm<ToolSubmissionData>>["register"];
	error?: string;
	required?: boolean;
	type?: React.HTMLInputTypeAttribute;
	placeholder?: string;
	pattern?: RegExp;
	errorMsg?: string;
}

const TextInput = ({
	name,
	label,
	register,
	error,
	required = true,
	type = "text",
	placeholder,
	pattern,
	errorMsg,
}: TextInputProps) => {
	return (
		<Field.Root required={required} invalid={!!error}>
			<Field.Label>
				<Text>{label}</Text>
				{required && <Field.RequiredIndicator />}
			</Field.Label>

			<Input
				type={type}
				placeholder={placeholder}
				{...register(name, {
					required: required ? errorMsg || `Please enter ${label}` : false,
					pattern: pattern
						? {
								value: pattern,
								message: errorMsg || `Please enter a valid ${label}`,
							}
						: undefined,
				})}
			/>

			<Field.ErrorText>{error}</Field.ErrorText>
		</Field.Root>
	);
};

function ToolSubmissionPage() {
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [dialogBody, setDialogBody] = useState("");
	const [dialogTitle, setDialogTitle] = useState("");

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<ToolSubmissionData>();

	const isCreator = watch("isCreator");

	const onSubmit = handleSubmit(async (data) => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (value) formData.append(key, value);
		});

		try {
			const res = await fetch("/api/tool", {
				method: "POST",
				body: formData,
			});

			setDialogOpen(true);

			if (res.ok) {
				setDialogTitle("Success");
				setDialogBody("Thank you for your submission. It will be reviewed by a moderator.");
			} else {
				setDialogTitle(`Error: ${res.statusText}`);
				setDialogBody("An error occurred while processing your submission.");
			}
		} catch (err) {
			if (err instanceof Error) {
				setDialogTitle(err.name);
				setDialogBody(err.message);
			}
		}
	});

	return (
		<Stack gap={4}>
			<Heading size="4xl">Tool Submission Form</Heading>

			<form onSubmit={onSubmit} noValidate>
				<VStack>
					<Box w="sm" alignSelf="start">
						<VStack gap={4} align="stretch">
							<TextInput
								name="email"
								label="Email"
								type="email"
								placeholder="name@example.com"
								register={register}
								error={errors.email?.message}
								pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
								errorMsg="Please enter a valid email address"
							/>

							<TextInput
								name="name"
								label="Tool Name"
								placeholder="Tool name"
								register={register}
								error={errors.name?.message}
								errorMsg="Please enter a name for the tool"
							/>

							<TextInput
								name="link"
								label="Link to Tool"
								type="url"
								placeholder="https://example.com"
								register={register}
								error={errors.link?.message}
								pattern={/^https?:\/\/.+\..+/}
								errorMsg="Please enter a valid URL link"
							/>

							<TextInput
								name="description"
								label="Description"
								register={register}
								error={errors.description?.message}
								errorMsg="Please enter a description"
							/>

							<TextInput
								name="compatability"
								label="Compatability Information"
								register={register}
								required={false}
							/>
							<TextInput
								name="videos"
								label="Tutorial Video(s)"
								type="url"
								placeholder="https://youtube.com/..."
								register={register}
								required={false}
							/>
							<TextInput
								name="guidelines"
								label="Creator's Guidelines/Cautions for the Tool"
								register={register}
								required={false}
							/>
							<TextInput name="limits" label="Limitations" register={register} required={false} />
							<TextInput name="comments" label="Extra Comments" register={register} required={false} />

							<Field.Root required invalid={!!errors.isCreator}>
								<Field.Label>
									<Text>Are you the creator of this tool?</Text>
									<Field.RequiredIndicator />
								</Field.Label>

								<Input
									type="text"
									hidden
									readOnly
									{...register("isCreator", {
										required: "Please select an option.",
									})}
								/>

								<RadioGroup.Root
									onValueChange={(details: RadioGroupValueChangeDetails) => {
										setValue("isCreator", details.value as "true" | "false", {
											shouldValidate: true,
										});
									}}
								>
									<VStack align="start">
										<HStack align="center" justifyContent="space-between">
											<RadioGroup.Item value="true" w="1/2">
												<RadioGroup.ItemHiddenInput />
												<RadioGroup.ItemIndicator />
												<RadioGroup.ItemText>Yes, provide email:</RadioGroup.ItemText>
											</RadioGroup.Item>

											<Input
												type="email"
												placeholder="Email"
												w="1/2"
												{...register("creatorEmail", {
													required:
														isCreator === "true"
															? "Please enter your creator email."
															: false,
													pattern:
														isCreator === "true"
															? {
																	value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
																	message: "Please enter a valid creator email.",
																}
															: undefined,
												})}
											/>
										</HStack>

										<RadioGroup.Item value="false">
											<RadioGroup.ItemHiddenInput />
											<RadioGroup.ItemIndicator />
											<RadioGroup.ItemText>No</RadioGroup.ItemText>
										</RadioGroup.Item>
									</VStack>
								</RadioGroup.Root>

								<Field.ErrorText>
									{errors.isCreator?.message || errors.creatorEmail?.message}
								</Field.ErrorText>
							</Field.Root>
						</VStack>
					</Box>

					<FormDialog
						title={dialogTitle}
						body={dialogBody}
						isOpen={isDialogOpen}
						onOpenChange={(details) => {
							if (!details.open) setDialogOpen(false);
						}}
					>
						<Flex gap="4" w="100%" justify="flex-end" mt="8" pb="8">
							<Button
								borderColor="primary"
								_hover={{ bg: "primary", color: "white" }}
								size="xl"
								variant="outline"
								type="submit"
							>
								Submit
							</Button>
						</Flex>
					</FormDialog>
				</VStack>
			</form>
		</Stack>
	);
}

export default ToolSubmissionPage;
