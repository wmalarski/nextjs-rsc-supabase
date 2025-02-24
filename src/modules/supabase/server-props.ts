import { createServerClient } from "@supabase/ssr";
import type { GetServerSidePropsContext } from "next";
import { serverOptions } from "./server-options";
import type { Database } from "./types";

export const createClient = ({
	req,
	res,
}: Pick<GetServerSidePropsContext, "req" | "res">) => {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		serverOptions({ request: req, response: res }),
	);
};
