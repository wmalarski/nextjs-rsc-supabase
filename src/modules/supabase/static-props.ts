import { createClient as createClientPrimitive } from "@supabase/supabase-js";
import type { Database } from "./types";

export const createClient = () => {
	return createClientPrimitive<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	);
};
