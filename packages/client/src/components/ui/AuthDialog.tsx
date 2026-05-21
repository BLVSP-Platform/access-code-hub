import { Button, CloseButton, Dialog, Field, Flex, Input, Portal, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn, signUp } from "@/lib/auth";
import { PasswordInput } from "./password-input";

interface LoginFormProps {
	isRegistering: boolean;
	setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>;
	registerSuccess: string;
	setRegisterSuccess: React.Dispatch<React.SetStateAction<string>>;
}

interface AuthFormData {
	username?: string;
	email: string;
	password: string;
}

type SignInResult = Awaited<ReturnType<typeof signIn.email>>;
type SignUpResult = Awaited<ReturnType<typeof signUp.email>>;

// @todo: more robust error displays
const LoginForm = ({ isRegistering, setIsRegistering, registerSuccess, setRegisterSuccess }: LoginFormProps) => {
	const [loading, setLoading] = useState(false);
	const [authError, setAuthError] = useState("");
	const { register, handleSubmit, reset } = useForm<AuthFormData>();

	const onSubmit = async (data: AuthFormData) => {
		setAuthError("");
		setLoading(true);

		try {
			let result: SignInResult | SignUpResult;

			if (isRegistering) {
				result = await signUp.email({
					name: data.username || "",
					email: data.email,
					password: data.password,
					callbackURL: "/",
				});
			} else {
				result = await signIn.email({
					email: data.email,
					password: data.password,
					callbackURL: "/",
				});
			}

			if (result?.error) {
				const rawMessage = result.error.message ?? "Authentication failed.";
				const cleanedMessage = rawMessage.replace(/\[.*?\]\s*/, "");
				setAuthError(cleanedMessage);
				return;
			}

			if (isRegistering) {
				reset();
				setAuthError("");
				setIsRegistering(false);
				setRegisterSuccess("Account created successfully! Please log in.");
				return;
			}
		} catch (err: unknown) {
			console.error(err);

			if (err instanceof Error) {
				setAuthError(err.message);
			} else {
				setAuthError("Something went wrong. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	const formLabel = isRegistering ? "Register a new account" : "Log in to your account";

	return (
		<Flex as="form" onSubmit={handleSubmit(onSubmit)} flexDir="column" aria-label={formLabel} aria-busy={loading}>
			{isRegistering && (
				<Field.Root>
					<Field.Label>Username</Field.Label>
					<Input
						disabled={loading}
						autoComplete="username"
						{...register("username")}
						onChange={() => setAuthError("")}
					/>
				</Field.Root>
			)}

			<Field.Root mt="4">
				<Field.Label>Email</Field.Label>
				<Input
					disabled={loading}
					autoComplete="email"
					type="email"
					{...register("email", { required: true })}
					onChange={() => setAuthError("")}
				/>
			</Field.Root>

			<Field.Root mt="4">
				<Field.Label>Password</Field.Label>
				<PasswordInput
					disabled={loading}
					autoComplete={isRegistering ? "new-password" : "current-password"}
					{...register("password", { required: true })}
					onChange={() => setAuthError("")}
				/>
			</Field.Root>

			{registerSuccess && (
				<Text color="green" mt="2" role="status" aria-live="polite">
					{registerSuccess}
				</Text>
			)}

			{authError && (
				<Text color="red" mt="2" role="alert" aria-live="assertive">
					{authError}
				</Text>
			)}

			<Button
				type="submit"
				mt="8"
				bg="primary"
				loading={loading}
				disabled={loading}
				aria-label={loading ? (isRegistering ? "Registering…" : "Logging in…") : undefined}
			>
				{isRegistering ? "Register" : "Login"}
			</Button>

			<Button
				type="button"
				variant="ghost"
				mt="4"
				onClick={() => {
					setIsRegistering(!isRegistering);
					setAuthError("");
					setRegisterSuccess("");
				}}
			>
				{isRegistering ? "Already have an account?" : "Create an account"}
			</Button>
		</Flex>
	);
};

interface AuthDialogProps {
	children: React.ReactNode;
}

export const AuthDialog = ({ children }: AuthDialogProps) => {
	const [isRegistering, setIsRegistering] = useState(false);
	const [registerSuccess, setRegisterSuccess] = useState("");

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>{isRegistering ? "Register" : "Login"}</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<LoginForm
								isRegistering={isRegistering}
								setIsRegistering={setIsRegistering}
								registerSuccess={registerSuccess}
								setRegisterSuccess={setRegisterSuccess}
							/>
						</Dialog.Body>
						<Dialog.CloseTrigger asChild>
							<CloseButton aria-label="Close login dialog" />
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
