import { Button, Dialog, DialogOpenChangeDetails, Portal } from "@chakra-ui/react";
import { ReactNode } from "react";

interface FormDialogProps {
    children: ReactNode;
    title: ReactNode;
    body: ReactNode;
    isOpen?: boolean;
    onOpenChange?: ((details: DialogOpenChangeDetails) => void);
    /*
        Listens for when Chakra triggers Dialog to open. Useful for controlling when the Dialog opens.
        details.open is either true or false depending on whether the Dialog was triggered to be opened or closed 
        if (details.open) { } // Do something when Chakra wants to open the Dialog
        else { setDialogueOpen(details.open) } // Do something when Chakra wants to close the Dialog
    */
}

// Modal dialog/popup created on form submission
export function FormDialog({
    children,
    title,
    body,
    isOpen,
    onOpenChange
}: FormDialogProps) {

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop>
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>
                                    {title}
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                {body}
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
}