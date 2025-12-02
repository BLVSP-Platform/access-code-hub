import toolsData from '../data/sample_tools.json';
import { Box, Button, CloseButton, Dialog, Heading, HStack, Input, InputGroup, Portal, RatingGroup, Stack, Table, Text, VStack } from "@chakra-ui/react";
import { InfoTip } from '@/components/ui/toggle-tip';
import { useState } from 'react';
import { LuSearch } from 'react-icons/lu';

interface Tool {
  id: string;
  name: string;
  compatibility: string;
  description: string;
  rating: number;
};

// @todo: NEEDS ACCESSIBILITY 

function ToolIndexPage() {
    const [search, setSearch] = useState('');
    const [filteredTools, setFilteredTools] = useState<Tool[]>(toolsData);

    const handleFilterSubmit = () => {
      const results = toolsData.filter((tool) => 
        tool.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredTools(results);
    };

    const searchDialog = (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button rounded="full" backgroundColor="primary" color="white"> 
            Find a Tool
          </Button>
          
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Find Tools</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack>
                  <Box width="100%">
                    <InputGroup startElement={<LuSearch />}>
                      <Input
                        placeholder="Search by tool name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </InputGroup>
                  </Box>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button onClick={handleFilterSubmit} bg="primary">Submit</Button> {/* center this? */}
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="xl" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
    

    return (
      <Stack gap={4}>
        <HStack mb={8}>
          <Heading size="4xl">
            Tool Index
          </Heading>
          <Text fontSize="xs" mt={4}>
            Last Updated: October 26, 2025 03:26am {/* @todo: shouldn't hardcode this */}
          </Text>

        </HStack>

        <HStack gap={-2}>
          {searchDialog}
      
          <Box mb={4}>
            <InfoTip content="hellooo" /> {/* placeholder */}
          </Box>
          
        </HStack>
        
        <Table.Root size="lg" variant="outline" showColumnBorder>
          <Table.Header>
            <Table.Row bg="secondary">
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Compatibility</Table.ColumnHeader>
              <Table.ColumnHeader>Description</Table.ColumnHeader>
              <Table.ColumnHeader>Overall Ratings</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredTools.map((tool) => (
              <Table.Row key={tool.id} bg="tertiary">
                <Table.Cell>{tool.name}</Table.Cell>
                <Table.Cell>{tool.compatibility}</Table.Cell>
                <Table.Cell>{tool.description}</Table.Cell>
                <Table.Cell>
                  <RatingGroup.Root readOnly count={5} value={tool.rating} size="sm">
                    <RatingGroup.HiddenInput />
                    <RatingGroup.Control />
                  </RatingGroup.Root>

                </Table.Cell>

              </Table.Row>
            ))}
          </Table.Body>

        </Table.Root>
      </Stack>
    );
}

export default ToolIndexPage