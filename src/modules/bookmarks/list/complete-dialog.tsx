import { useSubmission } from "@solidjs/router";
import { createMemo } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import { useActionOnSubmit } from "~/modules/common/utils/use-action-on-submit";
import { Button } from "~/ui/button/button";
import {
	Dialog,
	DialogActions,
	DialogBox,
	DialogClose,
	DialogTitle,
	DialogTrigger,
	closeDialog,
} from "~/ui/dialog/dialog";
import { CheckIcon } from "~/ui/icons/check-icon";
import { completeBookmarkAction } from "../client";
import { useBookmarksHistory } from "../contexts/bookmarks-history";
import type { BookmarkWithTagsModel } from "../server";
import { CompleteFields } from "./complete-fields";

type CompleteDialogProps = {
	bookmark: BookmarkWithTagsModel;
};

export const CompleteDialog = ({ bookmark }: CompleteDialogProps) => {
	const { t } = useI18n();

	const dialogId = createMemo(() => `complete-dialog-${bookmark.id}`);
	const formId = createMemo(() => `complete-form-${bookmark.id}`);

	const submission = useSubmission(
		completeBookmarkAction,
		([form]) => form.get("bookmarkId") === String(bookmark.id),
	);

	const history = useBookmarksHistory();

	const onClick = () => {
		history().addToHistory(bookmark.id);
	};

	const onSubmit = useActionOnSubmit({
		action: completeBookmarkAction,
		onSuccess: () => {
			closeDialog(dialogId());
		},
	});

	return (
		<>
			<DialogTrigger
				onClick={onClick}
				for={dialogId()}
				size="sm"
				color="primary"
			>
				<CheckIcon className="size-4" />
				{t("bookmarks.complete.complete")}
			</DialogTrigger>
			<Dialog id={dialogId()}>
				<DialogBox>
					<DialogTitle>{t("bookmarks.complete.complete")}</DialogTitle>
					<form id={formId()} onSubmit={onSubmit}>
						<input type="hidden" value={bookmark.id} name="bookmarkId" />
						<CompleteFields
							initialData={bookmark}
							pending={submission.pending}
							result={submission.result}
						/>
					</form>
					<DialogActions>
						<DialogClose />
						<Button
							form={formId()}
							color="primary"
							disabled={submission.pending}
							isLoading={submission.pending}
							type="submit"
						>
							{t("bookmarks.complete.complete")}
						</Button>
					</DialogActions>
				</DialogBox>
			</Dialog>
		</>
	);
};
