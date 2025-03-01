import { useSubmission } from "@solidjs/router";
import { useId } from "react";
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
import type { BookmarkWithTagsModel } from "../services";
import { CompleteFields } from "./complete-fields";

type CompleteDialogProps = {
	bookmark: BookmarkWithTagsModel;
};

export const CompleteDialog = ({ bookmark }: CompleteDialogProps) => {
	const dialogId = useId();
	const formId = useId();

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
			closeDialog(dialogId);
		},
	});

	return (
		<>
			<DialogTrigger onClick={onClick} for={dialogId} size="sm" color="primary">
				<CheckIcon className="size-4" />
				Complete
			</DialogTrigger>
			<Dialog id={dialogId}>
				<DialogBox>
					<DialogTitle>Complete</DialogTitle>
					<form id={formId} onSubmit={onSubmit}>
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
							form={formId}
							color="primary"
							disabled={submission.pending}
							isLoading={submission.pending}
							type="submit"
						>
							Complete
						</Button>
					</DialogActions>
				</DialogBox>
			</Dialog>
		</>
	);
};
