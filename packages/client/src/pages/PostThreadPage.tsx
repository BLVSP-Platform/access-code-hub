import { Portal, Dialog, Input, Button, Flex, Stack, Textarea, Heading, Box, Field } from "@chakra-ui/react"

interface PostPageProps {
    label: string;
    text: string;
}

const submitDialog = (
          <Dialog.Root>
            <Dialog.Trigger asChild>
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
            </Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop>
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header><Dialog.Title>Thread Posted!</Dialog.Title></Dialog.Header>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                        <Button 
                                        variant="outline"
                                        borderColor="primary" 
                                        _hover={{ bg: "primary", color: "white" }}>
                                            Close
                                        </Button>
                                    </Dialog.ActionTrigger>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Dialog.Backdrop>
                </Portal>
            </Dialog.Root>
    )

const PostPageItem = ({ label, text }: PostPageProps) => {
    return (
        <Field.Root orientation="horizontal" required>
            <Field.Label>
                {label} <Field.RequiredIndicator />
            </Field.Label>
            <Input placeholder={text} />
        </Field.Root>
    );
};

function PostThreadPage() {
    return (
        <>
        <Stack align="flex-start" gap={8} w="80%">
            <Heading as="h1" size="4xl">
                Post a Thread
            </Heading>

            <PostPageItem label="Title:" text="Title your post" />
            <PostPageItem label="Topic:" text="Ex. Programming IDEs" />

            <Field.Root orientation="horizontal" required>
                <Field.Label>
                    Content: <Field.RequiredIndicator />
                </Field.Label>
                <Textarea resize="none" />
            </Field.Root>

            <PostPageItem label="Tag(s):" text="Ex. Python, Java, Programming" />
        </Stack>

        {submitDialog}
        </>
    )
}

export default PostThreadPage