import { Button, Field, Flex, Heading, Input, Stack, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/FormDialog";
import { formDataCast } from "@/lib/utils";

interface VolunteerData {
	shortAnswer: string;
	email: string;
}

function VolunteerPage() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogBody, setDialogBody] = useState<string>("");
	const [dialogTitle, setDialogTitle] = useState<string>("");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<VolunteerData>();

	// @TODO: hook up to backend
	const onSubmit = handleSubmit(async (data) => {
		const formData = formDataCast(data);
		try {
			const res = await fetch("/api/volunteer", {
				method: "POST",
				body: formData,
			});
			// Handle the response from the server
			setDialogOpen(true);
			if (res.ok) {
				setDialogTitle("Thank you for volunteering!");
				setDialogBody("A moderator will review this and get back to you.");
			} else {
				setDialogTitle(`Error: ${res.statusText}`);
				setDialogBody("An error occurred while processing your submission.");
			}
		} catch (err) {
			if (Error.isError(err)) {
				setDialogTitle(err.name);
				setDialogBody(err.message);
			}
		}
	});

	return (
		<form onSubmit={onSubmit}>
			<Stack gap="8" align="flex-start" maxW="70%">
				<Heading as="h1" size="4xl">
					Volunteering
				</Heading>

				<Field.Root required invalid={!!errors.shortAnswer}>
					<Field.Label>
						How would you like to help keep the website maintained?:
						<Field.RequiredIndicator />
					</Field.Label>
					<Textarea
						resize="none"
						size="xl"
						{...register("shortAnswer", { required: "An answer is required" })}
					/>
					<Field.ErrorText>{errors.shortAnswer?.message}</Field.ErrorText>
				</Field.Root>

				<Field.Root required invalid={!!errors.email}>
					{" "}
					{/** @TODO: validate email here */}
					<Field.Label>
						Please enter your email and a moderator will get back to you:
						<Field.RequiredIndicator />
					</Field.Label>
					<Input {...register("email", { required: "Email is required" })} />
					<Field.ErrorText>{errors.email?.message}</Field.ErrorText>
				</Field.Root>
			</Stack>
			<FormDialog
				title={dialogTitle}
				body={dialogBody}
				isOpen={dialogOpen}
				onOpenChange={(details) => {
					if (!details.open) setDialogOpen(false);
				}}
			>
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
			</FormDialog>
		</form>
	);
}

export default VolunteerPage;
