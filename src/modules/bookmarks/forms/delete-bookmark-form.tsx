import { useSubmission } from "@solidjs/router";
import { type Component, createMemo } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import { useActionOnSubmit } from "~/modules/common/utils/use-action-on-submit";
import { AlertDialog } from "~/ui/alert-dialog/alert-dialog";
import { DialogTrigger, closeDialog } from "~/ui/dialog/dialog";
import { TrashIcon } from "~/ui/icons/trash-icon";
import { deleteBookmarkAction } from "../client";
import type { BookmarkWithTagsModel } from "../server";

type DeleteBookmarkFormProps = {
  bookmark: BookmarkWithTagsModel;
};

export const DeleteBookmarkForm: Component<DeleteBookmarkFormProps> = (
  props,
) => {
  const { t } = useI18n();

  const dialogId = createMemo(() => `delete-dialog-${props.bookmark.id}`);

  const submission = useSubmission(
    deleteBookmarkAction,
    ([form]) => form.get("bookmarkId") === String(props.bookmark.id),
  );

  const onSubmit = useActionOnSubmit({
    action: deleteBookmarkAction,
    onSuccess: () => closeDialog(dialogId()),
  });

  return (
    <form onSubmit={onSubmit}>
      <input type="hidden" value={props.bookmark.id} name="bookmarkId" />
      <DialogTrigger for={dialogId()} color="error" size="sm">
        <TrashIcon class="size-4" />
        {t("common.delete")}
      </DialogTrigger>
      <AlertDialog
        confirm={t("common.delete")}
        confirmColor="error"
        title={t("common.delete")}
        pending={submission.pending}
        id={dialogId()}
        errorMessage={
          submission.result?.success ? undefined : submission.result?.error
        }
      />
    </form>
  );
};
