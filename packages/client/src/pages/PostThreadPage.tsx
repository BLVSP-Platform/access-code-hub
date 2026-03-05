import { FormDialog } from "@/components/FormDialog";
import { Input, Button, Flex, Stack, Textarea, Heading, Box, Field } from "@chakra-ui/react"
import { useState } from "react";
import { FieldError, RegisterOptions, useForm } from "react-hook-form"

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

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ThreadData>();

    // @TODO: hook up to backend
    const onSubmit = handleSubmit((data) => {
        console.log(data);
        setDialogOpen(true);
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
                    <Textarea
                        resize="none"
                        {...register("content", { required: "Content is required" })}
                    />
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
                title="Thread Posted!"
                body=""
                isOpen={dialogOpen}
                onOpenChange={details => {
                    if (!details.open) setDialogOpen(false)
                }}
            >
                <Flex gap="4" w="100%" justify="flex-end" mt="8">
                    <Button
                        borderColor="primary"
                        _hover={{ bg: "primary", color: "white" }}
                        size="xl"
                        variant="outline"
                        type="submit">
                        Submit
                    </Button>
                </Flex>
            </FormDialog>
        </form>

    )
}

export default PostThreadPage