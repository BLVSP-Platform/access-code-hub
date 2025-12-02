import { Field, Heading, HStack, Input, RadioGroup, Stack, VStack } from "@chakra-ui/react";

function CustomToolSubmissionPage() {
  return (
    <Stack gap={4}>
      <Heading size="4xl">
        Tool Submission Form
      </Heading>
      <VStack>
        <Field.Root required>
          <Field.Label>
            Tool Name:
            <Field.RequiredIndicator /> 
          </Field.Label>
          <Input width={328} placeholder="Placeholder"></Input> {/* @todo: good width? */}
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            Link to tool:
            <Field.RequiredIndicator /> 
          </Field.Label>
          <Input width={328} placeholder="Placeholder"></Input> 
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            Description:
            <Field.RequiredIndicator /> 
          </Field.Label>
          <Input width={328} placeholder="Placeholder"></Input> 
        </Field.Root>
        <Field.Root>
          <Field.Label>
            Compatibility Information:
          </Field.Label>
          <Input width={328} placeholder="Placeholder"></Input> 
        </Field.Root>
        <Field.Root>
          <Field.Label>
            Tutorial Video(s):
          </Field.Label>
          <Input width={328} placeholder="Placeholder"></Input> 
        </Field.Root>
        <Field.Root>
          <Field.Label>
            Creator's Guidelines/Cautions for the Tool:
          </Field.Label>
          <Input width={328} placeholder="Placeholder"></Input> 
        </Field.Root>
        <Field.Root>
          <Field.Label>
            Limitations:
          </Field.Label>
          <Input width={328} placeholder="Placeholder"></Input> 
        </Field.Root>
        <Field.Root>
          <Field.Label>
            Extra Comments:
          </Field.Label>
          <Input width={328} placeholder="Placeholder"></Input> 
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            Are you the creator of this tool?<Field.RequiredIndicator />:
          </Field.Label>
          <RadioGroup.Root>
            <VStack align="start">
              <HStack align="center">
                <RadioGroup.Item value="Yes">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>Yes, provide Email:</RadioGroup.ItemText>
                </RadioGroup.Item>
                <Input width={328} placeholder="Email"></Input> 
              </HStack>
              <RadioGroup.Item value="No">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>No</RadioGroup.ItemText>
              </RadioGroup.Item>
            </VStack>
          </RadioGroup.Root>
        </Field.Root>
      </VStack>
    </Stack>
  );
}

export default CustomToolSubmissionPage;