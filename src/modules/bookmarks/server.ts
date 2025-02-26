"use server";

import {
	createSucccesResult,
	handleAction,
	parsePostgrestError,
} from "@/utils/actions";
import { paths } from "@/utils/paths";
import { decode } from "decode-formdata";
import { redirect } from "next/navigation";
import * as v from "valibot";
import { createClient } from "../supabase/server-action";
import { SELECT_BOOKMARKS_DEFAULT_LIMIT } from "./const";
import { createDoneSchema } from "./utils";

export const insertBookmark = async (form: FormData) => {
	return handleAction({
		data: decode(form, { arrays: ["tags[]"], numbers: ["tags[]"] }),
		schema: v.object({
			title: v.optional(v.string()),
			text: v.optional(v.string()),
			url: v.optional(v.string()),
			preview: v.optional(v.string()),
			"tags[]": v.optional(v.array(v.number()), []),
		}),
		handler: async (args) => {
			const supabase = await createClient();
			const { "tags[]": tags, ...values } = args;

			const result = await supabase
				.from("bookmarks")
				.insert(values)
				.select()
				.single();

			if (result.error) {
				return parsePostgrestError(result.error);
			}

			const tagsResult = await supabase.from("bookmarks_tags").insert(
				tags.map((tagId) => ({
					bookmark_id: result.data.id,
					tag_id: tagId,
				})),
			);

			if (tagsResult.error) {
				return parsePostgrestError(tagsResult.error);
			}

			redirect(paths.home);
		},
	});
};

export const deleteBookmark = async (form: FormData) => {
	return handleAction({
		data: decode(form, { numbers: ["bookmarkId"] }),
		schema: v.object({ bookmarkId: v.number() }),
		handler: async (args) => {
			const supabase = await createClient();

			const result = await supabase
				.from("bookmarks")
				.delete()
				.eq("id", args.bookmarkId);

			if (result.error) {
				return parsePostgrestError(result.error);
			}

			// throw reload({ revalidate: BOOKMARKS_QUERY_KEY });
			redirect(paths.home);
		},
	});
};

type UpdateBookmarkTagsArgs = {
	bookmarkId: number;
	existingTags: { tag_id: number; id: number }[];
	formTags: number[];
};

const updateBookmarkTags = async ({
	bookmarkId,
	existingTags,
	formTags,
}: UpdateBookmarkTagsArgs) => {
	const supabase = await createClient();

	const existingTagsSet = new Set(existingTags.map((tag) => tag.tag_id));
	const formTagsSet = new Set(formTags);

	const toAdd = formTags.filter((tag) => !existingTagsSet.has(tag));
	const toRemove = existingTags
		.filter((tag) => !formTagsSet.has(tag.tag_id))
		.map((tag) => tag.id);

	return Promise.all([
		supabase.from("bookmarks_tags").delete().in("id", toRemove),
		supabase.from("bookmarks_tags").insert(
			toAdd.map((tagId) => ({
				bookmark_id: bookmarkId,
				tag_id: tagId,
			})),
		),
	]);
};

export const updateBookmark = async (form: FormData) => {
	return handleAction({
		data: decode(form, {
			numbers: ["bookmarkId", "tags[]"],
			arrays: ["tags[]"],
		}),
		schema: v.object({
			bookmarkId: v.number(),
			text: v.optional(v.string()),
			title: v.optional(v.string()),
			url: v.optional(v.string()),
			preview: v.optional(v.string()),
			"tags[]": v.optional(v.array(v.number()), []),
		}),
		handler: async (args) => {
			const supabase = await createClient();
			const { bookmarkId, "tags[]": tags, ...values } = args;

			const result = await supabase
				.from("bookmarks")
				.update(values)
				.eq("id", bookmarkId)
				.select("*, bookmarks_tags ( id, tag_id )")
				.single();

			if (result.error) {
				return parsePostgrestError(result.error);
			}

			const [deleteResult, insertResult] = await updateBookmarkTags({
				bookmarkId,
				existingTags: result.data.bookmarks_tags,
				formTags: tags,
			});

			if (deleteResult.error) {
				return parsePostgrestError(deleteResult.error);
			}

			if (insertResult.error) {
				return parsePostgrestError(insertResult.error);
			}

			// throw reload({ revalidate: BOOKMARKS_QUERY_KEY });
			redirect(paths.home);
		},
	});
};

export const completeBookmark = async (form: FormData) => {
	return handleAction({
		data: decode(form, {
			numbers: ["bookmarkId", "rate"],
			booleans: ["done"],
		}),
		schema: v.object({
			bookmarkId: v.number(),
			done: v.optional(v.boolean()),
			note: v.optional(v.string()),
			rate: v.optional(v.number()),
		}),
		handler: async (args) => {
			const supabase = await createClient();
			const { bookmarkId, ...values } = args;

			const result = await supabase
				.from("bookmarks")
				.update({ ...values, done_at: new Date().toISOString() })
				.eq("id", bookmarkId);

			if (result.error) {
				return parsePostgrestError(result.error);
			}

			// throw reload({ revalidate: BOOKMARKS_QUERY_KEY });
			redirect(paths.home);
		},
	});
};

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
