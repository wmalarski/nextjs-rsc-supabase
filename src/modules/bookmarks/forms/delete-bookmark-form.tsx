import { useSubmission } from "@solidjs/router";
import { useId } from "react";
import { useI18n } from "~/modules/common/contexts/i18n";
import { useActionOnSubmit } from "~/modules/common/utils/use-action-on-submit";
import { AlertDialog } from "~/ui/alert-dialog/alert-dialog";
import { DialogTrigger, closeDialog } from "~/ui/dialog/dialog";
import { TrashIcon } from "~/ui/icons/trash-icon";
import { deleteBookmarkAction } from "../client";
import type { BookmarkWithTagsModel } from "../services";

type DeleteBookmarkFormProps = {
	bookmark: BookmarkWithTagsModel;
};

export const DeleteBookmarkForm = ({ bookmark }: DeleteBookmarkFormProps) => {
	const { t } = useI18n();

	const dialogId = useId();

	const submission = useSubmission(
		deleteBookmarkAction,
		([form]) => form.get("bookmarkId") === String(bookmark.id),
	);

	const onSubmit = useActionOnSubmit({
		action: deleteBookmarkAction,
		onSuccess: () => closeDialog(dialogId),
	});

	return (
		<form onSubmit={onSubmit}>
			<input type="hidden" value={bookmark.id} name="bookmarkId" />
			<DialogTrigger for={dialogId} color="error" size="sm">
				<TrashIcon className="size-4" />
				{t("common.delete")}
			</DialogTrigger>
			<AlertDialog
				confirm={t("common.delete")}
				confirmColor="error"
				title={t("common.delete")}
				pending={submission.pending}
				id={dialogId}
				errorMessage={
					submission.result?.success ? undefined : submission.result?.error
				}
			/>
		</form>
	);
};
