import { createServerClient } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";
import { serverOptions } from "./server-options";
import type { Database } from "./types";

export default function createClient(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		serverOptions({ request: req, response: res }),
	);
}
