"use client";
import type { ActionResult } from "@/utils/actions";
import { Input } from "@heroui/input";

type AuthFieldsProps = {
	formState?: ActionResult;
};

export const AuthFields = ({ formState }: AuthFieldsProps) => {
	const errorState = formState?.success ? undefined : formState;

	return (
		<div className="flex flex-col gap-2">
			<Input
				name="email"
				type="email"
				label="Email:"
				errorMessage={errorState?.errors?.email}
			/>
			<Input
				name="password"
				type="password"
				label="Password:"
				errorMessage={errorState?.errors?.password}
			/>
		</div>
	);
};
