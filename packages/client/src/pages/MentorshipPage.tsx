import { Portal, Dialog, Flex, Button, Field, Stack, Heading} from "@chakra-ui/react"
import {useForm} from "react-hook-form"
import {useState} from "react"
import { Radio, RadioGroup } from "@/components/ui/radio";
import { Controller } from "react-hook-form";
import { InputTagsCombo } from "@/components/ui/input-tags-combo";

interface MentorshipData {
    mentorshipRole: "Mentor" | "Mentee";
    mentorQual: string[];
    menteeQual: string[];
}

function MentorshipPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<MentorshipData>();
    
    const onSubmit = handleSubmit((data) => {
        console.log(data);
        setDialogOpen(true);
    })

    const submitDialog = (
          <Dialog.Root placement="center"open={dialogOpen} onOpenChange={(e) => setDialogOpen(e.open)}>
                <Portal>
                    <Dialog.Backdrop>
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header><Dialog.Title>Thank you for signing up!</Dialog.Title></Dialog.Header>
                                <Dialog.Body>
                                    A moderator will review this and get back to you.
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                        <Button 
                                        variant="outline"
                                        borderColor="primary" 
                                        _hover={{ bg: "primary", color: "white" }}>
                                            Close
                                        </Button>
                                    </Dialog.ActionTrigger>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Dialog.Backdrop>
                </Portal>
            </Dialog.Root>
    )

    return (
        <form onSubmit={onSubmit}>
            <Stack gap="8" align="flex-start" maxW="70%">
                <Heading as="h1" size="4xl">
                    Mentorship
                </Heading>

                <Field.Root invalid={!!errors.mentorshipRole}>
                    <Field.Label>
                        Are you interested in giving or receiving mentorship?<span style={{ color: "red" }}>*</span>
                    </Field.Label>

                    <Controller
                        name="mentorshipRole"
                        control={control}
                        rules={{ required: "Please select Mentor or Mentee" }}
                        render={({ field }) => (
                        <RadioGroup value={field.value} onChange={field.onChange}>
                            <Stack gap="3" mt="2">
                            <Radio value="Mentor">Mentor</Radio>
                            <Radio value="Mentee">Mentee</Radio>
                            </Stack>
                        </RadioGroup>
                        )}
                    />

                <Field.ErrorText>{errors.mentorshipRole?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.mentorQual}>
                <Controller
                    name="mentorQual"
                    control={control}
                    rules={{
                    validate: (v) => (v?.length ?? 0) > 0 || "Please list your qualifications",
                    }}
                    render={({ field }) => (
                    <InputTagsCombo
                        label="If you would like to mentor, what qualifications do you have to share?:"
                        placeholder="Add skills"
                        value={field.value}
                        onChange={field.onChange}
                    />
                    )}
                />
                <Field.ErrorText>{errors.mentorQual?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.menteeQual}>
                <Controller
                    name="menteeQual"
                    control={control}
                    rules={{
                    validate: (v) => (v?.length ?? 0) > 0 || "Please add at least one preference or N/A for none",
                    }}
                    render={({ field }) => (
                    <InputTagsCombo
                        label="If you would like to be a mentee, what qualifications do you want from a mentor?:"
                        placeholder="Add skills"
                        value={field.value}
                        onChange={field.onChange}
                    />
                    )}
                />
                <Field.ErrorText>{errors.menteeQual?.message}</Field.ErrorText>
                </Field.Root>
                                
            </Stack>

            <Flex gap="4" w="100%" justify="flex-end" mt="8">
                <Button 
                    borderColor="primary" 
                    _hover={{ bg: "primary", color: "white" }}
                    size="xl" 
                    variant="outline" 
                    type="submit">
                        Submit
                </Button>
            </Flex>

            {submitDialog}
        </form>
    )
}

export default MentorshipPage