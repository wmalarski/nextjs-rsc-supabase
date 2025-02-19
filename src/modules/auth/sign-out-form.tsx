"use client";

import { Button } from "@heroui/button";
import { useActionState } from "react";
import { signOutAction } from "./actions";

export const SignOutForm = () => {
	const [_signUpState, formAction, pending] = useActionState(signOutAction, {
		success: false,
	});

	return (
		<form action={formAction}>
			<Button isLoading={pending} type="submit">
				Sign Out
			</Button>
		</form>
	);
};
