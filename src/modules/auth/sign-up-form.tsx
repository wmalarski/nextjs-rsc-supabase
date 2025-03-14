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
	const [state, formAction, pending] = useActionState(signUpAction, {
		success: false,
	});

	return (
		<Form action={formAction}>
			<AuthFields formState={state} />
			<Button isLoading={pending} type="submit">
				Sign Up
			</Button>
			<Link as={NextLink} href={paths.login}>
				Log In
			</Link>
		</Form>
	);
};
