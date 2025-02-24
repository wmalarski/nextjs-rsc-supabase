import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Database } from "./types";

export const createClient = cache(async () => {
	const resolvedCookies = await cookies();

	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return resolvedCookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, options, value }) => {
						resolvedCookies.set(name, value, options);
					});
				},
			},
		},
	);
});
