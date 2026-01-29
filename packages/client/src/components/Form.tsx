import { Button, Dialog, DialogOpenChangeDetails, Portal } from "@chakra-ui/react";
import { ReactNode } from "react";

export interface FormSubmissionModalParams {
    children: ReactNode;
    title?: ReactNode;
    body?: ReactNode;
    isOpen?: boolean;
    onOpenChange?: ((details: DialogOpenChangeDetails) => void)

}

export function FormSubmissionModal(params: FormSubmissionModalParams) {
    const {
        children,
        title,
        body,
        isOpen,
        onOpenChange
    } = params;

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