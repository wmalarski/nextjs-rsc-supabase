import { createClient as createClientPrimitive } from "@supabase/supabase-js";

export const createClient = () => {
	return createClientPrimitive(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	);
};
