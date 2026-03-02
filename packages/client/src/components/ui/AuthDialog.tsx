import { Button, CloseButton, Dialog, Field, Flex, IconButton, Input, Portal } from "@chakra-ui/react";
import { LuCircleUserRound } from "react-icons/lu";
import { useState } from "react";
import { PasswordInput } from "./password-input";
import { signIn, signUp } from "@/lib/auth";

export const AuthDialog = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.SubmitEvent) => {
      e.preventDefault();

      if(isRegistering){
        await signUp.email({
          name: username,
          email,
          password,
          callbackURL: '/',
        });
      } else {
        await signIn.email({
          email,
          password,
          callbackURL: '/',
        });
      }
    }
  
    return (
      <Flex as='form' onSubmit={handleSubmit} flexDir="column">
        {isRegistering && (
          <Field.Root> {/* @todo: ask yoonha if this is ok */}
            <Field.Label>Username</Field.Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </Field.Root>
        )}
        
        <Field.Root mt="4">
          <Field.Label>Email</Field.Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field.Root>
        <Field.Root mt="4">
          <Field.Label>Password</Field.Label>
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field.Root>

        <Button 
          type="submit" 
          mt="8" 
          bg="primary" 
        >
          {isRegistering ? 'Register' : 'Login'}
        </Button>

        <Button
          variant='ghost'
          mt="4"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering 
            ? 'Already have an account?'
            : 'Create an account'}

        </Button>
      </Flex>
    )
  }

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
							<Dialog.Title>{isRegistering ? 'Register' : 'Login'}</Dialog.Title>
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