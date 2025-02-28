import type { Component } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import type { RpcFailure } from "~/modules/common/server/helpers";
import { Checkbox } from "~/ui/checkbox/checkbox";
import { FieldError } from "~/ui/field-error/field-error";
import { FormControl } from "~/ui/form-control/form-control";
import { FormError } from "~/ui/form-error/form-error";
import { Label, LabelText } from "~/ui/label/label";
import { TextFieldInput } from "~/ui/text-field/text-field";
import { getInvalidStateProps } from "~/ui/utils/get-invalid-state-props";
import type { BookmarkWithTagsModel } from "../server";

type CompleteFieldsProps = {
  initialData?: BookmarkWithTagsModel;
  pending?: boolean;
  result?: RpcFailure;
};

export const CompleteFields: Component<CompleteFieldsProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="flex flex-col gap-4">
      <FormError message={props.result?.error} />

      <FormControl direction="horizontal">
        <Checkbox
          id="done"
          name="done"
          checked={props.initialData?.done}
          disabled={props.pending}
          {...getInvalidStateProps({
            errorMessageId: "title-error",
            isInvalid: !!props.result?.errors?.done,
          })}
        />
        <Label for="done">
          <LabelText>{t("bookmarks.complete.done")}</LabelText>
        </Label>
        <FieldError id="done-error" message={props.result?.errors?.done} />
      </FormControl>

      <FormControl>
        <Label for="rate">
          <LabelText>{t("bookmarks.complete.rate")}</LabelText>
        </Label>
        <TextFieldInput
          id="rate"
          name="rate"
          placeholder={t("bookmarks.complete.rate")}
          type="number"
          min={0}
          max={10}
          step={0.1}
          value={props.initialData?.rate ?? 5}
          disabled={props.pending}
          variant="bordered"
          {...getInvalidStateProps({
            errorMessageId: "rate-error",
            isInvalid: !!props.result?.errors?.rate,
          })}
        />
        <FieldError id="text-error" message={props.result?.errors?.text} />
      </FormControl>

      <FormControl>
        <Label for="note">
          <LabelText>{t("bookmarks.complete.note")}</LabelText>
        </Label>
        <TextFieldInput
          id="note"
          name="note"
          placeholder={t("bookmarks.complete.note")}
          value={props.initialData?.note ?? ""}
          disabled={props.pending}
          variant="bordered"
          {...getInvalidStateProps({
            errorMessageId: "note-error",
            isInvalid: !!props.result?.errors?.note,
          })}
        />
        <FieldError id="url-note" message={props.result?.errors?.note} />
      </FormControl>
    </div>
  );
};
