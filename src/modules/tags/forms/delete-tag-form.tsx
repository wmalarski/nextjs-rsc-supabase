import { useId } from "react";
import type { TagModel } from "../services";

type DeleteTagFormProps = {
	tag: TagModel;
};

export const DeleteTagForm = ({ tag }: DeleteTagFormProps) => {
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
				Delete
			</DialogTrigger>
			<AlertDialog
				confirm="Delete"
				confirmColor="error"
				title="Delete"
				pending={submission.pending}
				id={dialogId}
				errorMessage={
					submission.result?.success ? undefined : submission.result?.error
				}
			/>
		</form>
	);
};
