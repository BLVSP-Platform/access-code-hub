import { Box, Button, Field, Heading, HStack, Input, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";

function ToolSubmissionPage() {
  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const res = await fetch("http://localhost:5173/api/tool", {
      method: "POST",
      body: formData,
    });
  };

  const TextInput = ({ name, label, required = true }: { name: string, label: string, required?: boolean }) => (
    <Field.Root required={required}>
      <Field.Label>
        <Text>{label}</Text>
        <Field.RequiredIndicator />
      </Field.Label>
      <Input name={name} />
    </Field.Root>
  );

  return (
    <Stack gap={4}>
      <Heading size="4xl">
        Tool Submission Form
      </Heading>
      <form onSubmit={submitForm}>
        <VStack>
          <Box w="sm" alignSelf="start">
            <VStack gap={4} align="stretch">
              <TextInput name="email" label="Email" />
              <TextInput name="link" label="Link to Tool" />
              <TextInput name="description" label="Description" />
              <TextInput name="compatability" label="Compatability Information" required={false} />
              <TextInput name="videos" label="Tutorial Video(s)" required={false} />
              <TextInput name="guidelines" label="Creator's Guidelines/Cautions for the Tool" required={false} />
              <TextInput name="limits" label="Limitations" required={false} />
              <TextInput name="comments" label="Extra Comments" required={false} />
              <Field.Root required>
                <Field.Label>
                  <Text>Are you the creator of this tool?</Text>
                  <Field.RequiredIndicator />
                </Field.Label>
                <RadioGroup.Root name="isCreator">
                  <VStack align="start">
                    <HStack align="center" justifyContent="space-between">
                      <RadioGroup.Item value="true" w="1/2">
                        <RadioGroup.ItemHiddenInput></RadioGroup.ItemHiddenInput>
                        <RadioGroup.ItemIndicator></RadioGroup.ItemIndicator>
                        <RadioGroup.ItemText>Yes, provide email: </RadioGroup.ItemText>
                      </RadioGroup.Item>
                      <Input type="email" placeholder="Email" w="1/2" />
                    </HStack>
                    <RadioGroup.Item value="false">
                      <RadioGroup.ItemHiddenInput></RadioGroup.ItemHiddenInput>
                      <RadioGroup.ItemIndicator></RadioGroup.ItemIndicator>
                      <RadioGroup.ItemText>No</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </VStack>
                </RadioGroup.Root>
              </Field.Root>
            </VStack>
          </Box>
          <Button type="submit" variant="outline" borderColor="primary" borderWidth="medium" size="2xl" w="2xs" alignSelf="end">Submit</Button>
        </VStack>
      </form>
    </Stack >
  );
}

export default ToolSubmissionPage;

