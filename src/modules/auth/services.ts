import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export const getUser = cache((client: SupabaseClient) => {
	return client.auth.getUser();
});
