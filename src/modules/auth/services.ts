import { paths } from "@/utils/paths";
import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUser = cache(async (client: SupabaseClient) => {
	const userResponse = await client.auth.getUser();
	return userResponse.data.user;
});

export const getRequiredUser = async (client: SupabaseClient) => {
	const user = await getUser(client);

	if (!user) {
		redirect(paths.login);
	}

	return user;
};
