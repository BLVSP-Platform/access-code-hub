import { Box, Button, Field, Heading, HStack, Input, RadioGroup, RadioGroupValueChangeDetails, Stack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

const TextInput = ({ name, label, required = true }: { name: string, label: string, required?: boolean }) => {
  return (
    <Field.Root required={required}>
      <Field.Label>
        <Text>{label}</Text>
        <Field.RequiredIndicator />
      </Field.Label>
      <Input name={name} />
    </Field.Root>
  );
}

const EmailField = () => (
  <TextInput name="email" label="Email" />
);

const ToolLinkField = () => (
  <TextInput name="link" label="Link to Tool" />
);

const DescriptionField = () => (
  <TextInput name="description" label="Description" />
);

const CompatabilityField = () => (
  <TextInput name="compatability" label="Compatability Information" required={false} />
);

const VideoField = () => (
  <TextInput name="videos" label="Tutorial Video(s)" required={false} />
);

const GuidelinesField = () => (
  <TextInput name="guidelines" label="Creator's Guidelines/Cautions for the Tool" required={false} />
);

const LimitsField = () => (
  <TextInput name="limits" label="Limitations" required={false} />
);

const CommentsField = () => (
  <TextInput name="comments" label="Extra Comments" required={false} />
);

const CreatorField = () => {
  const [isEmailRequired, setEmailRequired] = useState<boolean>(false);
  const toggleEmailRequired = (details: RadioGroupValueChangeDetails) => {
    if (details.value === "true") setEmailRequired(true);
    else setEmailRequired(false);
  }

  return (
    <Field.Root required>
      <Field.Label>
        <Text>Are you the creator of this tool?</Text>
        <Field.RequiredIndicator />
      </Field.Label>
      <RadioGroup.Root name="isCreator" onValueChange={toggleEmailRequired}>
        <VStack align="start">
          <HStack align="center" justifyContent="space-between">
            <RadioGroup.Item value="true" w="1/2" >
              <RadioGroup.ItemHiddenInput></RadioGroup.ItemHiddenInput>
              <RadioGroup.ItemIndicator></RadioGroup.ItemIndicator>
              <RadioGroup.ItemText>Yes, provide email: </RadioGroup.ItemText>
            </RadioGroup.Item>
            <Input type="email" placeholder="Email" w="1/2" required={isEmailRequired} />
          </HStack>
          <RadioGroup.Item value="false">
            <RadioGroup.ItemHiddenInput></RadioGroup.ItemHiddenInput>
            <RadioGroup.ItemIndicator></RadioGroup.ItemIndicator>
            <RadioGroup.ItemText>No</RadioGroup.ItemText>
          </RadioGroup.Item>
        </VStack>
      </RadioGroup.Root>
    </Field.Root>
  )
};

function ToolSubmissionPage() {
  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Get form data from the submit event
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const res = await fetch("http://localhost:5173/api/tool", {
      method: "POST",
      body: formData,
    });
    // Handle the response from the server
    if (res.ok) { /* [...] */ }
    else { /* [...] */ }
  };



  return (
    <Stack gap={4}>
      <Heading size="4xl">
        Tool Submission Form
      </Heading>
      <form onSubmit={submitForm}>
        <VStack>
          <Box w="sm" alignSelf="start">
            <VStack gap={4} align="stretch">
              <EmailField />
              <ToolLinkField />
              <DescriptionField />
              <CompatabilityField />
              <VideoField />
              <GuidelinesField />
              <LimitsField />
              <CommentsField />
              <CreatorField />
            </VStack>
          </Box>
          <Button type="submit" variant="outline" borderColor="primary" borderWidth="medium" size="2xl" w="2xs" alignSelf="end">Submit</Button>
        </VStack>
      </form>
    </Stack >
  );
}

export default ToolSubmissionPage;

