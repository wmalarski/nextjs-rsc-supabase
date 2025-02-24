import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "../auth/services";

export async function updateSession(request: NextRequest) {
	let response = NextResponse.next({
		request: { headers: request.headers },
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) => {
						request.cookies.set(name, value);
					});

					response = NextResponse.next({
						request: { headers: request.headers },
					});

					cookiesToSet.forEach(({ name, options, value }) => {
						response.cookies.set(name, value, options);
					});
				},
			},
		},
	);

	await getUser(supabase);

	return response;
}
