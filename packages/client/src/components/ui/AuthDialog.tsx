import { Button, CloseButton, Dialog, Field, Flex, IconButton, Input, Portal, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LuCircleUserRound } from "react-icons/lu";
import { signIn, signUp } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";
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

	return (
		<Flex as="form" onSubmit={handleSubmit(onSubmit)} flexDir="column">
			{isRegistering && (
				<Field.Root>
					<Field.Label>Username</Field.Label>
					<Input disabled={loading} {...register("username")} onChange={() => setAuthError("")} />
				</Field.Root>
			)}

			<Field.Root mt="4">
				<Field.Label>Email</Field.Label>
				<Input
					disabled={loading}
					{...register("email", { required: true })}
					onChange={() => setAuthError("")}
				/>
			</Field.Root>
			<Field.Root mt="4">
				<Field.Label>Password</Field.Label>
				<PasswordInput
					disabled={loading}
					{...register("password", { required: true })}
					onChange={() => setAuthError("")}
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

			<Button type="submit" mt="8" bg="primary" loading={loading} disabled={loading}>
				{isRegistering ? "Register" : "Login"}
			</Button>

			<Button
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

export const AuthDialog = () => {
	const [isRegistering, setIsRegistering] = useState(false);
	const [registerSuccess, setRegisterSuccess] = useState("");
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	if (isAuthenticated) {
		return (
			<IconButton
				bg="primary"
				_dark={{ bg: "primary", color: "white" }}
				onClick={() => navigate("/profile")}
			>
				<LuCircleUserRound></LuCircleUserRound>
			</IconButton>
		);
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
						<Dialog.Footer>
							<Dialog.CloseTrigger asChild>
								<CloseButton />
							</Dialog.CloseTrigger>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
