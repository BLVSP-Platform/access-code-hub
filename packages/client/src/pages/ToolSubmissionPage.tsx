import { FormDialog } from "@/components/FormDialog";
import { Box, Button, Field, Heading, HStack, Input, RadioGroup, RadioGroupValueChangeDetails, Stack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface TextInputProps {
  name: string,
  label: string,
  required?: boolean
}
const TextInput = ({
  name,
  label,
  required = true
}: TextInputProps) => {
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
      <RadioGroup.Root name="isCreator" onValueChange={toggleEmailRequired} required>
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
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogBody, setDialogBody] = useState<string>("");
  const [dialogTitle, setDialogTitle] = useState<string>("");

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Get form data from the submit event
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    try {
      const res = await fetch("/api/tool", {
        method: "POST",
        body: formData,
      });
      // Handle the response from the server
      setDialogOpen(true);
      if (res.ok) {
        setDialogTitle("Success");
        setDialogBody("Thank you for your submission. It will be reviewed by a moderator.");
      }
      else {
        setDialogTitle(`Error: ${res.statusText}`);
        setDialogBody("An error occurred while processing your submission.");
      }
    } catch (err) {
      if (Error.isError(err)) {
        setDialogTitle(err.name);
        setDialogBody(err.message);
      }
    }
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
          <FormDialog
            title={dialogTitle}
            body={dialogBody}
            isOpen={isDialogOpen}
            onOpenChange={details => {
              if (!details.open) setDialogOpen(false);
            }}
          >
            <Button type="submit" variant="outline" borderColor="primary" borderWidth="medium" size="2xl" w="2xs" alignSelf="end">Submit</Button>
          </FormDialog>
        </VStack>
      </form>
    </Stack>
  );
}

export default ToolSubmissionPage;

