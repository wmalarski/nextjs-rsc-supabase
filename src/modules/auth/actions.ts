"use server";

import createClient from "../supabase/api";

export const loginAction = async (formData: FormData) => {
	const supabase = createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) {
		console.error(error);
	}
	router.push("/");
};

export const signUpAction = async (formData: FormData) => {
	const { error } = await supabase.auth.signUp({ email, password });
	if (error) {
		console.error(error);
	}
	router.push("/");
};
