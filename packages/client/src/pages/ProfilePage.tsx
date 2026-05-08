import { For, Image, Heading, HStack, Stack, Box, Input, Button, Center, Tag } from "@chakra-ui/react";
import { useState } from "react";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "First Last",
    about: "Job Role, Experience, etc.",
    tools: ["TypeScript", "React"],
    image: "https://t4.ftcdn.net/jpg/00/64/67/27/240_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg",
  });

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  /* Button Component */
  type CustomButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
  };

function CustomButton({ children, onClick, type = "button" }: CustomButtonProps) {
    return (
      <Button
        borderColor="primary"
        w="full"
        _hover={{ bg: "primary", color: "white" }}
        variant="outline"
        size="lg"
        type={type}
        onClick={onClick}
      >
        {children}
      </Button>
    );
  } 

  /* Tags, for listing tools neatly */
const CustomTag = ({ tags }: { tags: string[] }) => (
  <HStack>
      <For each={tags}>
        {(tag) => (
          <Tag.Root size="xl">
            <Tag.Label>{tag}</Tag.Label>
          </Tag.Root>
        )}
      </For>
    </HStack>
);

/* Form Field Component for editing info */
type FormFieldProps = {
  label: string;
  placeholder: string;
  value: string | string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function FormField({ label, placeholder, value, onChange }: FormFieldProps) {
  return (
    <Box>
      <Box as="label" fontSize="sm" fontWeight="medium" mb="2" display="block">
        {label}
      </Box>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        borderColor="gray.300"
      />
    </Box>
  );
}

  // Edit Mode View
  if (isEditing) {
    return (
      <Stack>
        <Heading as="h1" size="4xl">
            Edit Your Profile
        </Heading>
      <Center h="70vh">
        <Stack align="center" gap="8" maxW="md" w="full">
          {/* Profile Image */}
          <Image
            src={profile.image}
            boxSize="200px"
            borderRadius="full"
            border="2px solid"
            borderColor="gray.300"
            fit="cover" 
            alt="Profile"
          />

          {/* Image Upload Input */}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            p="1"
            w="full"
          />

          {/* Form Fields */}
          <Stack w="full" gap="4">
            <FormField
              label="Name:"
              placeholder="Enter your name"
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <FormField
              label="About Me:"
              placeholder="Tell us about yourself"
              value={profile.about}
              onChange={(e) => handleChange("about", e.target.value)}
            />

            <FormField
              label="Tools Used:"
              placeholder="Your tools and technologies"
              value={profile.tools}
              onChange={(e) => handleChange("tools", e.target.value)}
            />
          </Stack>

          {/* Save profile Button */}
          <CustomButton onClick={handleSave} type="submit">
            Save
          </CustomButton>
        </Stack>
      </Center>
      </Stack>
    );
  }

  // Normal Profile View, from user perspective 
  // TODO: Need to add a view for how other users see profile? 
  return (
    <>
      <Heading as="h1" size="4xl">
        Profile
      </Heading>
      <Stack align="center">
        <Stack align="left" mt="10" gap="6" w="300px">
          <Image
            src={profile.image}
            boxSize="300px"
            borderRadius="full"
            border="1px solid"
            fit="cover"
            alt="Profile"
          />

          <Box
            as="section"
            fontSize="xl"
            display="flex"
            flexDir="column"
            gap="6"
          >
            <p>Name: {profile.name}</p>
            <p>About: {profile.about}</p>
            <p>Tools Used: <CustomTag tags={profile.tools} /></p>
          </Box>

          <CustomButton onClick={() => setIsEditing(true)}>
            Edit Profile
          </CustomButton>
      </Stack>
    </Stack>
    </>
  );
}

export default ProfilePage;