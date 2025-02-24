import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

export const createClient = cache(async () => {
	const resolvedCookies = await cookies();

	return createServerClient(
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
