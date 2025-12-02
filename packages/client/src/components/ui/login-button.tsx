import { CloseButton, Dialog, IconButton, Portal } from "@chakra-ui/react";
import { LuCircleUserRound } from "react-icons/lu";
import { LoginForm } from "./login-form";

export const LoginButton = () => {

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<IconButton bg="primary" _dark={{ bg: "primary", color: "white" }}>
					<LuCircleUserRound></LuCircleUserRound>
				</IconButton>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Login</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<LoginForm></LoginForm>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.CloseTrigger asChild>
								<CloseButton></CloseButton>
							</Dialog.CloseTrigger>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}