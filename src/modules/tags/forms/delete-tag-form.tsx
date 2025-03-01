import { useId } from "react";
import type { TagModel } from "../services";

type DeleteTagFormProps = {
	tag: TagModel;
};

export const DeleteTagForm = ({ tag }: DeleteTagFormProps) => {
	const { t } = useI18n();

	const dialogId = useId();

	const submission = useSubmission(
		deleteTagAction,
		([form]) => form.get("tagId") === String(tag.id),
	);

	const onSubmit = useActionOnSubmit({
		action: deleteTagAction,
		onSuccess: () => closeDialog(dialogId),
	});

	return (
		<form onSubmit={onSubmit}>
			<input type="hidden" value={tag.id} name="tagId" />
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
