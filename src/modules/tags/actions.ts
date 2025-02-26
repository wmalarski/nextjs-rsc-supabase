"use server";

import {
	createSucccesResult,
	handleAction,
	parsePostgrestError,
} from "@/utils/actions";
import { decode } from "decode-formdata";
import * as v from "valibot";
import { createClient } from "../supabase/server-action";

export const insertTag = async (form: FormData) => {
	return handleAction({
		data: decode(form),
		schema: v.object({ name: v.string() }),
		handler: async (args) => {
			const supabase = await createClient();
			const result = await supabase.from("tags").insert(args);

			if (result.error) {
				return parsePostgrestError(result.error);
			}

			// return json(rpcSuccessResult({}), { revalidate: TAGS_QUERY_KEY });
			return createSucccesResult({});
		},
	});
};

export const deleteTag = async (form: FormData) => {
	return handleAction({
		data: decode(form, { numbers: ["tagId"] }),
		schema: v.object({ tagId: v.number() }),
		handler: async (args) => {
			const supabase = await createClient();
			const result = await supabase.from("tags").delete().eq("id", args.tagId);

			if (result.error) {
				return parsePostgrestError(result.error);
			}

			// return json(createSucccesResult({}), { revalidate: TAGS_QUERY_KEY });
			return createSucccesResult({});
		},
	});
};

export const updateTag = async (form: FormData) => {
	return handleAction({
		data: decode(form, { numbers: ["tagId"] }),
		schema: v.object({ tagId: v.number(), name: v.string() }),
		handler: async (args) => {
			const { tagId, ...values } = args;

			const supabase = await createClient();
			const result = await supabase.from("tags").update(values).eq("id", tagId);

			if (result.error) {
				return parsePostgrestError(result.error);
			}

			return createSucccesResult({});
			// return json(createSucccesResult({}), { revalidate: TAGS_QUERY_KEY });
		},
	});
};
