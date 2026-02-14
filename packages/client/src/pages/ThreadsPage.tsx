import threadsData from '../data/sample_threads.json';
import { Box, Button, CloseButton, Dialog, Flex, Heading, HStack, Input, InputGroup, Portal, Stack, Table, Text, VStack } from "@chakra-ui/react";
import { InfoTip } from '@/components/ui/toggle-tip';
import { useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { formatDate } from '@/lib/utils';

interface Posts {
  id: string;
  title: string;
  topic: string;
  tags: string;
  date: string;
};  

// @todo: NEEDS ACCESSIBILITY 

function ThreadsPage() {
    const [search, setSearch] = useState('');
    const [filteredThreads, setFilteredThreads] = useState<Posts[]>(threadsData);

    const handleFilterSubmit = () => {
      const results = threadsData.filter((post) => 
        post.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredThreads(results);
    };

    const searchDialog = (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button rounded="full" backgroundColor="primary" color="white"> 
            Find a Thread
          </Button>
          
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Find Threads</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack>
                  <Box width="100%">
                    <InputGroup startElement={<LuSearch />}>
                      <Input
                        placeholder="Search by thread name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </InputGroup>

                    {/** @TODO: implement filtering */}
                  </Box>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Flex justify="center" w="100%">
                    <Button onClick={handleFilterSubmit} bg="primary" w="200px">
                      Submit
                    </Button>
                  </Flex>
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
            Browse Threads 
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
              <Table.ColumnHeader>Title</Table.ColumnHeader>
              <Table.ColumnHeader>Topic</Table.ColumnHeader>
              <Table.ColumnHeader>Tags</Table.ColumnHeader>
              <Table.ColumnHeader>Date</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredThreads.map((posts) => (
              <Table.Row key={posts.id} bg="tertiary">
                <Table.Cell>{posts.title}</Table.Cell>
                <Table.Cell>{posts.topic}</Table.Cell>
                <Table.Cell>{posts.tags}</Table.Cell>
                <Table.Cell>{formatDate(posts.date)}</Table.Cell>

              </Table.Row>
            ))}
          </Table.Body>

        </Table.Root>
      </Stack>
    );
}

export default ThreadsPage