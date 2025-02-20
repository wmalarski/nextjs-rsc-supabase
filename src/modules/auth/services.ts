import type { SupabaseClient } from "@supabase/supabase-js";

export const getUser = (client: SupabaseClient) => {
	console.log("getUser");
	return client.auth.getUser();
};
