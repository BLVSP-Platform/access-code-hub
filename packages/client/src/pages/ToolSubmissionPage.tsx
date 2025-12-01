import { Button, Field, Heading, HStack, Input, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import { Form } from "react-router-dom";

function ToolSubmissionPage() {
  const FormInput = ({ label, required = true }: { label: string, required?: boolean }) => (
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
      <Form>
        <VStack gap={4} align="stretch">
          <FormInput label="Email" />
          <FormInput label="Link to Tool" />
          <FormInput label="Description" />
          <FormInput label="Compatability Information" required={false} />
          <FormInput label="Tutorial Video(s)" required={false} />
          <FormInput label="Creator's Guidelines/Cautions for the Tool" required={false} />
          <FormInput label="Limitations" required={false} />
          <FormInput label="Extra Comments" required={false} />
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
          <Button variant="outline">Submit</Button>
        </VStack>
      </Form>
    </Stack >
  );
}

export default ToolSubmissionPage;

