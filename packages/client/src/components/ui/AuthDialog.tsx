import { Button, CloseButton, Dialog, Field, Flex, IconButton, Input, Portal, Text } from "@chakra-ui/react";
import { LuCircleUserRound } from "react-icons/lu";
import { useState } from "react";
import { PasswordInput } from "./password-input";
import { signIn, signUp } from "@/lib/auth";

interface LoginFormProps {
  isRegistering: boolean;
  setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>;
  registerSuccess: string;
  setRegisterSuccess: React.Dispatch<React.SetStateAction<string>>;
}

const LoginForm = ({ 
  isRegistering,
  setIsRegistering,
  registerSuccess,
  setRegisterSuccess,
}: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(''); // @TODO: would be nicer if we differentiated and displayed errors by field 

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    
    try {
      let result;

      if(isRegistering){
        result = await signUp.email({
          name: username,
          email,
          password,
          callbackURL: '/',
        });
      } else {
        result = await signIn.email({
          email,
          password,
          callbackURL: '/',
        });
      }

      if(result?.error){
        const rawMessage = result.error.message ?? "Authentication failed.";
        const cleanedMessage = rawMessage.replace(/\[.*?\]\s*/, ''); // @todo: kinda scuffed
        setAuthError(cleanedMessage);
        return;
      }

      if(isRegistering) {
        setUsername('');
        setPassword('');
        setAuthError('');
        setIsRegistering(false);
        setRegisterSuccess('Account created successfully! Please log in.');
        return;
      }
    } catch (err: unknown) {
      console.error(err);

      if(err instanceof Error){
        setAuthError(err.message);
      } else {
        setAuthError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
    
  }

  return (
    <Flex as='form' onSubmit={handleSubmit} flexDir="column">
      {isRegistering && (
        <Field.Root> 
          <Field.Label>Username</Field.Label>
          <Input 
            value={username} 
            disabled={loading}
            onChange={(e) => {
              setUsername(e.target.value);
              setAuthError('');
            }}
          />
        </Field.Root>
      )}
      
      <Field.Root mt="4">
        <Field.Label>Email</Field.Label>
        <Input 
          value={email} 
          disabled={loading}
          onChange={(e) => {
            setEmail(e.target.value)
            setAuthError('');
          }}
        />
      </Field.Root>
      <Field.Root mt="4">
        <Field.Label>Password</Field.Label>
        <PasswordInput 
          value={password} 
          disabled={loading}
          onChange={(e) => {
            setPassword(e.target.value)
            setAuthError('');
          }} 
        />
      </Field.Root>

      {registerSuccess && (
        <Text color="green" mt="2">
          {registerSuccess}
        </Text>
      )}

      {authError && (
        <Text color="red" mt="2">
          {authError}
        </Text>
      )}

      <Button 
        type="submit" 
        mt="8" 
        bg="primary" 
        loading={loading}
        disabled={loading}
      >
        {isRegistering ? 'Register' : 'Login'}
      </Button>

      <Button
        variant='ghost'
        mt="4"
        onClick={() => {
          setIsRegistering(!isRegistering)
          setAuthError('');
          setRegisterSuccess('');
        }}
      >
        {isRegistering 
          ? 'Already have an account?'
          : 'Create an account'}

      </Button>
    </Flex>
  )
}

export const AuthDialog = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState('');

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
							<LoginForm 
                isRegistering={isRegistering} 
                setIsRegistering={setIsRegistering} 
                registerSuccess={registerSuccess}
                setRegisterSuccess={setRegisterSuccess}
              />
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.CloseTrigger asChild>
								<CloseButton />
							</Dialog.CloseTrigger>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}