import { Button, Field, Flex, Input } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";
import { signIn, signUp } from "@/lib/auth";
import { PasswordInput } from "./password-input";

export const LoginForm = () => {
	const login: MouseEventHandler = (e) => {
		e.preventDefault();
		signIn.email({
			email: "",
			password: "",
			callbackURL: "/",
		});
	};

	const register: MouseEventHandler = (e) => {
		e.preventDefault();
		signUp.email({
			name: "",
			email: "",
			password: "",
			callbackURL: "/",
		});
	};

	return (
		<Flex flexDir="column">
			<Field.Root>
				<Field.Label>Email</Field.Label>
				<Input />
			</Field.Root>
			<Field.Root mt="4">
				<Field.Label>Password</Field.Label>
				<PasswordInput />
			</Field.Root>
			<Button type="submit" mt="8" bg="primary" onClick={login}>
				Login
			</Button>
			<Button type="submit" mt="4" bg="primary" onClick={register}>
				Register
			</Button>
		</Flex>
	);
};
