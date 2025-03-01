import { useId } from "react";
import type { TagModel } from "../services";

type UpdateTagDialogProps = {
	tag: TagModel;
};

export const UpdateTagDialog = ({ tag }: UpdateTagDialogProps) => {
	const { t } = useI18n();

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
				{t("common.update")}
			</DialogTrigger>
			<Dialog id={dialogId}>
				<DialogBox>
					<DialogTitle>{t("common.update")}</DialogTitle>
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
							{t("common.save")}
						</Button>
					</DialogActions>
				</DialogBox>
				<DialogBackdrop />
			</Dialog>
		</>
	);
};
