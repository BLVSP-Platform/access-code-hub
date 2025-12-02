import { Heading, Link, Stack, Text } from "@chakra-ui/react";

function ToolSubmissionPage() {
  return (
    <Stack gap={4}>
      <Heading size="4xl">
        Tool Submission Form
      </Heading>
      <Text>
        To submit a tool, please fill out the {' '}
        <Link 
          href="https://forms.gle/kjVtXty6fc8Wq95g8"
          variant="underline"
          colorPalette="blue"
        >
          Google Form here.
        </Link>
      </Text>
    </Stack>
  );
}

export default ToolSubmissionPage;