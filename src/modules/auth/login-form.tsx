"use client";

import { paths } from "@/utils/paths";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { useActionState } from "react";
import { loginAction } from "./actions";
import { AuthFields } from "./auth-fields";

export const LoginForm = () => {
	const [state, formAction, pending] = useActionState(loginAction, {
		success: false,
	});

	return (
		<main>
			<Form action={formAction}>
				<AuthFields formState={state} />
				<Button isLoading={pending} type="submit">
					Log In
				</Button>
				<Link as={NextLink} href={paths.signUp}>
					Sign Up
				</Link>
			</Form>
		</main>
	);
};
