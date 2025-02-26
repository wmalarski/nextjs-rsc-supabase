"use server";

import { handleAction, parsePostgrestError } from "@/utils/actions";
import { paths } from "@/utils/paths";
import { decode } from "decode-formdata";
import { redirect } from "next/navigation";
import * as v from "valibot";
import { createClient } from "../supabase/server-action";

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
