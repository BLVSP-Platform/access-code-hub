import { Box, Grid, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";

interface HomePageItemProps {
  to: string;
  title: string;
  description: string;
};

const HomePageItem = ({ to, title, description }: HomePageItemProps) => {
  return (
    <Box>
      <Heading rounded="sm" bg="primary" px={2} py={4} textAlign="center" mb={2}>
        <ChakraLink asChild>
          <ReactLink to={to}>
            <Text color="white">
              {title}
            </Text>
          </ReactLink>
        </ChakraLink>
      </Heading>
      <Text rounded="sm" bg="tertiary" px={2} py={4} textAlign="center" height="full">
        {description}
      </Text>
    </Box>
  );
};

function App() {
	return (
		<>
			<Heading size={{
				lg: "7xl",
				sm: "4xl"
			}}>Access Code Hub</Heading>
			<Text textStyle={{
				lg: "xl",
				sm: "md"
			}} mt="12">Welcome to the Access Code Hub! We are a screen reader accessible platform where Blind and Low Vision Software Professionals (BLVSPs) can find software tools for accessibility, network with other BLVSPs and get involved in   community outreach through volunteering. To learn more about us  please see the features below.</Text>
			<Grid templateColumns={{
				lg: "repeat(4, minmax(0, 1fr))",
				sm: "repeat(1, minmax(0, 1fr))"
			}} mt="12" gap="8" rowGap={{
				lg: 0,
				sm: "24"
			}} className="directory">
				<HomePageItem
          to="tools"
          title="Tool Index"
          description="Our Tool Index page is a configured list of accessible tools. Please visit here to find the most applicable tools for your use case."
        />

        <HomePageItem 
          to="#"
          title="Submit A Tool"
          description="To submit a tool to the website please use our Tool Submission Form. This will create a new index in the Tool Index page, so that other developers can take advantage of this utility."
        />

				<HomePageItem
          to="#"
          title="Connect Now"
          description="To learn more about the BLVSP community please visit our Community section. Here you can find other software professionals to discuss useful tools."
        />

        <HomePageItem
          to="#"
          title="Get Involved"
          description="To get more engaged in the community please consider volunteering. Here you can help improve our Tool Index website through content moderation or community outreach."
        />
			</Grid>
		</>
	)
}

export default App