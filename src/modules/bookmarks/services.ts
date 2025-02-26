"use server";

import {
	createSucccesResult,
	handleAction,
	parsePostgrestError,
} from "@/utils/actions";
import * as v from "valibot";
import { createClient } from "../supabase/server-action";
import { SELECT_BOOKMARKS_DEFAULT_LIMIT } from "./const";
import { createDoneSchema } from "./utils";

const createSelectBookmarksSchema = () => {
	return v.object({
		limit: v.optional(v.number()),
		offset: v.optional(v.number()),
		tags: v.array(v.number()),
		done: createDoneSchema(),
		random: v.boolean(),
		query: v.optional(v.string()),
	});
};

export type SelectBookmarksArgs = v.InferOutput<
	ReturnType<typeof createSelectBookmarksSchema>
>;

const selectBookmarksFromDb = async ({
	offset = 0,
	limit = SELECT_BOOKMARKS_DEFAULT_LIMIT,
	done,
	tags,
	random,
	query,
}: SelectBookmarksArgs) => {
	const supabase = await createClient();

	let builder = (
		tags && tags.length > 0
			? supabase
					.from("bookmarks")
					.select("*, bookmarks_tags!inner ( id, tags!inner ( id, name ) )", {
						count: "estimated",
					})
					.in("bookmarks_tags.tag_id", tags)
			: supabase
					.from("bookmarks")
					.select("*, bookmarks_tags ( id, tags ( id, name ) )", {
						count: "estimated",
					})
	).range(offset, offset + limit);

	if (random) {
		builder = builder.gte("random", Math.random()).order("random");
	} else {
		builder = builder.order("created_at", { ascending: false });
	}

	if (done === "completed") {
		builder = builder.eq("done", true);
	} else if (done === "uncompleted") {
		builder = builder.eq("done", false);
	}

	if (query && query.length > 0) {
		builder = builder.textSearch("title", query, { type: "phrase" });
	}

	const result = await builder;
	return result;
};

export type BookmarkWithTagsModel = NonNullable<
	Awaited<ReturnType<typeof selectBookmarksFromDb>>["data"]
>[0];

export const selectBookmarks = async (args: SelectBookmarksArgs) => {
	return handleAction({
		data: args,
		schema: createSelectBookmarksSchema(),
		handler: async (args) => {
			const result = await selectBookmarksFromDb(args);

			if (result.error) {
				return parsePostgrestError(result.error);
			}

			return createSucccesResult({ data: result.data, count: result.count });
		},
	});
};

const createSelectBookmarkSchema = () => {
	return v.object({
		bookmarkId: v.number(),
	});
};

export type SelectBookmarkArgs = v.InferOutput<
	ReturnType<typeof createSelectBookmarkSchema>
>;

export const selectBookmark = async (args: SelectBookmarkArgs) => {
	return handleAction({
		data: args,
		schema: createSelectBookmarkSchema(),
		handler: async (args) => {
			const supabase = await createClient();
			const result = await supabase
				.from("bookmarks")
				.select("*, bookmarks_tags ( id, tags ( id, name ) )")
				.eq("id", args.bookmarkId)
				.single();

			if (result.error) {
				return parsePostgrestError(result.error);
			}

			return createSucccesResult({ data: result.data });
		},
	});
};

const createSelectBookmarksByIdsSchema = () => {
	return v.object({
		bookmarkIds: v.array(v.number()),
	});
};

export type SelectBookmarksByIdsArgs = v.InferOutput<
	ReturnType<typeof createSelectBookmarksByIdsSchema>
>;

export const selectBookmarksByIds = async (args: SelectBookmarksByIdsArgs) => {
	return handleAction({
		data: args,
		schema: createSelectBookmarksByIdsSchema(),
		handler: async (args) => {
			const supabase = await createClient();
			const result = await supabase
				.from("bookmarks")
				.select("*, bookmarks_tags ( id, tags ( id, name ) )")
				.in("id", args.bookmarkIds);

			if (result.error) {
				return parsePostgrestError(result.error);
			}

			return createSucccesResult({ data: result.data });
		},
	});
};
