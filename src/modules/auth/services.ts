import { paths } from "@/utils/paths";
import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUser = cache((client: SupabaseClient) => {
	try {
		throw new Error();
	} catch (error) {
		const typed = error as Error;
		console.log("GET USER", typed.stack?.split("\n").slice(3, 4).join("\n"));
	}

	return client.auth.getUser();
});

export const getRequiredUser = (client: SupabaseClient) => {
	const user = getUser(client);

	if (!user) {
		redirect(paths.login);
	}

	return user;
};
