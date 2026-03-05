import { Flex, Button, Field, Input, Stack, Textarea, Heading } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { FormDialog } from "@/components/FormDialog";

interface VolunteerData {
    shortAnswer: string;
    email: string;
}

function VolunteerPage() {
    const [dialogOpen, setDialogOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VolunteerData>();

    // @TODO: hook up to backend
    const onSubmit = handleSubmit((data) => {
        console.log(data);
        setDialogOpen(true);
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

                <Field.Root required invalid={!!errors.email}> {/** @TODO: validate email here */}
                    <Field.Label>
                        Please enter your email and a moderator will get back to you:
                        <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                        {...register("email", { required: "Email is required" })}
                    />
                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                </Field.Root>
            </Stack>
            <FormDialog
                title="Thank you for volunteering!"
                body="A moderator will review this and get back to you."
                isOpen={dialogOpen}
                onOpenChange={details => {
                    if (!details.open) setDialogOpen(false);
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

export default VolunteerPage