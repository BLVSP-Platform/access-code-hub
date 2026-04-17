import { Button, Dialog, Field, Flex, Heading, Input, Portal, RadioGroup, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputTagsCombo } from "@/components/ui/input-tags-combo";

interface MentorshipData {
	mentorshipRole: "Mentor" | "Mentee";
	mentorQual: string[];
	menteeQual: string[];
}

function MentorshipPage() {
	const [dialogOpen, setDialogOpen] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm<MentorshipData>();

	const role = watch("mentorshipRole");

	const onSubmit = handleSubmit((data) => {
		console.log(data);
		setDialogOpen(true);
	});

	const items = [
		{ label: "Mentor", value: "Mentor" },
		{ label: "Mentee", value: "Mentee" },
	];

	const submitDialog = (
		<Dialog.Root placement="center" open={dialogOpen} onOpenChange={(e) => setDialogOpen(e.open)}>
			<Portal>
				<Dialog.Backdrop>
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Thank you for signing up!</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>A moderator will review this and get back to you.</Dialog.Body>
							<Dialog.Footer>
								<Dialog.ActionTrigger asChild>
									<Button
										variant="outline"
										borderColor="primary"
										_hover={{ bg: "primary", color: "white" }}
									>
										Close
									</Button>
								</Dialog.ActionTrigger>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.Backdrop>
			</Portal>
		</Dialog.Root>
	);

	return (
		<form onSubmit={onSubmit} noValidate>
			<Stack gap="8" align="flex-start" maxW="70%">
				<Heading as="h1" size="4xl">
					Mentorship
				</Heading>

				{/* mentor/mentee selection ------------------*/}
				<Field.Root required invalid={!!errors.mentorshipRole}>
					<Field.Label>
						Are you interested in giving or receiving mentorship?:
						<Field.RequiredIndicator />
					</Field.Label>

					<Input
						type="text"
						hidden
						readOnly
						required
						{...register("mentorshipRole", { required: "Please select an option." })}
					/>

					<RadioGroup.Root
						onValueChange={(detail) =>
							setValue("mentorshipRole", detail.value as "Mentor" | "Mentee", { shouldValidate: true })
						}
					>
						<Stack gap="3">
							{items.map((item) => (
								<RadioGroup.Item key={item.value} value={item.value}>
									<RadioGroup.ItemHiddenInput />
									<RadioGroup.ItemIndicator />
									<RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
								</RadioGroup.Item>
							))}
						</Stack>
					</RadioGroup.Root>
					<Field.ErrorText>{errors.mentorshipRole?.message}</Field.ErrorText>
				</Field.Root>

				{/* mentor input */}
				{role === "Mentor" && (
					<Field.Root invalid={!!errors.mentorQual}>
						<Controller
							name="mentorQual"
							control={control}
							rules={{
								validate: (v) => (v?.length ?? 0) > 0 || "Please list your qualifications",
							}}
							render={({ field }) => (
								<InputTagsCombo
									label="If you would like to mentor, what qualifications do you have to share?:"
									placeholder="Type to start adding tags..."
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						<Field.ErrorText>{errors.mentorQual?.message}</Field.ErrorText>
					</Field.Root>
				)}

				{/* mentee input */}
				{role === "Mentee" && (
					<Field.Root invalid={!!errors.menteeQual}>
						<Controller
							name="menteeQual"
							control={control}
							rules={{
								validate: (v) =>
									(v?.length ?? 0) > 0 || "Please add at least one preference or N/A for none",
							}}
							render={({ field }) => (
								<InputTagsCombo
									label="If you would like to be a mentee, what qualifications do you want from a mentor?:"
									placeholder="Type to start adding tags..."
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						<Field.ErrorText>{errors.menteeQual?.message}</Field.ErrorText>
					</Field.Root>
				)}
			</Stack>

			<Flex gap="4" w="100%" justify="flex-end" mt="8">
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

			{submitDialog}
		</form>
	);
}

export default MentorshipPage;
