import { Box, Button, Field, Heading, HStack, Input, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import { Form } from "react-router-dom";

function ToolSubmissionPage() {
  const TextInput = ({ label, required = true }: { label: string, required?: boolean }) => (
    <Field.Root required={required}>
      <Field.Label>
        <Text>{label}</Text>
        <Field.RequiredIndicator />
      </Field.Label>
      <Input />
    </Field.Root>
  );

  return (
    <Stack gap={4}>
      <Heading size="4xl">
        Tool Submission Form
      </Heading>
      <VStack>
        <Box w="sm" alignSelf="start">
          <Form>
            <VStack gap={4} align="stretch">
              <TextInput label="Email" />
              <TextInput label="Link to Tool" />
              <TextInput label="Description" />
              <TextInput label="Compatability Information" required={false} />
              <TextInput label="Tutorial Video(s)" required={false} />
              <TextInput label="Creator's Guidelines/Cautions for the Tool" required={false} />
              <TextInput label="Limitations" required={false} />
              <TextInput label="Extra Comments" required={false} />
              <Field.Root required>
                <Field.Label>
                  <Text>Are you the creator of this tool?</Text>
                  <Field.RequiredIndicator />
                </Field.Label>
                <RadioGroup.Root>
                  <VStack align="start">
                    <HStack align="center" justifyContent="space-between">
                      <RadioGroup.Item value="Yes" w="1/2">
                        <RadioGroup.ItemHiddenInput></RadioGroup.ItemHiddenInput>
                        <RadioGroup.ItemIndicator></RadioGroup.ItemIndicator>
                        <RadioGroup.ItemText>Yes, provide email: </RadioGroup.ItemText>
                      </RadioGroup.Item>
                      <Input type="email" placeholder="Email" w="1/2" />
                    </HStack>
                    <RadioGroup.Item value="No">
                      <RadioGroup.ItemHiddenInput></RadioGroup.ItemHiddenInput>
                      <RadioGroup.ItemIndicator></RadioGroup.ItemIndicator>
                      <RadioGroup.ItemText>No</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </VStack>
                </RadioGroup.Root>
              </Field.Root>
            </VStack>
          </Form>
        </Box>
        <Button variant="outline" borderColor="primary" borderWidth="thin" w="sm" alignSelf="end">Submit</Button>
      </VStack>
    </Stack >
  );
}

export default ToolSubmissionPage;

