import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export const getUser = cache((client: SupabaseClient) => {
	try {
		throw new Error();
	} catch (error) {
		const typed = error as Error;
		console.log("GET USER");
		console.log(typed.stack?.split("\n").slice(3, 4).join("\n"));
	}

	return client.auth.getUser();
});
