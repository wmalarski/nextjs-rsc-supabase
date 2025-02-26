"use server";
import {
	createSucccesResult,
	handleAction,
	parsePostgrestError,
} from "@/utils/actions";
import * as v from "valibot";
import { createClient } from "../supabase/server-action";
import { SELECT_TAGS_DEFAULT_LIMIT } from "./const";

type SelectTagsArgs = {
	limit?: number;
	offset?: number;
};

const selectTagsFromDb = async ({
	limit = SELECT_TAGS_DEFAULT_LIMIT,
	offset = 0,
}: SelectTagsArgs) => {
	const supabase = await createClient();

	const builder = supabase
		.from("tags")
		.select("*", { count: "estimated" })
		.range(offset, offset + limit)
		.order("created_at");

	const result = await builder;
	return result;
};

export type TagModel = NonNullable<
	Awaited<ReturnType<typeof selectTagsFromDb>>["data"]
>[0];

export const selectTags = async (args: SelectTagsArgs) => {
	return handleAction({
		data: args,
		schema: v.object({
			limit: v.optional(v.number()),
			offset: v.optional(v.number()),
		}),
		handler: async (args) => {
			const result = await selectTagsFromDb(args);

			if (result.error) {
				return parsePostgrestError(result.error);
			}

			return createSucccesResult({ data: result.data, count: result.count });
		},
	});
};
