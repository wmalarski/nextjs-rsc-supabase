"use server";

import {
	type ActionResult,
	handleAction,
	parseAuthError,
} from "@/utils/actions";
import { paths } from "@/utils/paths";
import { decode } from "decode-formdata";
import { redirect } from "next/navigation";
import * as v from "valibot";
import { createClient } from "../supabase/server-action";

export const loginAction = async (
	_previous: ActionResult,
	formData: FormData,
) => {
	return handleAction({
		data: decode(formData),
		schema: v.object({
			email: v.pipe(v.string(), v.email()),
			password: v.string(),
		}),
		handler: async (args) => {
			const supabase = await createClient();
			const { error } = await supabase.auth.signInWithPassword(args);

			if (error) {
				return parseAuthError(error);
			}

			redirect(paths.home);
		},
	});
};

export const signUpAction = async (
	_previous: ActionResult,
	formData: FormData,
) => {
	return handleAction({
		data: decode(formData),
		schema: v.object({
			email: v.pipe(v.string(), v.email()),
			password: v.string(),
		}),
		handler: async (args) => {
			const supabase = await createClient();
			const { error } = await supabase.auth.signUp(args);

			if (error) {
				return parseAuthError(error);
			}

			redirect(paths.login);
		},
	});
};

export const signOutAction = async () => {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		return parseAuthError(error);
	}

	redirect(paths.home);
};
