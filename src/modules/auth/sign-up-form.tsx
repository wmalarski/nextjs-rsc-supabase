"use client";

import { paths } from "@/utils/paths";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { useActionState } from "react";
import { signUpAction } from "./actions";
import { AuthFields } from "./auth-fields";

export const SignUpForm = () => {
	const [signUpState, signUpFormAction, signUpPending] = useActionState(
		signUpAction,
		{ success: false },
	);

	return (
		<main>
			<Form action={signUpFormAction}>
				<AuthFields formState={signUpState} />
				<Button isLoading={signUpPending} type="submit">
					Sign Up
				</Button>
				<Link as={NextLink} href={paths.login}>
					Log In
				</Link>
			</Form>
		</main>
	);
};
