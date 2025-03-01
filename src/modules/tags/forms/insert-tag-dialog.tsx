import { useSubmission } from "@solidjs/router";
import { useId } from "react";
import { useActionOnSubmit } from "~/modules/common/utils/use-action-on-submit";
import { Button } from "~/ui/button/button";
import {
	Dialog,
	DialogActions,
	DialogBackdrop,
	DialogBox,
	DialogClose,
	DialogTitle,
	DialogTrigger,
	closeDialog,
} from "~/ui/dialog/dialog";
import { PlusIcon } from "~/ui/icons/plus-icon";
import { insertTagAction } from "../client";
import { TagFields } from "./tag-fields";

export const InsertTagDialog = () => {
	const dialogId = useId();
	const formId = useId();

	const submission = useSubmission(insertTagAction);

	const onSubmit = useActionOnSubmit({
		action: insertTagAction,
		resetOnSuccess: true,
		onSuccess: () => closeDialog(dialogId),
	});

	return (
		<>
			<DialogTrigger color="primary" for={dialogId} size="sm">
				<PlusIcon className="size-4" />
				Add tag
			</DialogTrigger>
			<Dialog id={dialogId}>
				<DialogBox>
					<DialogTitle>Add tag</DialogTitle>
					<form id={formId} onSubmit={onSubmit}>
						<TagFields
							pending={submission.pending}
							result={
								submission.result?.success ? undefined : submission.result
							}
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
				<DialogBackdrop />
			</Dialog>
		</>
	);
};
