import { type createServerClient, serializeCookieHeader } from "@supabase/ssr";
import type { NextApiRequest } from "next";
import type { IncomingMessage, ServerResponse } from "node:http";

type ServerOptionsArgs = {
	request: Pick<NextApiRequest, "cookies">;
	response: Pick<ServerResponse<IncomingMessage>, "setHeader">;
};

type ServerOptionsReturn = Parameters<typeof createServerClient>[2];

export const serverOptions = ({
	request,
	response,
}: ServerOptionsArgs): ServerOptionsReturn => {
	return {
		cookies: {
			getAll() {
				return Object.keys(request.cookies).map((name) => ({
					name,
					value: request.cookies[name] || "",
				}));
			},
			setAll(cookiesToSet) {
				response.setHeader(
					"Set-Cookie",
					cookiesToSet.map(({ name, value, options }) =>
						serializeCookieHeader(name, value, options),
					),
				);
			},
		},
	};
};
