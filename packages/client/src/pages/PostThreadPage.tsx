import { Button, Field, Flex, Heading, Input, Stack, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { type FieldError, type RegisterOptions, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormDialog } from "@/components/FormDialog";
import { api, formDataCast } from "@/lib/utils";

interface ThreadData {
	title: string;
	topic: string;
	content: string;
	tags: string;
}

type TName = "title" | "topic" | "content" | "tags";

interface PostPageProps {
	label: string;
	text: string;
	name: TName;
	registerOptions: RegisterOptions<ThreadData, TName> | undefined;
	error: FieldError | undefined;
}

function PostThreadPage() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogBody, setDialogBody] = useState<string>("");
	const [dialogTitle, setDialogTitle] = useState<string>("");
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ThreadData>();

	const onSubmit = handleSubmit(async (data) => {
		const formData = formDataCast(data);
		try {
			const res = await fetch(api("/api/thread"), {
				method: "POST",
				body: formData,
				credentials: "include",
			});
			if (res.ok) {
				const { id } = await res.json();
				navigate(`/community/threads/${id}`);
			} else {
				setDialogOpen(true);
				setDialogTitle(`Error: ${res.statusText}`);
				setDialogBody("An error occurred while processing your submission.");
			}
		} catch (err) {
			if (err instanceof Error) {
				setDialogOpen(true);
				setDialogTitle(err.name);
				setDialogBody(err.message);
			}
		}
	});

	const PostPageInput = ({ label, text, name, registerOptions, error }: PostPageProps) => {
		return (
			<Field.Root orientation="horizontal" required invalid={!!error}>
				<Field.Label>
					{label} <Field.RequiredIndicator />
				</Field.Label>
				<Input placeholder={text} {...register(name, registerOptions)} />
				<Field.ErrorText>{error?.message}</Field.ErrorText>
			</Field.Root>
		);
	};

	return (
		<form onSubmit={onSubmit}>
			<Stack align="flex-start" gap={8} w="80%">
				<Heading as="h1" size="4xl">
					Post a Thread
				</Heading>

				<PostPageInput
					label="Title:"
					text="Title your post"
					name="title"
					registerOptions={{ required: "A title is required" }}
					error={errors.title}
				/>
				<PostPageInput
					label="Topic:"
					text="Ex. Programming IDEs"
					name="topic"
					registerOptions={{ required: "A topic is required" }}
					error={errors.topic}
				/>

				<Field.Root orientation="horizontal" required>
					<Field.Label>
						Content: <Field.RequiredIndicator />
					</Field.Label>
					<Textarea resize="none" {...register("content", { required: "Content is required" })} />
				</Field.Root>

				<PostPageInput
					label="Tag(s):"
					text="Ex. Python, Java, Programming"
					name="tags"
					registerOptions={{ required: "At least one tag is required" }}
					error={errors.tags}
				/>
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

export default PostThreadPage;
