import { PencilIcon } from "@/ui/icons/pencil-icon";
import { Button } from "@heroui/button";
import { useSubmission } from "@solidjs/router";
import { useId } from "react";
import { useActionOnSubmit } from "~/modules/common/utils/use-action-on-submit";
import {
	Dialog,
	DialogActions,
	DialogBox,
	DialogClose,
	DialogTitle,
	DialogTrigger,
	closeDialog,
} from "~/ui/dialog/dialog";
import { updateBookmarkAction } from "../client";
import { useBookmarksHistory } from "../contexts/bookmarks-history";
import type { BookmarkWithTagsModel } from "../services";
import { BookmarkFields } from "./bookmark-fields";

type UpdateBookmarkDialogProps = {
	bookmark: BookmarkWithTagsModel;
};

export const UpdateBookmarkDialog = ({
	bookmark,
}: UpdateBookmarkDialogProps) => {
	const dialogId = useId();
	const formId = useId();

	const submission = useSubmission(
		updateBookmarkAction,
		([form]) => form.get("bookmarkId") === String(bookmark.id),
	);

	const onSubmit = useActionOnSubmit({
		action: updateBookmarkAction,
		onSuccess: () => closeDialog(dialogId),
	});

	const initialData = () => {
		return {
			...bookmark,
			tags: bookmark.bookmarks_tags.map((bookmarkTag) => bookmarkTag.tags.id),
		};
	};

	const history = useBookmarksHistory();

	const onClick = () => {
		history().addToHistory(bookmark.id);
	};

	return (
		<>
			<DialogTrigger
				onClick={onClick}
				for={dialogId}
				size="sm"
				color="secondary"
			>
				<PencilIcon className="size-4" />
				Update
			</DialogTrigger>
			<Dialog id={dialogId}>
				<DialogBox>
					<DialogTitle>Update</DialogTitle>
					<form id={formId} onSubmit={onSubmit} className="flex flex-col gap-6">
						<input type="hidden" value={bookmark.id} name="bookmarkId" />
						<BookmarkFields
							initialData={initialData()}
							pending={submission.pending}
							result={submission.result}
						/>
					</form>
					<DialogActions>
						<DialogClose />
						<Button
							form={formId}
							color="primary"
							disabled={submission.pending}
							isLoading={submission.pending}
							type="submit"
						>
							Save
						</Button>
					</DialogActions>
				</DialogBox>
			</Dialog>
		</>
	);
};
