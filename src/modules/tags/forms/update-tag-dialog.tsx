import { useId } from "react";
import type { TagModel } from "../services";

type UpdateTagDialogProps = {
	tag: TagModel;
};

export const UpdateTagDialog = ({ tag }: UpdateTagDialogProps) => {
	const dialogId = useId();
	const formId = useId();

	const submission = useSubmission(
		updateTagAction,
		([form]) => form.get("tagId") === String(tag.id),
	);

	const onSubmit = useActionOnSubmit({
		action: updateTagAction,
		onSuccess: () => closeDialog(dialogId),
	});

	return (
		<>
			<DialogTrigger for={dialogId} size="sm" color="secondary">
				<PencilIcon className="size-4" />
				Update
			</DialogTrigger>
			<Dialog id={dialogId}>
				<DialogBox>
					<DialogTitle>Update</DialogTitle>
					<form id={formId} onSubmit={onSubmit}>
						<input type="hidden" value={tag.id} name="tagId" />
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
